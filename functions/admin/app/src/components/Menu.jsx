import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu } from 'antd'
import { MENU_ITEMS } from '../constants'

const MenuComponent = ({ currentItem }) => {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(currentItem)

  useEffect(() => {
    if (currentItem) {
      setCurrent(currentItem)
    }      
  }, [currentItem])

  const navigateTo = (item) => {
    navigate(item == MENU_ITEMS.HOME ? '/' : `/${item}`)
  }

  const itemClick = e => {
    setCurrent(e.key)
    navigateTo(e.key)
  }

  return (
    <Menu onClick={itemClick} selectedKeys={[current]} mode="horizontal" id="main-menu">
      <Menu.Item key={MENU_ITEMS.HOME}>Home</Menu.Item>
      <Menu.Item key={MENU_ITEMS.STEPS}>Story Steps</Menu.Item>
      <Menu.Item key={MENU_ITEMS.MANAGERS}>Managers</Menu.Item>
    </Menu>
  )
}

export default MenuComponent
