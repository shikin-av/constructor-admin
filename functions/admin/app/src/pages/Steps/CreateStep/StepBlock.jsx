/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { Divider, Form, Input, Select, Button, DatePicker, Space } from 'antd'
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite'
import { createStepStore as store, STATUS } from './CreateStepStore'
import i18n from '../../../components/Lang/i18n'
import Lang from '../../../components/Lang/Lang'
import SelectedCard from './SelectedCard';
const { Option } = Select
const { RangePicker } = DatePicker
const { TextArea } = Input

const StepBlock =  observer(() => {
  return (
    <div className="step-block shadow">
      <div>
        <Divider>
          <Lang text={i18n.CREATE_STEP.STEP_BLOCK_TITLE} />
        </Divider>
      </div>
      <div className="step-block-models">
        {!store.selectedModels.length
          ? <div className="models-placeholder warning-text">
              <Lang text={i18n.CREATE_STEP.FORM.MODELS_PLACEHOLDER} />
            </div>
          : null
        }
        {store.selectedModels.map(model => {
          const { modelId } = model
          return (
            <SelectedCard
              key={modelId}
              modelId={modelId}
            />
          )
        })}
      </div>
      <div>
        <Form
          onFinish={store.saveStoryStep}
          initialValues={{
            title: store.title,
            description: store.description,
            status: store.status,
            specialDates: store.specialDates,
          }}
        >
          <Form.Item 
            name="title" 
            label={<Lang text={i18n.CREATE_STEP.FORM.TITLE} />}
            rules={[{ 
              required: true, 
              message: <Lang text={i18n.CREATE_STEP.FORM.TITLE_PLACEHOLDER} /> 
            }]}
          >
            <Input value={store.title} onChange={val => store.title = val}/>
          </Form.Item>

          <Form.Item 
            name="description" 
            label={<Lang text={i18n.CREATE_STEP.FORM.DESCRIPTION} />}
            rules={[{ 
              required: false, 
              message: <Lang text={i18n.CREATE_STEP.FORM.DESCRIPTION_PLACEHOLDER} /> 
            }]}
          >
            <TextArea value={store.description} onChange={val => store.description = val}/>
          </Form.Item>

          <Form.Item
            name="status"
            label={<Lang text={i18n.CREATE_STEP.FORM.STATUS} />}
          >
            <Select onChange={val => store.setStatus(val)}>
              <Option value={STATUS.WAIT_APPROVE}>
                <Space>
                  <ClockCircleOutlined style={{ color: '#e9b41e' }} />
                  <Lang text={i18n.CREATE_STEP.FORM.STATUSES.WAIT_APPROVE} />
                </Space>                
              </Option>
              <Option value={STATUS.APPROVED}>
                <Space>
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  <Lang text={i18n.CREATE_STEP.FORM.STATUSES.APPROVED} />
                </Space>
              </Option>
              <Option value={STATUS.CLOSED}>
                <Space>
                  <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                  <Lang text={i18n.CREATE_STEP.FORM.STATUSES.CLOSED} />
                </Space>
              </Option>
            </Select>
          </Form.Item>

          <Form.Item 
            name="specialDates" 
            label={<Lang text={i18n.CREATE_STEP.FORM.SPECIAL_DATES} />}
            rules={[{ 
              required: false, 
              message: <Lang text={i18n.CREATE_STEP.FORM.SPECIAL_DATES_PLACEHOLDER} /> 
            }]}
          >
            <RangePicker
              onChange={store.changeDates}
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              <Lang text={i18n.CREATE_STEP.FORM.SAVE_STEP_BUTTON} />
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
})

export default StepBlock
