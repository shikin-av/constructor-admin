import React from 'react'
import { useLocation } from 'react-router-dom'
import { Layout, Typography, Row, Col } from 'antd'
import Menu from './Menu'
import i18n from './Lang/i18n'
import Lang from './Lang/Lang'
const { Header, Content } = Layout
const { Title } = Typography


const LayoutComponent = ({ children, menuItem }) => {
  const location = useLocation()

  return (
    <Layout id="app">
      <Header id="header">
        <Row align="middle">
          <Col span={6}>
            <Title level={4} id="header-title">
              <Lang text={i18n.HEADER.TITLE} />
            </Title>
          </Col>
          <Col span={12}>
            {location.pathname !== '/login' && <Menu currentItem={menuItem} />}            
          </Col>
          <Col span={6}></Col>
        </Row>
      </Header>
      <Content className="content">
        {children}
      </Content>
    </Layout>
  )
}

export default LayoutComponent
