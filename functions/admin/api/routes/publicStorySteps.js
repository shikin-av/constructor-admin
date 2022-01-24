const express = require('express')
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

    if (!status) {
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
      const userModelDoc = await db.collection(`models/users/${model.userId}`).doc(model.modelId).get()
      if (!userModelDoc.exists) {
        models = models.filter(m => m.modelId === model.modelId)
        continue
      } else {
        // Copy model
        await db.collection(`publicStoryStepModels/${stepId}/models/`)
          .doc(model.modelId)
          .set(userModelDoc.data())

        // Copy model image
        await bucket.file(`${model.userId}/${model.modelId}.png`)
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

    const doc = await db.collection('publicStorySteps').doc(stepId).get()    
    const step = doc.data()
    // Image
    if (step.imageName !== imageName || imageName === null) {  // TODO: проверить при изменении стэпа
      await bucket.file(`public/${step.imageName}`).delete()
    }

    // TODO: HANDLE MODELS

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

    res.json(doc.data())
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
      await bucket.file(`public/${stepId}/${model.modelId}.png`).delete()
    }

    await db.collection('publicStorySteps').doc(stepId).delete()

    if (imageName) {
      await bucket.file(`public/${imageName}`).delete()
    }

    return res.json({ stepId })
  } catch(err) {
    return error500(res, err)
  }
}

module.exports = storyStepsRouter
