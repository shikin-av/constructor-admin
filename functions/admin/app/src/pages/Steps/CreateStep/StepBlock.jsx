/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Divider, Input, Select, Button, DatePicker, Space } from 'antd'
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react-lite'
import { createStepStore as store, STATUS } from './CreateStepStore'
import i18n from '../../../components/Lang/i18n'
import Lang from '../../../components/Lang/Lang'
import UploadImage from '../../../components/UploadImage'
import Error from '../../../components/Error'
import Unauthorized from '../../../components/Unauthorized'
import SelectedCard from './SelectedCard'
import { LOADING } from '../../../constants'
const { Option } = Select
const { RangePicker } = DatePicker
const { TextArea } = Input

const StepBlock =  observer(() => {
  const navigate = useNavigate()

  useEffect(() => {
    store.resetStep()
  }, [])

  useEffect(() => {
    if (store.saveLoading === LOADING.SUCCESS) {
      store.resetStep()
      navigate('/')
    }
  }, [store.saveLoading])

  const disableSubmit = store.selectedModels.length === 0 || store.title.length === 0

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
        <div className="input">
          <div className="label">
            * <Lang text={i18n.CREATE_STEP.FORM.TITLE} />
          </div>
          <Input value={store.title} onChange={store.setTitle}/>          
        </div>

        <div className="input">
          <div className="label">
            <Lang text={i18n.CREATE_STEP.FORM.DESCRIPTION} />
          </div>
          <TextArea value={store.description} onChange={store.setDescription}/>
        </div> 
        
        <div className="input">
          <div className="label">
            * <Lang text={i18n.CREATE_STEP.FORM.STATUS} />
          </div>
          <Select defaultValue={store.status} onChange={store.setStatus}>
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
        </div>

        <div className="input">
          <div className="label">
            <Lang text={i18n.CREATE_STEP.FORM.SPECIAL_DATES} />
          </div>
          <Space>
            <RangePicker
              defaultValue={store.specialDates}
              onChange={store.setSpecialDates}
              format="DD.MM.YYYY"
            />
            {!store.specialDates &&
              <div className="always">
                <Lang text={i18n.CREATE_STEP.FORM.SPECIAL_DATES_ALWAYS} />
              </div>}
          </Space>
        </div>

        <div className="ipload-image">
          <UploadImage
            imageName={store.imageName}
            setImageName={store.setImageName}
          />
        </div>
          
        <div className="form-submit-div">
          <Button
            type="primary"
            htmlType="submit"
            disabled={disableSubmit}
            loading={store.saveLoading === LOADING.PROGRESS}
            onClick={store.saveStoryStep}
          >
            <Lang text={i18n.CREATE_STEP.FORM.SAVE_STEP_BUTTON} />
          </Button>
          {store.saveLoading === LOADING.ERROR && <Error message={store.modelsError} />}
          {store.saveLoading === LOADING.UNAUTHORIZED && <Unauthorized />}
        </div>
      </div>
    </div>
  )
})

export default StepBlock
