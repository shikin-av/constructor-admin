import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MENU_ITEMS } from './constants'
import Login from './pages/Login'
import Home from './pages/Home'
import CreateStep from './pages/Steps/CreateSteps'
import Managers from './pages/Managers'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={'/'} element = {<Home />} />
        <Route path={`/${MENU_ITEMS.LOGIN}`} element = {<Login />} />
        <Route path={`/${MENU_ITEMS.STEPS}`} element = {<CreateStep />} />
        <Route path={`/${MENU_ITEMS.MANAGERS}`} element = {<Managers />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
