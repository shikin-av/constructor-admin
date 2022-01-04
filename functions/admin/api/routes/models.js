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

    return Promise.resolve(res.json({ models }))
  } catch (err) {
    return Promise.reject(new Error(`can't load model page with userId:${userId} - ${JSON.stringify(err)}`))
  }
}

async function getNeedPublishModels(req, res) {
  const startAt = +req.params.startAt
  const limit   = +req.params.limit

  try {
    const collection = await db.collection('needPusblish')
      .orderBy('date', 'desc')
      .offset(startAt)
      .limit(limit)
      .get()

    const models = collection.docs.map(doc => {
      const { date, modelId, userId } = doc.data()

      return {
        date: firebaseDate(date),
        modelId,
        userId,
      }
    })

    const fullCollection = await db.collection('needPusblish').get()
    const allModelsCount = fullCollection.docs.length

    return Promise.resolve(res.json({ models, allModelsCount }))
  } catch (err) {
    return Promise.reject(new Error(`can't load need publish models page with startAt:${startAt} and limit:${limit} - ${JSON.stringify(err)}`))
  }
}

module.exports = modelsRouter
