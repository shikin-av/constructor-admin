import React from 'react'
import ReactDOM from 'react-dom'
import App from './App/App'
import { AuthProvider } from './AuthProvider'

const root = document.createElement('div')
root.id = 'root'
document.body.appendChild(root)

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
