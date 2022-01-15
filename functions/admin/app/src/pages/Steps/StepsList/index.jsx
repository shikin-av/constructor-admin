/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useContext }  from 'react'
import { useNavigate } from 'react-router-dom'
import { Pagination, Divider, Table, Tag, Row, Popconfirm, Tooltip, message } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite'
import { stepsListStore as store } from './StepsListStore'
import { LOADING, MENU_ITEMS, EMPTY_LANG_INPUTS } from '../../../constants'
import { getStatusColor } from '../../../utils/steps'
import { dateFormat } from '../../../utils/date'
import { LangContext } from '../../../components/Lang/LangContext'
import Layout from '../../../components/Layout'
import i18n from '../../../components/Lang/i18n'
import Lang from '../../../components/Lang/Lang'
import Unauthorized from '../../../components/Unauthorized'
import Error from '../../../components/Error'
import Loader from '../../../components/Loader'
import StepImage from './StepImage'

const StepsListPage =  observer(() => {
  const navigate = useNavigate()
  const [lang] = useContext(LangContext)

  const editStep = (stepId) => {
    navigate(`/${MENU_ITEMS.STEPS}/${stepId}`)
  }

  const deleteStep = (stepId) => {
    store.deleteStep(stepId)
  }

  const EditComlumn = ({ stepId }) => {
    const step = store.getStepById(stepId)
    const disabled = step.usedByUser

    return (
      <div className="edit-step-div">
        <p>
          <EditOutlined
            onClick={() => editStep(stepId)}
            style={{ fontSize: 20, color: '#1890ff' }} />
        </p>
        <Popconfirm
          onConfirm={() => deleteStep(stepId)}
          disabled={disabled}
          title={<Lang text={i18n.STEPS_LIST.DELETE_STEP_QUESTION} />}          
        >
          {disabled
            ? <Tooltip title={<Lang text={i18n.STEPS_LIST.DELETE_DISABLED_DESCRIPTION} />}>
                <DeleteOutlined className="delete-icon-disabled"/>
              </Tooltip>
            : <DeleteOutlined className="delete-icon"/>
          }
        </Popconfirm>
      </div>
    )
  }

  const LangInputsColumn = ({ inputs }) => {
    const MAX_NUMBER = 3
    let filledObj = {}
    for (const [key, val] of Object.entries({ ...inputs })) {
      if (val) {
        filledObj = { ...filledObj, [key]: val }
      }
    }
    const filledValues = Object.values(filledObj).filter(val => !!val)
    const count = filledValues.length
    const allCount = Object.values(EMPTY_LANG_INPUTS).length
    const bigger = count > MAX_NUMBER

    // Order by lang
    let rendered = []
    if (filledObj.ENG) {
      rendered = [{ lang: 'ENG', text: filledObj.ENG }]
      delete filledObj.ENG
    }
    if (filledObj.DAT) {
      rendered = [{ lang: 'DAT', text: filledObj.DAT }]
      delete filledObj.DAT
    }
    if (filledObj.RUS) {
      rendered = [ ...rendered, { lang: 'RUS', text: filledObj.RUS }]
      delete filledObj.RUS
    }
    
    for (const [key, val] of Object.entries({ ...filledObj })) {
      if (rendered.length < MAX_NUMBER) {
        rendered = [ ...rendered, { lang: key, text: val }]
      } else {
        break
      }
    }
   
    return (
      <div className="lang-inputs-column">
        <p className="bold">{`[ ${count} / ${allCount} ]`}</p>
        {rendered.map(({ lang, text }) => (
          <p key={lang}>
            <span className="bold">{lang}: </span>
            <span>{text}</span>
          </p>
        ))}
        {bigger && <span className="bold">. . .</span>}
      </div>
    )
  }

  useEffect(() => {
    store.reset()
    store.loadStepsPage()
  }, [])

  useEffect(() => {
    store.loadStepsPage()
  }, [store.startAt, store.token])

  useEffect(() => {
    if (store.deleteLoading === LOADING.SUCCESS) {
      message.success(i18n.STEPS_LIST.MESSAGES.DELETE_SUCCESS[lang])
    } else if (store.deleteLoading === LOADING.ERROR) {
      message.error(store.saveError || i18n.STEPS_LIST.MESSAGES.DELETE_ERROR[lang])
    }
  }, [store.deleteLoading])

  const columns = useMemo(() => [
    {
      title: i18n.STEPS_LIST.COLUMNS.EDIT[lang],
      dataIndex: 'stepId',
      key: 'stepId',
      render: (stepId) => <EditComlumn stepId={stepId} />
    },
    {
      title: i18n.STEPS_LIST.COLUMNS.IMAGE[lang],
      dataIndex: 'imageName',
      key: 'imageName',
      render: (imageName) => <StepImage imageName={imageName} />
    },
    {
      title: i18n.STEPS_LIST.COLUMNS.STATUS[lang],
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>
    },
    {
      title: i18n.STEPS_LIST.COLUMNS.MODELS_COUNT[lang],
      dataIndex: 'models',
      key: 'models',
      render: (models) => models.length
    },
    {
      title: i18n.STEPS_LIST.COLUMNS.TITLE[lang],
      dataIndex: 'title',
      key: 'title',
      render: (title) => {
        return {
          props: { style: { verticalAlign: 'top' } },
          children: <LangInputsColumn inputs={title} />
        }
      },
    },
    {
      title: i18n.STEPS_LIST.COLUMNS.DESCRIPTION[lang],
      dataIndex: 'description',
      key: 'description',
      render: (description) => {
        return {
          props: { style: { verticalAlign: 'top' } },
          children: <LangInputsColumn inputs={description} />
        }
      },
    },
    {
      title: i18n.STEPS_LIST.COLUMNS.SPECIAL_DATES[lang],
      dataIndex: 'specialDates',
      key: 'specialDates',
      render: (dates) => {
        if (!dates || !dates.length || dates.length !== 2) return null
        return <>
          <p>{dateFormat(dates[0])}</p>
          <p>{dateFormat(dates[1])}</p>
        </>
      }
    },
  ], [lang]) 

  return (
    <Layout menuItem={MENU_ITEMS.STEPS}>
      <Divider>
        <h1>
          <Lang text={i18n.STEPS_LIST.TITLE} />
        </h1>
      </Divider>
      <Row gutter={16} className="full-height">
        {store.stepsLoading === LOADING.NONE && null}
        {store.stepsLoading === LOADING.PROGRESS && <Loader />}
        {store.stepsLoading === LOADING.UNAUTHORIZED && <Unauthorized />}
        {store.stepsLoading === LOADING.ERROR && <Error message={store.stepsError} />}
        {store.stepsLoading === LOADING.SUCCESS &&
          <div>
            <div className="steps-list">
            <Table
              columns={columns}
              dataSource={store.pageSteps}
              pagination={false}
            />
            </div>
            <Pagination
              onChange={store.paginationChange}
              total={store.allStepsCount}
              pageSize={store.LIMIT}
              current={store.pageNumber}
            />
          </div>
        }
      </Row>
    </Layout>
  )
})

export default StepsListPage
