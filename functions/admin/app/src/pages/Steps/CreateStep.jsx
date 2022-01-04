import React, { useEffect, useCallback } from 'react'
import { Pagination } from 'antd'
import { observer } from 'mobx-react-lite'
import { createStepStore as store } from './CreateStepStore'
import { MENU_ITEMS, LOADING } from '../../constants'
import i18n from '../../components/Lang/i18n'
import Lang from '../../components/Lang/Lang'
import Layout from '../../components/Layout'
import ModelCard from '../../components/ModelCard'
import Unauthorized from '../../components/Unauthorized'
import Error from '../../components/Error'
import Loader from '../../components/Loader'

const CreateStep = observer(() => {
  useEffect(() => {
    store.loadPage()
  }, [store.startAt, store.token])

  const renderContent = useCallback(() => {
    return (
      <Layout menuItem={MENU_ITEMS.STEPS}>
        <h1>
          <Lang text={i18n.CREATE_STEP.TITLE} />
        </h1>
        <div className="models-list">
        {store.models.map(model =>
          <ModelCard modelId={model.modelId} key={model.modelId} />
        )}
        </div>
        <Pagination
          onChange={store.paginationChange}
          total={store.allModelsCount}
          pageSize={store.LIMIT}
          current={store.pageNumber}
        />
      </Layout>
    )
  }, [store.models, store.allModelsCount, store.LIMIT, store.pageNumber])

  return (
    <>
      {store.status === LOADING.NONE && null}
      {store.status === LOADING.PROGRESS && <Loader />}
      {store.status === LOADING.UNAUTHORIZED && <Unauthorized />}
      {store.status === LOADING.ERROR && <Error message={store.error} />}
      {store.status === LOADING.SUCCESS && renderContent()}
    </>
  )
})

export default CreateStep
