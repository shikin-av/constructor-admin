const express = require('express')
const { db } = require('../../../firebase')
const loadStoryPage = require('../../../constructor/loadStoryPage')

const testRouter = express.Router()
testRouter
  .get('/', test)

async function test(req, res) {
  const data = { 
    type: 'last', 
    currentStepId: '',
  }
  const context = {
    auth: { uid: '' }
  }
  const stories = await loadStoryPage(data, context)
  return res.json(stories)
}

module.exports = testRouter
