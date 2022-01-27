const _ = require('lodash')
const { functions, db } = require('../firebase')

const TYPE = {
  LAST: 'last',
  NEXT: 'next',
  PREVIOUS: 'previous',
}

// TODO: ВЕРНУТЬ
// const loadStoryPage = functions.https.onCall(async (data, context) => {
const loadStoryPage = async(data, context) => {

  const { 
    type,
    currentStepId,  // текущий в игре (не last), чтоб подгружать previous
  } = data
  const userId = context.auth.uid

  if (!userId) return Promise.reject(new Error('doesn`t have userId'))
  if (!type) return Promise.reject(new Error('doesn`t have type'))

  try {
    if (type === TYPE.LAST) {
      const last2stepsCollection = await db.collection(`userStorySteps/${userId}/steps`)
        .limit(2)
        .get()

      const last2steps = last2stepsCollection.docs
        .map(doc => doc.data())
        .sort((a, b) => a.order - b.order)

      if (last2steps.length) {
        return Promise.resolve({ steps: last2steps }) // TODO: stringify
      } else {
        // create step
        const firstUserStep = await createUserStoryStep({ userId })
        return Promise.resolve({ steps: [firstUserStep] })
      }      
    } else if (type === TYPE.NEXT) {
      // create step
      const newUserStep = await createUserStoryStep({ userId })
      return Promise.resolve({ steps: [newUserStep] })
    } else if (type === TYPE.PREVIOUS) {
      // TODO:
    }
  } catch (err) {
    return Promise.reject(new Error(`can't load story page with userId:${userId} - ${JSON.stringify(err)}`))
  }
// })
}

const createUserStoryStep = async ({ userId, userSteps = [] }) => {
  const publicStepsCollection = await db.collection('publicStorySteps')
    .where('status', '==', 'approved')
    .get()

  let publicSteps = publicStepsCollection.docs.map(doc => doc.data())

  // исключаем степы юзера, чтоб степ не попался 2й раз
  const userStepsCollection = await db.collection(`userStorySteps/${userId}/steps`).get()
  if (!userStepsCollection.exists) {
    await db.collection('userStorySteps').doc(userId).set({ steps: [] })
  } else {
    const userSteps = userStepsCollection.docs.map(doc => doc.data())
    if (userSteps.length) {
      publicSteps = publicSteps.filter(publicStep => {
        const inUserSteps = _.find(userSteps, { stepId: publicStep.stepId })
        return !inUserSteps
      })
    }
  }  

  const randomStep = publicSteps[Math.floor(Math.random() * publicSteps.length)]

  if (!randomStep) {
    throw new Error(`Can't find random step`)
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

  const userStepModelsDoc = await db.collection('userStoryStepModels').doc(userId).get()
  if (!userStepModelsDoc.exists) {
    await db.collection('userStoryStepModels').doc(userId).set({})
  }

  for await (const model of randomStep.models) {
    const stepModelDoc = await db.collection(`publicStoryStepModels/${randomStep.stepId}/models`).doc(model.modelId).get()
    if (!stepModelDoc.exists) {
      throw new Error(`Step model doc not exists: publicStoryStepModels/${randomStep.stepId}/models/${model.modelId}`)
    }

    await db.collection(`userStoryStepModels/${userId}/steps/${randomStep.stepId}/models`)
      .doc(model.modelId)
      .set(stepModelDoc.data())
  }

  return randomStep
}

module.exports = loadStoryPage
