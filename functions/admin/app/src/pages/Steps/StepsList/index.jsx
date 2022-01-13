/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useContext }  from 'react'
import { useNavigate } from 'react-router-dom'
import { Pagination, Divider, Table, Tag, Row, Popconfirm } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite'
import { stepsListStore as store } from './StepsListStore'
import { LOADING, MENU_ITEMS } from '../../../constants'
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
    const step = store.getStepById(stepId)
    console.log('DELETE', { ...step })
  }

  const EditComlumn = ({ stepId }) => {
    return (
      <div className="edit-step-div">
        <p>
          <EditOutlined
            onClick={() => editStep(stepId)}
            style={{ fontSize: 20, color: '#1890ff' }} />
        </p>
        <Popconfirm
          onConfirm={() => deleteStep(stepId)}
          title={<Lang text={i18n.STEPS_LIST.DELETE_STEP_QUESTION} />}          
        >
          <p className="delete-icon">
            <DeleteOutlined style={{ fontSize: 20, color: 'red' }} />
          </p>
        </Popconfirm>
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
    },
    {
      title: i18n.STEPS_LIST.COLUMNS.DESCRIPTION[lang],
      dataIndex: 'description',
      key: 'description',
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
