const express = require('express')
const cors = require('cors')
const path = require('path')
const {functions} = require('../../firebase')
const {getModels, handleError} = require('./routes')
// const {handleError} = require('./routes')
const { create, all, get, patch, remove } = require('./users/controller')
const isAuthenticated = require('./auth/authenticated')
const isAuthorized = require('./auth/authorized')

const api = express()

api
  .use(cors({origin: true}))
  .use(express.json())
  .use(express.urlencoded({extended: false}))
  // .use(express.static(path.join(__dirname, 'public')))
  // .use(express.static(path.join(__dirname, '../app/public')))
  // .use(isAuthenticated)
  // .use(isAuthorized({ hasRole: ['admin', 'manager'] }))

  .get('/', (req, res) => res.json({ page: 'Home, sweet home'}))
  .get('/models/:userId', getModels)

  .post('/users',
      // isAuthenticated,
      // isAuthorized({ hasRole: ['admin', 'manager'] }),
      create
  )
  .get('/users', [
    // isAuthenticated,
    // isAuthorized({ hasRole: ['admin', 'manager'] }),
    all
  ])
  .get('/users/:id', [
      // isAuthenticated,
      // isAuthorized({ hasRole: ['admin', 'manager'], allowSameUser: true }),
      get
  ])
  .patch('/users/:id', [
      // isAuthenticated,
      // isAuthorized({ hasRole: ['admin', 'manager'], allowSameUser: true }),
      patch
  ])
  // deletes :id user
  .delete('/users/:id', [
      // isAuthenticated,
      // isAuthorized({ hasRole: ['admin', 'manager'] }),
      remove
  ])

  .get('*', handleError)

module.exports = functions.https.onRequest(api)
