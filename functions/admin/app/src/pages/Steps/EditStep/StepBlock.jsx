/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { Divider, Input, Select, Button, DatePicker, Space, message } from 'antd'
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react-lite'
import { editStepStore as store } from './EditStepStore'
import i18n from '../../../components/Lang/i18n'
import Lang from '../../../components/Lang/Lang'
import { LangContext } from '../../../components/Lang/LangContext'
import UploadImage from '../../../components/UploadImage'
import Unauthorized from '../../../components/Unauthorized'
import Loader from '../../../components/Loader'
import SelectedCard from './SelectedCard'
import { LOADING, STEP_STATUS, MODES } from '../../../constants'
const { Option } = Select
const { RangePicker } = DatePicker
const { TextArea } = Input

const StepBlock =  observer(({ mode }) => {
  const navigate = useNavigate()
  const [lang] = useContext(LangContext)
  const { stepId: navStepId } = useParams()

  useEffect(() => {
    store.resetStep()

    if (mode === MODES.CREATE) {
      store.setStepId(uuidv4())
    } else if (mode === MODES.EDIT && navStepId) {
      store.setStepId(navStepId)
    }
  }, [])

  useEffect(() => {
    if (store.saveLoading === LOADING.SUCCESS) {
      message.success(i18n.EDIT_STEP.MESSAGES.SAVE_SUCCESS[lang])

      const id = store.stepId + ''
      store.resetStep() 
      navigate(`/steps/${id || ''}`)

    } else if (store.saveLoading === LOADING.ERROR) {
      message.error(store.saveError || i18n.EDIT_STEP.MESSAGES.SAVE_ERROR[lang])
    }
  }, [store.saveLoading])

  const disableSubmit = store.selectedModels.length === 0 || store.title.length === 0

  return (
    <div className="step-block shadow">
      <div>
        <Divider>
          <Lang text={i18n.EDIT_STEP.STEP_BLOCK_TITLE} />
        </Divider>
      </div>

      {store.saveLoading === LOADING.UNAUTHORIZED &&
        <div className="step-block-message">
          <Unauthorized />
        </div>
      }
      {store.saveLoading === LOADING.PROGRESS &&
        <div className="step-block-message">
          <Loader />
        </div>
      }
      {(store.saveLoading === LOADING.NONE || store.saveLoading === LOADING.SUCCESS) &&
        <>
          <div className="step-block-models">
            {!store.selectedModels.length
              ? <div className="models-placeholder warning-text">
                  <Lang text={i18n.EDIT_STEP.FORM.MODELS_PLACEHOLDER} />
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
                * <Lang text={i18n.EDIT_STEP.FORM.TITLE} />
              </div>
              <Input value={store.title} onChange={store.setTitle}/>          
            </div>

            <div className="input">
              <div className="label">
                <Lang text={i18n.EDIT_STEP.FORM.DESCRIPTION} />
              </div>
              <TextArea value={store.description} onChange={store.setDescription}/>
            </div> 
            
            <div className="input">
              <div className="label">
                * <Lang text={i18n.EDIT_STEP.FORM.STATUS} />
              </div>
              <Select defaultValue={store.status} onChange={store.setStatus}>
                <Option value={STEP_STATUS.WAIT_APPROVE}>
                  <Space>
                    <ClockCircleOutlined style={{ color: '#e9b41e' }} />
                    <Lang text={i18n.EDIT_STEP.FORM.STATUSES.WAIT_APPROVE} />
                  </Space>                
                </Option>
                <Option value={STEP_STATUS.APPROVED}>
                  <Space>
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    <Lang text={i18n.EDIT_STEP.FORM.STATUSES.APPROVED} />
                  </Space>
                </Option>
                <Option value={STEP_STATUS.CLOSED}>
                  <Space>
                    <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                    <Lang text={i18n.EDIT_STEP.FORM.STATUSES.CLOSED} />
                  </Space>
                </Option>
              </Select>
            </div>

            <div className="input">
              <div className="label">
                <Lang text={i18n.EDIT_STEP.FORM.SPECIAL_DATES} />
              </div>
              <Space>
                <RangePicker
                  defaultValue={store.specialDates}
                  onChange={store.setSpecialDates}
                  format="DD.MM.YYYY"
                />
                {!store.specialDates &&
                  <div className="always">
                    <Lang text={i18n.EDIT_STEP.FORM.SPECIAL_DATES_ALWAYS} />
                  </div>}
              </Space>
            </div>

            <div className="ipload-image">
              <UploadImage
                chooseImage={store.chooseImage}
                removeImage={store.removeImage}                
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
                <Lang text={i18n.EDIT_STEP.FORM.SAVE_STEP_BUTTON} />
              </Button>
            </div>
          </div>
        </>
      }
    </div>
  )
})

export default StepBlock
