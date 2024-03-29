import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu } from 'antd'
import { MENU_ITEMS } from '../constants'
import i18n from './Lang/i18n'
import Lang from './Lang/Lang'
const { SubMenu } = Menu

const MenuComponent = ({ currentItem }) => {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(currentItem)

  useEffect(() => {
    if (currentItem) {
      setCurrent(currentItem)
    }      
  }, [currentItem])

  const navigateTo = (item) => {
    navigate(item === MENU_ITEMS.HOME ? '/' : `/${item}`)
  }

  const itemClick = e => {
    setCurrent(e.key)
    navigateTo(e.key)
  }

  return (
    <Menu onClick={itemClick} selectedKeys={[current]} mode="horizontal" id="main-menu">
      <Menu.Item key={MENU_ITEMS.HOME}>
        <Lang text={i18n.MAIN_MENU.HOME} />
      </Menu.Item>
      <SubMenu key="steps-submenu" title={<Lang text={i18n.MAIN_MENU.STEPS.TITLE} />}>
        <Menu.Item key={MENU_ITEMS.STEPS}>
          <Lang text={i18n.MAIN_MENU.STEPS.LIST} />
        </Menu.Item>
        <Menu.Item key={MENU_ITEMS.CREATE_STEP}>
          <Lang text={i18n.MAIN_MENU.STEPS.CREATE} />
        </Menu.Item>
      </SubMenu>
      <Menu.Item key={MENU_ITEMS.MANAGERS}>
        <Lang text={i18n.MAIN_MENU.MANAGERS} />
      </Menu.Item>
    </Menu>
  )
}

export default MenuComponent
