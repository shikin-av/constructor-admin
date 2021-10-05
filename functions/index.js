const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')
const {getModels, handleError} = require('./routes')

const app = express()

app
  .use(cors({origin: true}))
  .use(express.json())
  .use(express.urlencoded({extended: false}))
  .get('/models/:userId', getModels)
  .get('*', handleError)

exports.api = functions.https.onRequest(app)
