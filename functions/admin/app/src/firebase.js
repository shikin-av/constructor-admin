import * as firebase from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { getStorage, ref, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage"

const FIREBASE_CONFIG = {
  apiKey: process.env.REACT_APP_FIRE_API_KEY,
  authDomain: process.env.REACT_APP_FIRE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIRE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIRE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIRE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIRE_APP_ID,
  measurementId: process.env.REACT_APP_FIRE_MEASUREMENT_ID,
}

const firebaseApp = firebase.initializeApp(FIREBASE_CONFIG)
const auth = getAuth(firebaseApp)
const storage = getStorage(firebaseApp)

export {
  firebase,
  firebaseApp,
  auth,
  signInWithEmailAndPassword,
  storage,
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
}
  