const _ = require('lodash')
const { v4: uuidv4 } = require('uuid')
const { functions, db, bucket } = require('../firebase')
const { firebaseDate } = require('../admin/api/utils/date')

const TYPE = {
  LAST: 'last',
  NEXT: 'next',
  PREVIOUS: 'previous',
}

const LIMIT_NEED_PUBLISH_MODELS = 1000

const loadStoryPage = functions.https.onCall(async (data, context) => {
// const loadStoryPage = async(data, context) => {
  const { 
    type,
    currentStepId,  // текущий в игре (не last), чтоб подгружать previous
  } = data
  const userId = context.auth.uid

  if (!userId) return Promise.reject(new Error('doesn`t have userId'))
  if (!type) return Promise.reject(new Error('doesn`t have type'))

  try {
    if (type === TYPE.LAST) {
      const last_2_stepsCollection = await db.collection(`userStorySteps/${userId}/steps`)
        .orderBy('updatedAt', 'desc')
        .limit(2)
        .get()

      const last_2_steps = last_2_stepsCollection.docs
        .map(doc => doc.data())
        .sort((a, b) => a.order - b.order)

      if (last_2_steps.length) {
        return Promise.resolve(JSON.stringify({ steps: last_2_steps, type }))
      } else {
        // create first step
        const firstUserStep = await createUserStoryStep({ userId })

        return Promise.resolve(JSON.stringify({ steps: [firstUserStep], type }))
      }

    } else if (type === TYPE.NEXT) {
      const userSteps = await db.collection(`userStorySteps/${userId}/steps`)
        .get()
        .then(snap => {
          const steps = []
          snap.forEach(doc => {
            steps.push(doc.data())
          })

          return steps
        })
        .catch((err) => {
          console.log('ERROR', err)
          return Promise.reject(err)
        })

      if (!userSteps.length) {
        await db.collection('userStorySteps').doc(userId).set({ steps: [] })
      }

      // create step
      const newUserStep = await createUserStoryStep({ userId, userSteps })

      return Promise.resolve(JSON.stringify({ steps: [newUserStep], type }))

    } else if (type === TYPE.PREVIOUS) {
      if (!currentStepId) {
        return Promise.reject(new Error('Doesn\'t have currentStepId'))
      }

      const currentStepDoc = await db.collection(`userStorySteps/${userId}/steps`).doc(currentStepId).get()

      const previous_2_StepsCollection = await db.collection(`userStorySteps/${userId}/steps`)
        .orderBy('updatedAt', 'desc')
        .startAfter(currentStepDoc)
        .limit(2)
        .get()

      const previous_2_Steps = previous_2_StepsCollection.docs.map(step => step.data())

      return Promise.resolve(JSON.stringify({ steps: previous_2_Steps, type }))
    }
  } catch (err) {
    return Promise.reject(new Error(`can't load story page with userId:${userId} - ${err}`))
  }
})
// }

const createUserStoryStep = async ({ userId, userSteps = [] }) => {
  const publicStepsCollection = await db.collection('publicStorySteps')
    .where('status', '==', 'approved')
    .get()

  let publicSteps = publicStepsCollection.docs.map(doc => doc.data())

  // исключаем степы юзера, чтоб степ не попался 2й раз
  if (userSteps.length) {
    publicSteps = publicSteps.filter(publicStep => {
      const inUserSteps = _.find(userSteps, { stepId: publicStep.stepId })
      return !inUserSteps
    })
  } else {

  }

  let randomStepWasCreated = false
  let randomStep = publicSteps.length 
    ? publicSteps[Math.floor(Math.random() * publicSteps.length)]
    : null

  if (!randomStep) {  // Редкий кейс, если юзер выполнил все все стори степы
    // Create Step from random Models:
    const needPublishModelsCollection = await db.collection('needPublish')
      // .where('status', '==', 'approved')  // TODO: ПРИКРУТИТЬ STATUS к моделям в 'needPublish'
      .limit(LIMIT_NEED_PUBLISH_MODELS)
      .get()

    const needPublishModels = needPublishModelsCollection.docs.map(doc => {
      const { publishedAt, userId, detailsCount } = doc.data()
      // Step Model fields
      return {
        modelId: doc.id,
        publishedAt: firebaseDate(publishedAt),
        userId,
        detailsCount,
      }
    })

    let random_5_Models = []
    for (let i = 0; i < 5; i++) {
      random_5_Models[i] = needPublishModels[Math.floor(Math.random() * needPublishModels.length)]
    }

    random_5_Models = random_5_Models.sort((a, b) => a.detailsCount - b.detailsCount)

    const stepId = uuidv4()

    randomStepWasCreated = true

    randomStep = {
      stepId,
      titles: {},
      descriptions: {},
      imageName: null,
      models: random_5_Models,
      specialDates: null,
      status: "approved",
      updatedAt: new Date().getTime(),
      usedByUser: true,
    }

    // Copy model image
    for await (const model of random_5_Models) {
      await bucket.file(`${model.userId}/${model.modelId}.png`)
        .copy(`public/${stepId}/${model.modelId}.png`)
    }
  } else {
    if (!randomStep.usedByUser) {
      await db.collection('publicStorySteps').doc(randomStep.stepId).set({ ...randomStep, usedByUser: true })
    }
  }

  const userStepDoc = await db.collection('userStorySteps').doc(userId).get()

  if (!userStepDoc.exists) {
    await db.collection('userStorySteps').doc(userId).set({})
  }

  await db.collection('userStorySteps')
    .doc(userId)
    .collection('steps')
    .doc(randomStep.stepId)
    .set(randomStep)

  for await (const model of randomStep.models) {
    const modelDoc = randomStepWasCreated
      // Редкий кейс, если юзер выполнил все все стори степы
      ? await db.collection(`models/users/${model.userId}`).doc(model.modelId).get()
      // Обычный кейс
      : await db.collection(`publicStoryStepModels/${randomStep.stepId}/models`).doc(model.modelId).get()

    // Фильтруем поля
    const { approved, inSteps, published, publishedAt, ...modelData } = modelDoc.data()

    if (modelDoc.exists && typeof modelDoc.data === 'function') {      
      await db.collection(`userStoryStepModels/${userId}/steps/${randomStep.stepId}/models`)
        .doc(model.modelId)
        .set(modelData)
    } else {
      continue
    }
    
  }

  return randomStep
}

module.exports = loadStoryPage
