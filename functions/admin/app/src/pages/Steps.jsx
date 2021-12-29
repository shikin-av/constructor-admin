import React from 'react'
import Layout from '../components/Layout'
import { MENU_ITEMS } from '../constants'
import i18n from '../i18n'

const Steps = () => {
  return (
    <Layout menuItem={MENU_ITEMS.STEPS}>
      <h1>{i18n.STEPS.TITLE}</h1>
    </Layout>
  )
}

export default Steps