const functions = require('firebase-functions')
const app = require('express')()

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// })

app
  .use(cors({ origin: true }))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .get('/todos', (req, res) => {
    const todos = [
      {
        'id': '1',
        'title': 'greeting',
        'body': 'Hello world from sharvin shah',
      },
      {
        'id': '2',
        'title': 'greeting2',
        'body': 'Hello2 world2 from sharvin shah',
      },
    ]
    return res.json(todos)
  })
  .get('*', (req, res) => res.status(404)
    .json({ success: false, data: 'Endpoint not found' }))

exports.api = functions.https.onRequest(app)
