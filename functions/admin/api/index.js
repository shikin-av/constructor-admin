const express = require('express')
const cors = require('cors')
const path = require('path')
const { functions } = require('../../firebase')
const { getModels, handleError } = require('./routes')
const { create, all, get, patch, remove, setRole } = require('./users/controller')
const isAuthenticated = require('./auth/authenticated')
const isAuthorized = require('./auth/authorized')
const { ROLES: { ADMIN, MANAGER } } = require('./auth/constants')

const api = express()
const corsHandler = cors({ origin: true })

api
  .use(corsHandler)
  .use(express.json())
  .use(express.urlencoded({extended: false}))
  .use(express.static(path.join(__dirname, 'public')))
  .use(isAuthenticated)

  .get('/', 
    isAuthorized({ roles: [ADMIN, MANAGER] }),
    (req, res) => res.json({ page: 'Home, sweet home'})
  )
  .post('/role',
    isAuthorized({ roles: [ADMIN] }),
    setRole
  )
  .get('/models/:userId',
    isAuthorized({ roles: [ADMIN, MANAGER] }),
    getModels
  )
  .post('/users',
    isAuthorized({ roles: [ADMIN] }),
    create
  )
  .get('/users', [
    isAuthorized({ roles: [ADMIN] }),
    all
  ])
  .get('/users/:id', [
    isAuthorized({ roles: [ADMIN, MANAGER], allowSameUser: true }),
    get
  ])
  .patch('/users/:id', [
    isAuthorized({ roles: [ADMIN] }),
    patch
  ])
  .delete('/users/:id', [
    isAuthorized({ roles: [ADMIN] }),
    remove
  ])

  .get('*', handleError)

module.exports = functions.https.onRequest((req, res) => corsHandler(req, res, () => api(req, res)))