import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { MENU_ITEMS } from '../constants'

const Steps = () => {
  const navigate = useNavigate()
  
  return (
    <Layout menuItem={MENU_ITEMS.STEPS}>
      <h1>Steps</h1>
    </Layout>
  )
}

export default Steps