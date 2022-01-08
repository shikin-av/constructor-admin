import React from 'react'
import { Row, Col, Divider } from 'antd'
import { MENU_ITEMS } from '../../../constants'
import i18n from '../../../components/Lang/i18n'
import Lang from '../../../components/Lang/Lang'
import Layout from '../../../components/Layout'
import ModelsList from './ModelsList'
import StepBlock from './StepBlock'

const CreateStepPage = () => {
  return (
    <Layout menuItem={MENU_ITEMS.STEPS}>
      <Divider>
        <h1>
          <Lang text={i18n.CREATE_STEP.TITLE} />
        </h1>
      </Divider>
      <Row gutter={16}>
        <Col span={15}>
          <ModelsList />
        </Col>
        <Col span={9}>
          <StepBlock />
        </Col>
      </Row>
    </Layout>
  )
}

export default CreateStepPage
