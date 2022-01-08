/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect }  from 'react'
import { Pagination, Divider } from 'antd'
import { observer } from 'mobx-react-lite'
import { createStepStore as store } from './CreateStepStore'
import { LOADING } from '../../../constants'
import i18n from '../../../components/Lang/i18n'
import Lang from '../../../components/Lang/Lang'
import Unauthorized from '../../../components/Unauthorized'
import Error from '../../../components/Error'
import Loader from '../../../components/Loader'
import ModelCard from './ModelCard'

const ModelsList =  observer(() => {
  useEffect(() => {
    store.loadModelsPage()
  }, [store.startAt, store.token])

  return (
    <>
      {store.loading === LOADING.NONE && null}
      {store.loading === LOADING.PROGRESS && <Loader />}
      {store.loading === LOADING.UNAUTHORIZED && <Unauthorized />}
      {store.loading === LOADING.ERROR && <Error message={store.error} />}
      {store.loading === LOADING.SUCCESS &&
        <>
          <Divider orientation="left">
            <Lang text={i18n.CREATE_STEP.MODELS_TITLE} />
          </Divider>
          <div className="models-list">
            {store.pageModels.map(model => {
              const { modelId } = model
              const selected = store.isSelected(modelId)
              return (
                <ModelCard
                  key={modelId}
                  modelId={modelId}
                  selected={selected}
                />
              )
            })}
          </div>
          <Pagination
            onChange={store.paginationChange}
            total={store.allModelsCount}
            pageSize={store.LIMIT}
            current={store.pageNumber}
          />
        </>
      }
    </>
  )
})

export default ModelsList
