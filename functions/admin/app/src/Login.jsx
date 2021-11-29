import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as firebase from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import './App.css';
import FIREBASE_CONFIG from './firebaseConfig'

const auth = getAuth(firebase.initializeApp(FIREBASE_CONFIG))

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const userCredential =  await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user    
      const token = await user.getIdToken(false)
      localStorage.setItem('token', `Bearer ${token}`)
      navigate('/')
    } catch (err) {
      setError('Wrong login or password')
    }
    
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <input type="submit" value="login" />
        <p>{error}</p>
      </form>
    </div>
  );
}

export default Login
