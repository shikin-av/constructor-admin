const _ = require('lodash')
const { functions, db } = require('../firebase')

const saveBuildModel = functions.https.onCall(async (data, context) => {
  let { modelId, stepId, details } = data
  const userId = context.auth.uid
  details = JSON.parse(details)

  if (!userId) return Promise.reject(new Error('doesn`t have userId'))
  if (!modelId) return Promise.reject(new Error('doesn`t have modelId'))
  if (!stepId) return Promise.reject(new Error('doesn`t have stepId'))
  if (!details) return Promise.reject(new Error('doesn`t have details'))
  if (!Array.isArray(details)) {
    return Promise.reject(new Error(`"details" must be an array - ${details}`))
  }

  try {
    const modelDoc = await db.collection(`userStoryStepModels/${userId}/steps/${stepId}/models`).doc(modelId).get()
    let model = modelDoc.data()
    
    model.details = details
    model.buildedCount = details.filter(d => !!d.b).length

    // Save UserStoryStepModel
    await db.collection(`userStoryStepModels/${userId}/steps/${stepId}/models`).doc(modelId).set(model)

    const stepDoc = await db.collection(`userStorySteps/${userId}/steps`).doc(stepId).get()
    const step = stepDoc.data()
    const stepModelIndex = _.findIndex(step.models, m => m.modelId == modelId)
    const stepModel = step.models[stepModelIndex]

    step.models[stepModelIndex] = { ...stepModel, buildedCount: model.buildedCount }

    // Check is Step completed
    let buildedModelsCount = 0
    for (let i = 0; i < step.models.length; i++) {
      const stModel = step.models[i]
      if (stModel.buildedCount && stModel.buildedCount == stModel.detailsCount){
        buildedModelsCount += 1
      }
    }

    if (step.models.length == buildedModelsCount) {
      step.status = "complete"
    }

    // Save UserStoryStep
    await db.collection(`userStorySteps/${userId}/steps`).doc(stepId).set(step)
  } catch (err) {
    return Promise.reject(new Error(`can't save build model(${modelId}) step(${stepId}) - ${err}`))
  }
})

module.exports = saveBuildModel
