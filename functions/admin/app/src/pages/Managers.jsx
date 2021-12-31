import React from 'react'
import Layout from '../components/Layout'
import { MENU_ITEMS } from '../constants'
import i18n from '../components/Lang/i18n'
import Lang from '../components/Lang/Lang'

const Managers = () => {
  return (
    <Layout menuItem={MENU_ITEMS.MANAGERS}>
      <h1>
        <Lang text={i18n.MANAGERS.TITLE} />
      </h1>
    </Layout>
  )
}

export default Managers