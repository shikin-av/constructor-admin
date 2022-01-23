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
        // CREATE STEP
        const publicStepsCollection = await db.collection('publicStorySteps')
          .where('status', '==', 'approved')
          .get()

        const publicSteps = publicStepsCollection.docs.map(doc => doc.data())
        const randomStep = publicSteps[Math.floor(Math.random() * publicSteps.length)]

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
          // TODO: создать user step models (скопировать их)     userStoryStepModels
          // TODO: ПЕРЕД ЭТИМ: при создании StoryStep(менеджером), создавать step-модели в publicStoryStepModels
          // + их картинки в public

          // const stepModelDoc = db.collection('publicStoryStepModels').doc(modelId).get()
        }

        return Promise.resolve({ step: randomStep })

      }      
    } else if (type === TYPE.NEXT) {

    } else if (type === TYPE.PREVIOUS) {

    }

    // return Promise.resolve(JSON.stringify({ models }))
  } catch (err) {
    return Promise.reject(new Error(`can't load story page with userId:${userId} - ${err}`))
  }
// })
}

module.exports = loadStoryPage
