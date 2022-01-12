/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect }  from 'react'
import { Pagination, Divider, Table, Tag, Space, Row } from 'antd'
import { observer } from 'mobx-react-lite'
import { stepsStore as store } from './StepsStore'
import { LOADING, MENU_ITEMS } from '../../../constants'
import Layout from '../../../components/Layout'
import i18n from '../../../components/Lang/i18n'
import Lang from '../../../components/Lang/Lang'
import Unauthorized from '../../../components/Unauthorized'
import Error from '../../../components/Error'
import Loader from '../../../components/Loader'

const StepsListPage =  observer(() => {
  useEffect(() => {
    store.reset()
    store.loadStepsPage()
  }, [])

  useEffect(() => {
    store.loadStepsPage()
  }, [store.startAt, store.token])

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
          <>
            <div className="steps-list">
              {store.pageSteps.map(step => {
                return (
                  <p>{step.title}</p>
                )
              })}
            </div>
            <Pagination
              onChange={store.paginationChange}
              total={store.allStepsCount}
              pageSize={store.LIMIT}
              current={store.pageNumber}
            />
          </>
        }
      </Row>
    </Layout>
  )
})

export default StepsListPage
