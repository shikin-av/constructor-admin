const express = require('express')
const { db } = require('../../../firebase')
const { error500 } = require('../utils/handleErrors')
const isAuthorized = require('../auth/authorized')
const { ROLES: { ADMIN, MANAGER } } = require('../auth/constants')

const modelsRouter = express.Router()
modelsRouter
  .get('/:userId',
    isAuthorized({ roles: [ADMIN, MANAGER] }),
    getUserModels
  )
  .get('/needPublishModels',
    isAuthorized({ roles: [ADMIN, MANAGER] }),
    getNeedPublishModels
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
    return Promise.reject(new Error(`can't load model page with userId:${userId} - ${err}`))
  }
}

async function getNeedPublishModels(req, res) {
  const { startAt, limit } = req.params

  try {
    const collection = await db.collection('needPusblish')
      .orderBy('updatedAt', 'desc')
      .offset(startAt)
      .limit(limit)
      .get()

    const models = collection.docs.map(doc => {
      return doc.data()
    })

    return Promise.resolve(res.json({ models }))
  } catch (err) {
    return Promise.reject(new Error(`can't load need publish model page with userId:${userId} - ${err}`))
  }
}

module.exports = modelsRouter
