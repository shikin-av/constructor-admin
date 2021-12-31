import React, { useContext } from 'react'
import { LangContext } from './LangContext'

const Lang = ({ text }) => {
  const [lang] = useContext(LangContext)

  return <>{text[lang]}</>
}

export default Lang
