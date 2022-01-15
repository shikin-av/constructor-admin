const express = require('express')
const { db, bucket } = require('../../../firebase')
const { error500 } = require('../utils/handleErrors')
const { firebaseDate } = require('../utils/date')
const isAuthorized = require('../auth/authorized')
const { ROLES: { ADMIN, MANAGER } } = require('../auth/constants')

const storyStepsRouter = express.Router()
storyStepsRouter
  .get('/:startAt/:limit',
    isAuthorized({ roles: [ADMIN, MANAGER] }),
    list
  )
  .post('/',
    isAuthorized({ roles: [ADMIN, MANAGER] }),
    create
  )
  .delete('/:stepId',
    isAuthorized({ roles: [ADMIN, MANAGER] }),
    remove
  )

async function list(req, res) {
  const startAt = +req.params.startAt
  const limit   = +req.params.limit

  try {
    const collection = await db.collection('publishedStorySteps')
      .orderBy('updatedAt', 'desc')
      .offset(startAt)
      .limit(limit)
      .get()

    const steps = collection.docs.map(doc => doc.data())

    const fullCollection = await db.collection('publishedStorySteps').get()
    const allStepsCount = fullCollection.docs.length

    return res.json({ steps, allStepsCount })
  } catch(err) {
    return error500(res, err)
  }  
}

async function create(req, res) {
  try {
    const { stepId, models, title, description, status, specialDates, imageName, updatedAt } = req.body

    if (!title || !status) {
      return res.status(400).send({ message: 'doesn\'t have required params' })
    }

    await db.collection('publishedStorySteps').doc(stepId).set({
      stepId,
      title,
      description,
      status,
      specialDates,
      imageName,
      models,
      updatedAt,
      usedByUser: false,
    })

    res.json({ stepId })

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

    const doc = await db.collection('publishedStorySteps').doc(stepId).get()
    if (!doc.exists) {
      return res.status(400).send({ message: `No such document! ${stepId}` })
    }

    const step = doc.data()
    const { usedByUser, imageName } = step

    if (usedByUser) {
      return res.status(400).send({ message: `It is not possible to delete a step that is used by players! ${stepId}` })
    }

    await db.collection('publishedStorySteps').doc(stepId).delete()

    if (imageName) {
      bucket.file(`published/${imageName}`).delete()
    }    

    return res.json({ stepId })
  } catch(err) {
    return error500(res, err)
  }
}

module.exports = storyStepsRouter
