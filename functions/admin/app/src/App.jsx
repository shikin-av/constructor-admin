import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MENU_ITEMS } from './constants'
import { LangContext } from './components/Lang/LangContext'
import { LANG } from './components/Lang/i18n'
import Login from './pages/Login'
import Home from './pages/Home'
import CreateStep from './pages/Steps/CreateSteps'
import Managers from './pages/Managers'

const  App = () => {
  const [lang, setLang] = useState(localStorage.getItem('lang') || LANG.ENG)

  return (
    <LangContext.Provider value={[lang, setLang]}>
      <BrowserRouter>
        <Routes>
          <Route path={'/'} element = {<Home />} />
          <Route path={`/${MENU_ITEMS.LOGIN}`} element = {<Login />} />
          <Route path={`/${MENU_ITEMS.STEPS}`} element = {<CreateStep />} />
          <Route path={`/${MENU_ITEMS.MANAGERS}`} element = {<Managers />} />
        </Routes>
      </BrowserRouter>
    </LangContext.Provider>
  )
}

export default App
