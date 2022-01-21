/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect }  from 'react'
import { Pagination, Divider } from 'antd'
import { observer } from 'mobx-react-lite'
import { editStepStore as store } from './EditStepStore'
import { LOADING } from '../../../constants'
import i18n from '../../../components/Lang/i18n'
import Lang from '../../../components/Lang/Lang'
import Unauthorized from '../../../components/Unauthorized'
import Error from '../../../components/Error'
import Loader from '../../../components/Loader'
import ModelCard from './ModelCard'

const ModelsList =  observer(() => {
  useEffect(() => {
    store.resetModels()
    store.loadModelsPage()
  }, [])

  useEffect(() => {
    store.loadModelsPage()
  }, [store.startAt])

  useEffect(() => {
    if (store.saveLoading === LOADING.SUCCESS) {
      store.resetModels()
      store.loadModelsPage()
    }    
  }, [store.saveLoading])

  return (
    <>
      {store.modelsLoading === LOADING.NONE && null}
      {store.modelsLoading === LOADING.PROGRESS && <Loader />}
      {store.modelsLoading === LOADING.UNAUTHORIZED && <Unauthorized />}
      {store.modelsLoading === LOADING.ERROR && <Error message={store.modelsError} />}
      {store.modelsLoading === LOADING.SUCCESS &&
        <>
          <Divider orientation="left">
            <Lang text={i18n.EDIT_STEP.MODELS_TITLE} />
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
