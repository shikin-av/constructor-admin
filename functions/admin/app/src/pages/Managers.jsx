import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { MENU_ITEMS } from '../constants'

const Managers = () => {
  const navigate = useNavigate()
  
  return (
    <Layout menuItem={MENU_ITEMS.MANAGERS}>
      <h1>Managers</h1>
    </Layout>
  )
}

export default Managers