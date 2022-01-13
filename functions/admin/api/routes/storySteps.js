const express = require('express')
const { v4: uuidv4 } = require('uuid')
const { db } = require('../../../firebase')
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

    return Promise.resolve(res.json({ steps, allStepsCount }))
  } catch(err) {
    return Promise.reject(new Error(`can't load story steps page with startAt:${startAt} and limit:${limit} - ${JSON.stringify(err)}`))
  }
  
}

async function create(req, res) {
  try {
    const { models, title, description, status, specialDates, imageName, updatedAt } = req.body
    const stepId = uuidv4()

    if (!title || !status) {
      return Promise.reject(new Error('doesn\'t have required params'))
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

    // TODO: selectedModels

    res.json({ stepId })

  } catch(err) {
    return error500(res, err)
  }
}

module.exports = storyStepsRouter
