import React from 'react'
import { Layout, Typography } from 'antd'
const { Header, Content } = Layout
const { Title } = Typography

const LayoutComponent = ({ children }) => {
  return (
    <Layout id="app">
      <Header id="header">
        <Title level={4} id="header-title">Constructor</Title>
      </Header>
      <Content className="full-height">
        {children}
      </Content>
    </Layout>
  )
}

export default LayoutComponent
