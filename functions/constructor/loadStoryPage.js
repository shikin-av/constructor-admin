const _ = require('lodash')
const { v4: uuidv4 } = require('uuid')
const { functions, db, bucket } = require('../firebase')
const { firebaseDate } = require('../admin/api/utils/date')

const LOAD_TYPE = {
  LAST: 'last',
  PREVIOUS: 'previous',
}

const STEP_STATUS = {
  NEW: 'new',
  PROGRESS: 'progress',
  COMPLETE: 'complete',
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
    if (type === LOAD_TYPE.LAST) {
      const last_2_stepsCollection = await db.collection(`userStorySteps/${userId}/steps`)
        .orderBy('createdAt', 'desc')
        .limit(2)
        .get()

      const last_2_steps = last_2_stepsCollection.docs
        .map(doc => doc.data())
        .sort((a, b) => b.createdAt - a.createdAt)

      if (last_2_steps.length) {        
        const lastStep = last_2_steps[0]

        if (lastStep.status == STEP_STATUS.COMPLETE) {
          const newUserStep = await createUserStoryStep({ userId })

          return Promise.resolve(JSON.stringify({
            steps: [
              newUserStep,
              lastStep,
            ],
            type,
          }))
        }

        return Promise.resolve(JSON.stringify({ steps: last_2_steps, type }))
      } else {
        const firstUserStep = await createUserStoryStep({ userId })

        return Promise.resolve(JSON.stringify({ steps: [firstUserStep], type }))
      }

    } else if (type === LOAD_TYPE.PREVIOUS) {
      if (!currentStepId) {
        return Promise.reject(new Error('Doesn\'t have currentStepId'))
      }

      const currentStepDoc = await db.collection(`userStorySteps/${userId}/steps`).doc(currentStepId).get()

      const previous_2_StepsCollection = await db.collection(`userStorySteps/${userId}/steps`)
        .orderBy('createdAt', 'desc')
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

const createUserStoryStep = async ({ userId }) => {
  const publicStepsCollection = await db.collection('publicStorySteps')
    .where('status', '==', 'approved')
    .get()

  let publicSteps = publicStepsCollection.docs.map(doc => doc.data())

  const userStepsCollection = await db.collection('userStorySteps')
    .doc(userId)
    .collection('steps')
    .get()
  
  const userSteps = userStepsCollection.docs.map(step => step.data())

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
      const { publishedAt, userId, detailsCount, colors } = doc.data()
      // Step Model fields
      return {
        modelId: doc.id,
        publishedAt: firebaseDate(publishedAt),
        userId,
        detailsCount,
        colors,
      }
    })

    let random_5_Models = []

    while(random_5_Models.length < 5) {
      const randomModel = needPublishModels[Math.floor(Math.random() * needPublishModels.length)]

      if (!random_5_Models.includes(randomModel)) {
        random_5_Models.push(randomModel)
      }
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
      specialDates: [],
      status: "approved",
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

  randomStep = {
    ...randomStep,
    createdAt: new Date().getTime(),
    status: STEP_STATUS.NEW,
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
