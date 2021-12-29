import React from 'react'
import Layout from '../components/Layout'
import { MENU_ITEMS } from '../constants'

const Managers = () => {
  return (
    <Layout menuItem={MENU_ITEMS.MANAGERS}>
      <h1>Managers</h1>
    </Layout>
  )
}

export default Managers