const express = require('express')
const cors = require('cors')
const {functions} = require('../../firebase')
const {getModels, handleError} = require('./routes')
// const {handleError} = require('./routes')

const api = express()

api
  .use(cors({origin: true}))
  .use(express.json())
  .use(express.urlencoded({extended: false}))
  .get('/', (req, res) => res.json({ page: 'Home, sweet home'}))
  .get('/models/:userId', getModels)  
  .get('*', handleError)

module.exports = functions.https.onRequest(api)
