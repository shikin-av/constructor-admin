
import React from 'react'
import firebase from 'firebase'
// import axios from 'axios'
import FIREBASE_CONFIG from '../../../../config'
import './App.css'

const googleProvider = new firebase.auth.GoogleAuthProvider()
const app = firebase.initializeApp(FIREBASE_CONFIG)
const auth = app.auth()

function App () {

  useEffect(async () => {
    const res = await auth.signInWithPopup(googleProvider)
    console.log('RES', res)
  }, [])

  return (
    <div>
      <h1>Constructor Admin</h1>
    </div>
  )
}

export default App
