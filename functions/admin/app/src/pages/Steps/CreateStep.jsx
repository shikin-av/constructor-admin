import React, { useState, useEffect, useCallback } from 'react'
import { Pagination } from 'antd'
import { MENU_ITEMS, HEADERS, API_URL } from '../../constants'
import i18n from '../../components/Lang/i18n'
import Lang from '../../components/Lang/Lang'
import Layout from '../../components/Layout'
import HandleResponse from '../../components/HandleResponse'
import ModelCard from '../../components/ModelCard'


const CreateStep = () => {
  const token = localStorage.getItem('token')
  const LIMIT = 4
  const [startAt, setStartAt] = useState(0)
  const [modelsResponse, setModelsResponse] = useState()
  const [modelsCountResponse, setModelsCountResponse] = useState()
  const [pageNumber, setPageNumber] = useState(1)

  const loadPage = useCallback(async () => {
    console.log(`>>> ${API_URL}/models/needPublishModels/${startAt}/${LIMIT}`)

    await fetch(`${API_URL}/models/needPublishModels/${startAt}/${LIMIT}`, {
      method: 'GET',
      headers: { ...HEADERS, token },
    })
    .then(res => setModelsResponse(res))
    .catch(err => setModelsResponse(err))
  }, [startAt, LIMIT, token])

  const loadModelsCount = useCallback(async () => {
    console.log(`>>> ${API_URL}/models/getNeedPublishModelsCount`)

    await fetch(`${API_URL}/models/getNeedPublishModelsCount`, {
      method: 'GET',
      headers: { ...HEADERS, token },
    })
    .then(async res => setModelsCountResponse(res))
    .catch(err => setModelsCountResponse(err))
  }, [token])

  const paginationChange = (page) => {
    const start = page === 1 ? 0 : LIMIT * (page - 1)
    setStartAt(start)
    setPageNumber(page)
  }

  useEffect(() => {
    loadModelsCount()
    loadPage()
  }, [loadPage, loadModelsCount])

  useEffect(() => {
  }, [modelsCountResponse])

  const PaginationContent = ({ result }) => {
    const { modelsCount } = result

    return (
      <Pagination
        onChange={paginationChange}
        total={modelsCount}
        pageSize={LIMIT}
        current={pageNumber}
      />
    )
  }

  const ModelsContent = ({ result }) => {
    const { models } = result
    return (
      <>
        <h1>
          <Lang text={i18n.CREATE_STEP.TITLE} />
        </h1>
        <div className="models-list">
        {models.map(model =>
          <ModelCard model={model} key={model.modelId} />
        )}
        </div>
        
      </>
    )
  }

  return (
    <Layout menuItem={MENU_ITEMS.STEPS}>
      <HandleResponse res={modelsResponse} render={result => <ModelsContent result={result} />}/>
      <div style={{ height: 50 }}>
        <HandleResponse res={modelsCountResponse} render={result => <PaginationContent result={result} />}/>
      </div>
    </Layout>
  )
}

export default CreateStep