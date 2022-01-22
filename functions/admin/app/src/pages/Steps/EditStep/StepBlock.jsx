/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useMemo } from 'react'
import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom'
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { Divider, Select, Button, DatePicker, Space, message } from 'antd'
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { editStepStore as store } from './EditStepStore'
import i18n from '../../../components/Lang/i18n'
import Lang from '../../../components/Lang/Lang'
import { LangContext } from '../../../components/Lang/LangContext'
import UploadImage from '../../../components/UploadImage'
import Unauthorized from '../../../components/Unauthorized'
import Loader from '../../../components/Loader'
import SelectedCard from './SelectedCard'
import DescriptionsBlock from './DescriptionBlock'
import { LOADING, STEP_STATUS, MODES } from '../../../constants'
const { Option } = Select
const { RangePicker } = DatePicker

const StepBlock =  observer(({ mode }) => {
  const navigate = useNavigate()
  const [lang] = useContext(LangContext)
  const { stepId: navStepId } = useParams()

  useEffect(async () => {
    store.resetStep()
    store.resetModels()

    if (mode === MODES.CREATE) {
      store.setStepId(uuidv4())
      store.resetModels()
      store.loadModelsPage()
    } else if (mode === MODES.EDIT && navStepId) {
      store.setStepId(navStepId)
      await store.loadStoryStep(navStepId)
      await store.loadModelsPage()
      
    }
  }, [mode, navStepId, store.saveLoading])

  useEffect(() => {
    store.loadModelsPage()
  }, [store.startAt])

  useEffect(() => {
    if (store.saveLoading === LOADING.SUCCESS) {
      message.success(i18n.EDIT_STEP.MESSAGES.SAVE_SUCCESS[lang])

      const id = store.stepId + ''
      console.log('ID', id)
      store.resetStep()
      store.resetModels()
      navigate(`/steps/${id || ''}`)

    } else if (store.saveLoading === LOADING.ERROR) {
      message.error(store.saveError || i18n.EDIT_STEP.MESSAGES.SAVE_ERROR[lang])
    }
  }, [store.saveLoading])

  const disableSubmit = store.selectedModels.length === 0

  const loading = useMemo(() => {
    if (store.saveLoading === LOADING.UNAUTHORIZED || store.stepLoading === LOADING.UNAUTHORIZED) {
      return LOADING.UNAUTHORIZED
    }

    const saveStatus = store.saveLoading === LOADING.NONE || store.saveLoading === LOADING.SUCCESS
    const loadStatus = mode === MODES.EDIT
      ? store.stepLoading === LOADING.SUCCESS
      : true
    
    let loadedSelectedModelsCount = 0
    let loadedAllSelectedModels = true

    if (mode === MODES.EDIT && store.selectedModels.length) {
      for (const selected of toJS(store.selectedModels)) {
        const loaded = _.find(toJS(store.allModels), { userId: selected.userId, modelId: selected.modelId })
        loadedSelectedModelsCount = loaded
          ? loadedSelectedModelsCount + 1
          : loadedSelectedModelsCount
      } 
      loadedAllSelectedModels = loadedSelectedModelsCount === store.selectedModels.length
    }    
    
    return saveStatus && loadStatus && loadedAllSelectedModels
      ? LOADING.SUCCESS
      : LOADING.PROGRESS
  }, [mode, store.saveLoading, store.stepLoading, store.modelsLoading, store.allModels, store.selectedModels])

  return (
    <div className="step-block shadow">
      <div>
        <Divider>
          <Lang text={i18n.EDIT_STEP.STEP_BLOCK_TITLE} />
        </Divider>
      </div>

      {loading === LOADING.UNAUTHORIZED &&
        <div className="step-block-message">
          <Unauthorized />
        </div>
      }
      {loading === LOADING.PROGRESS &&
        <div className="step-block-message">
          <Loader />
        </div>
      }
      {loading === LOADING.SUCCESS &&
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
                * <Lang text={i18n.EDIT_STEP.FORM.STATUS} />
              </div>
              <Select value={[store.status]} onChange={store.setStatus}>
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

            <DescriptionsBlock />
              
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
