const express = require('express')
const _ = require('lodash')
const { db, bucket } = require('../../../firebase')
const { error500 } = require('../utils/handleErrors')
const isAuthorized = require('../auth/authorized')
const { ROLES: { ADMIN, MANAGER } } = require('../auth/constants')

const storyStepsRouter = express.Router()
storyStepsRouter
  .get('/:startAt/:limit',
    isAuthorized({ roles: [ADMIN, MANAGER] }),
    list
  )
  .get('/:stepId',
    isAuthorized({ roles: [ADMIN, MANAGER] }),
    load
  )
  .post('/',
    isAuthorized({ roles: [ADMIN, MANAGER] }),
    create
  )
  .post('/:stepId',
    isAuthorized({ roles: [ADMIN, MANAGER] }),
    edit
  )
  .delete('/:stepId',
    isAuthorized({ roles: [ADMIN, MANAGER] }),
    remove
  )

async function list(req, res) {
  const startAt = +req.params.startAt
  const limit   = +req.params.limit

  try {
    const collection = await db.collection('publicStorySteps')
      .orderBy('updatedAt', 'desc')
      .offset(startAt)
      .limit(limit)
      .get()

    const steps = collection.docs.map(doc => doc.data())

    const fullCollection = await db.collection('publicStorySteps').get()
    const allStepsCount = fullCollection.docs.length

    return res.json({ steps, allStepsCount })
  } catch(err) {
    return error500(res, err)
  }  
}

async function create(req, res) {
  try {
    let { stepId, models, titles, descriptions, status, specialDates, imageName, updatedAt } = req.body

    if (!status || !stepId) {
      return res.status(400).send({ message: 'doesn\'t have required params' })
    }
    
    await db.collection('publicStorySteps').doc(stepId).set({
      stepId,
      titles,
      descriptions,
      status,
      specialDates,
      imageName,
      models,
      updatedAt,
      usedByUser: false,
    })

    // Models
    for await (const model of models) {
      const needPublishModelDoc = await db.collection('needPublish').doc(model.modelId).get()
      if (!needPublishModelDoc.exists) {
        // models = models.filter(m => m.modelId === model.modelId)
        // continue
        return res.status(400).send({ message: `doesn\'t have need publish model ${model.modelId}` })
      } else {
        // Copy model
        await db.collection(`publicStoryStepModels/${stepId}/models/`)
          .doc(model.modelId)
          .set(needPublishModelDoc.data())

        // Copy model image
        await bucket.file(`needPublish/${model.modelId}.png`)
          .copy(`public/${stepId}/${model.modelId}.png`)
      }
    }

    return res.json({ stepId })
  } catch(err) {
    return error500(res, err)
  }
}

async function edit(req, res) {
  try {
    let { stepId, models, titles, descriptions, status, specialDates, imageName, updatedAt } = req.body

    if (!status) {
      return res.status(400).send({ message: 'doesn\'t have required params' })
    }

    const oldDoc = await db.collection('publicStorySteps').doc(stepId).get()
    if (!oldDoc.exists) {
      res.status(400).send({ message: `doesn\'t have publicStorySteps doc ${stepId}` })
    }

    const oldStep = oldDoc.data()
    // Image
    if (oldStep.imageName && imageName === null) {
      await bucket.file(`public/${stepId}/${oldStep.imageName}`).delete()
    }

    /*
     * Обработка старых и новых моделей (и их изображений)
    */
    // общие (с ними ничего не делаем - они остаются)
    const intersected = _.intersectionBy(oldStep.models, models, 'modelId')
    // исключаем старые из новых
    const onlyNew = models.filter(newModel => !oldStep.models.some(oldModel => oldModel.modelId === newModel.modelId))
    // исключение общих из старых
    const onlyOld = oldStep.models.filter(oldModel => !intersected.some(intModel => intModel.modelId === oldModel.modelId))

    for await (const oldModel of onlyOld) {
      try {
        await db.collection(`publicStoryStepModels/${stepId}/models/`)
          .doc(oldModel.modelId)
          .delete()

        await bucket.file(`public/${stepId}/${oldModel.modelId}.png`).delete()
      } catch(err) {
        console.error(err)
      }
    }

    for await (const newModel of onlyNew) {      
      const needPublishModelDoc = await db.collection('needPublish').doc(newModel.modelId).get()
      // Copy model
      await db.collection(`publicStoryStepModels/${stepId}/models/`)
        .doc(newModel.modelId)
        .set(needPublishModelDoc.data())

      // Copy model image
      await bucket.file(`needPublish/${newModel.modelId}.png`)
        .copy(`public/${stepId}/${newModel.modelId}.png`)
    }

    await db.collection('publicStorySteps').doc(stepId).set({
      stepId,
      titles,
      descriptions,
      status,
      specialDates,
      imageName,
      models,
      updatedAt,
      usedByUser: false,
    })

    return res.json({ stepId })
  } catch(err) {
    return error500(res, err)
  }
}

async function load(req, res) {
  try {
    const { stepId } = req.params

    if (!stepId) {
      return res.status(400).send({ message: 'doesn\'t have required params' })
    }

    const doc = await db.collection('publicStorySteps').doc(stepId).get()
    if (!doc.exists) {
      return res.status(400).send({ message: `No such document! ${id}` })
    }

    return res.json(doc.data())
  } catch(err) {
    return error500(res, err)
  }
}

async function remove(req, res) {
  try {
    const { stepId } = req.params

    if (!stepId) {
      return res.status(400).send({ message: 'doesn\'t have required params' })
    }

    const doc = await db.collection('publicStorySteps').doc(stepId).get()
    if (!doc.exists) {
      return res.status(400).send({ message: `No such document! ${stepId}` })
    }

    const step = doc.data()
    const { usedByUser, imageName } = step

    if (usedByUser) {
      return res.status(400).send({ message: `It is not possible to delete a step that is used by players! ${stepId}` })
    }

    // Delete models and images of them
    for await (const model of step.models) {
      await db.collection(`publicStoryStepModels/${stepId}/models/`).doc(model.modelId).delete()

      try {
        const image = await bucket.file(`public/${stepId}/${model.modelId}.png`)
        image && await image.delete()
      } catch(err) {
        console.error(`cannot delete image ${stepId}/${model.modelId}.png`, err.message)
      }      
    }

    await db.collection('publicStorySteps').doc(stepId).delete()

    if (imageName) {
      await bucket.file(`public/${stepId}/${imageName}`).delete()
    }

    return res.json({ stepId })
  } catch(err) {
    return error500(res, err)
  }
}

module.exports = storyStepsRouter
