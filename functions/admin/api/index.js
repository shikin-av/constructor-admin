const express = require('express')
const cors = require('cors')
const path = require('path')
const { functions } = require('../../firebase')
const isAuthenticated = require('./auth/authenticated')
const { error404 } = require('./utils/handleErrors')
const users = require('./routes/users')
const models = require('./routes/models')

const api = express()
const corsHandler = cors({ origin: true })

api
  .use(corsHandler)
  .use(express.json())
  .use(express.urlencoded({extended: false}))
  .use(express.static(path.join(__dirname, 'public')))
  .use(isAuthenticated)
  .use('/users', users)
  .use('/models', models)
  .get('*', error404)

module.exports = functions.https.onRequest((req, res) => corsHandler(req, res, () => api(req, res)))