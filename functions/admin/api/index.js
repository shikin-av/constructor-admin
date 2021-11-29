const express = require('express')
const cors = require('cors')
const path = require('path')
const {functions} = require('../../firebase')
const {getModels, handleError} = require('./routes')
const { create, all, get, patch, remove } = require('./users/controller')
const isAuthenticated = require('./auth/authenticated')
const isAuthorized = require('./auth/authorized')

const api = express()
const corsHandler = cors({ origin: true })

api
  .use(corsHandler)
  .use(express.json())
  .use(express.urlencoded({extended: false}))
  .use(express.static(path.join(__dirname, 'public')))
  .use(isAuthenticated)
  // .use(isAuthorized({ hasRole: ['admin', 'manager'] }))

  .post('/', (req, res) => res.json({ page: 'Home, sweet home'}))
  
  .get('/models/:userId', getModels)

  .post('/users',
      // isAuthorized({ hasRole: ['admin', 'manager'] }),
      create
  )
  .get('/users', [
    // isAuthorized({ hasRole: ['admin', 'manager'] }),
    all
  ])
  .get('/users/:id', [
      // isAuthorized({ hasRole: ['admin', 'manager'], allowSameUser: true }),
      get
  ])
  .patch('/users/:id', [
      // isAuthorized({ hasRole: ['admin', 'manager'], allowSameUser: true }),
      patch
  ])
  .delete('/users/:id', [
      // isAuthorized({ hasRole: ['admin', 'manager'] }),
      remove
  ])

  .get('*', handleError)

module.exports = functions.https.onRequest((req, res) => corsHandler(req, res, () => api(req, res)))