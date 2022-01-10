const express = require('express')
const { v4: uuidv4 } = require('uuid')
const { db } = require('../../../firebase')
const { error500 } = require('../utils/handleErrors')
const isAuthorized = require('../auth/authorized')
const { ROLES: { ADMIN, MANAGER } } = require('../auth/constants')

const storyStepsRouter = express.Router()
storyStepsRouter
  .post('/',
    isAuthorized({ roles: [ADMIN, MANAGER] }),
    create
  )

async function create(req, res) {
  try {
    const { selectedModels, title, description, status, specialDates, imageName } = req.body
    const stepId = uuidv4()

    if (!title || !status) {
      return Promise.reject(new Error('doesn\'t have required params'))
    }

    await db.collection('publishedStorySteps').doc(stepId).set({
      title,
      description,
      status,
      specialDates,
      imageName,
    })

    // TODO: selectedModels

    res.json({ stepId })

  } catch(err) {
    return error500(res, err)
  }
}

module.exports = storyStepsRouter
