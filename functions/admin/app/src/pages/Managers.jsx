import React from 'react'
import Layout from '../components/Layout'
import { MENU_ITEMS } from '../constants'
import i18n from '../components/Lang/i18n'

const Managers = () => {
  return (
    <Layout menuItem={MENU_ITEMS.MANAGERS}>
      <h1>{i18n.MANAGERS.TITLE}</h1>
    </Layout>
  )
}

export default Managers