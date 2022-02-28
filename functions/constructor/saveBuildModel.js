const _ = require('lodash')
const { functions, db } = require('../firebase')

const saveBuildModel = functions.https.onCall(async (data, context) => {
  let { modelId, stepId, lastPortion } = data
  const userId = context.auth.uid
  lastPortion = JSON.parse(lastPortion)

  if (!userId) return Promise.reject(new Error('doesn`t have userId'))
  if (!modelId) return Promise.reject(new Error('doesn`t have modelId'))
  if (!stepId) return Promise.reject(new Error('doesn`t have stepId'))
  if (!lastPortion) return Promise.reject(new Error('doesn`t have lastDetailIndexes'))
  if (!Array.isArray(lastPortion)) {
    return Promise.reject(new Error(`"lastDetailIndexes" must be an array - ${lastPortion}`))
  }

  try {
    const modelDoc = await db.collection(`userStoryStepModels/${userId}/steps/${stepId}/models`).doc(modelId).get()
    let model = modelDoc.data()

    lastPortion = _.sortBy(lastPortion, 'index')
    const portionBuilded = lastPortion.filter(d => d.builded == true)
    const notBuildedPortionCount = lastPortion.length - portionBuilded.length
    const lastBuildedItem = _.maxBy(portionBuilded, 'index')
    const notBuildedAllCount = model.detailsCount - (lastBuildedItem.index + 1 - notBuildedPortionCount)
    
    model.buildedCount = model.detailsCount - notBuildedAllCount
    model.buildedLastDetails = lastPortion

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
