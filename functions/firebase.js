const functions = require('firebase-functions')
const admin = require('firebase-admin')
const FIREBASE_CONFIG = require('../config')

admin.initializeApp(FIREBASE_CONFIG)
const db = admin.firestore()
const storage = admin.storage()
const bucket = storage.bucket(FIREBASE_CONFIG.storageBucket)

module.exports = {
  functions,
  admin,
  db,
  bucket,
}
