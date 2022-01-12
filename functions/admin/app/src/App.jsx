import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MENU_ITEMS, MODES } from './constants'
import { LangContext } from './components/Lang/LangContext'
import { LANG } from './components/Lang/i18n'
import Login from './pages/Login'
import Home from './pages/Home'
import StepsList from './pages/Steps/StepsList'
import EditStep from './pages/Steps/EditStep'
import Managers from './pages/Managers'

const  App = () => {
  const [lang, setLang] = useState(localStorage.getItem('lang') || LANG.ENG)

  return (
    <LangContext.Provider value={[lang, setLang]}>
      <BrowserRouter>
        <Routes>
          <Route path={'/'} element = {<Home />} />
          <Route path={`/${MENU_ITEMS.LOGIN}`} element = {<Login />} />
          <Route path={`/${MENU_ITEMS.STEPS}`} element = {<StepsList />} />
          <Route path={`/${MENU_ITEMS.STEPS}/create`} element = {<EditStep mode={MODES.CREATE} />} />
          <Route path={`/${MENU_ITEMS.STEPS}/:stepId`} element = {<EditStep />} />
          <Route path={`/${MENU_ITEMS.MANAGERS}`} element = {<Managers />} />
        </Routes>
      </BrowserRouter>
    </LangContext.Provider>
  )
}

export default App
