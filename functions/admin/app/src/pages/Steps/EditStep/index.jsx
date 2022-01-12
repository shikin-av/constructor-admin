import React from 'react'
import { Row, Col, Divider } from 'antd'
import { MENU_ITEMS, MODES } from '../../../constants'
import i18n from '../../../components/Lang/i18n'
import Lang from '../../../components/Lang/Lang'
import Layout from '../../../components/Layout'
import ModelsList from './ModelsList'
import StepBlock from './StepBlock'

const EditStepPage = ({ mode }) => {
  return (
    <Layout menuItem={MENU_ITEMS.STEPS}>
      <Divider>
        <h1>
          <Lang text={mode === MODES.CREATE
            ? i18n.EDIT_STEP.CREATE_TITLE
            : i18n.EDIT_STEP.EDIT_TITLE
          } />
        </h1>
      </Divider>
      <Row gutter={16}>
        <Col span={15}>
          <ModelsList />
        </Col>
        <Col span={9}>
          <StepBlock mode={mode} />
        </Col>
      </Row>
    </Layout>
  )
}

export default EditStepPage
