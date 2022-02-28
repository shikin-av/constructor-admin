const { functions, db } = require('../firebase')

const loadStoryModel = functions.https.onCall(async (data, context) => {
  const { modelId, stepId } = data
  const userId = context.auth.uid

  if (!userId) return Promise.reject(new Error('doesn`t have userId'))
  if (!modelId) return Promise.reject(new Error('doesn`t have modelId'))
  if (!stepId) return Promise.reject(new Error('doesn`t have stepId'))

  try {
    const doc = await db.collection(`userStoryStepModels/${userId}/steps/${stepId}/models`).doc(modelId).get()
    const model = doc.data()

    return Promise.resolve(JSON.stringify(model))
  } catch (err) {
    return Promise.reject(new Error(`can't load model(${modelId}) step(${stepId}) - ${err}`))
  }  
})

module.exports = loadStoryModel
