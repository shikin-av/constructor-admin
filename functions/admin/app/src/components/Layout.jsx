import React from 'react'
import { useLocation } from 'react-router-dom'
import { Layout, Typography, Row, Col } from 'antd'
import Menu from './Menu'
const { Header, Content } = Layout
const { Title } = Typography

const LayoutComponent = ({ children, menuItem }) => {
  const location = useLocation()

  return (
    <Layout id="app">
      <Header id="header">
        <Row align="middle">
          <Col span={6}>
            <Title level={4} id="header-title">Constructor</Title>
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
