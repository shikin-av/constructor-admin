const express = require('express')
const { db } = require('../../../firebase')
const { error500 } = require('../utils/handleErrors')
const { firebaseDate } = require('../utils/date')
const isAuthorized = require('../auth/authorized')
const { ROLES: { ADMIN, MANAGER } } = require('../auth/constants')

const modelsRouter = express.Router()
modelsRouter
  .get('/needPublishModels/:startAt/:limit',
    isAuthorized({ roles: [ADMIN, MANAGER] }),
    getNeedPublishModels
  )
  .get('/:userId',
    isAuthorized({ roles: [ADMIN, MANAGER] }),
    getUserModels
  )  

async function getUserModels (req, res) {
  const { userId } = req.params

  try {
    const snapshot = await db.collection(`models/users/${userId}`)
      .orderBy('updatedAt', 'desc').get()

    const models = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        userId,
      }
    })

    return res.json({ models })
  } catch (err) {
    return error500(res, err)
  }
}

async function getNeedPublishModels(req, res) {
  const startAt = +req.params.startAt
  const limit   = +req.params.limit

  try {
    const collection = await db.collection('needPublish')
      .orderBy('publishedAt', 'desc')
      .offset(startAt)
      .limit(limit)
      .get()

    const models = collection.docs.map(doc => {
      const { publishedAt, modelId, userId } = doc.data()

      return {
        publishedAt: firebaseDate(publishedAt),
        modelId,
        userId,
      }
    })

    const fullCollection = await db.collection('needPublish').get()  // TODO: м.б. фильтровать по статусу
    const allModelsCount = fullCollection.docs.length

    return res.json({ models, allModelsCount })
  } catch (err) {
    return error500(res, err)
  }
}

module.exports = modelsRouter
