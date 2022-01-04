import React, { useState, useEffect, useCallback } from 'react'
import { Pagination } from 'antd'
import { MENU_ITEMS, HEADERS, API_URL, LOADING } from '../../constants'
import { handleResponse, getPageNumber, getStartAt } from '../../utils/response'
import i18n from '../../components/Lang/i18n'
import Lang from '../../components/Lang/Lang'
import Layout from '../../components/Layout'
import ModelCard from '../../components/ModelCard'
import Unauthorized from '../../components/Unauthorized'
import Error from '../../components/Error'
import Loader from '../../components/Loader'

const CreateStep = () => {
  const LIMIT = 4
  const token = localStorage.getItem('token')
  const [startAt, setStartAt] = useState(0)
  const [response, setResponse] = useState()

  const loadPage = useCallback(async (startAt) => {
    console.log(`>>> ${API_URL}/models/needPublishModels/${startAt}/${LIMIT}`)

    await fetch(`${API_URL}/models/needPublishModels/${startAt}/${LIMIT}`, {
      method: 'GET',
      headers: { ...HEADERS, token },
    })
    .then(async res => {
      const handledResponse = await handleResponse(res)
      setResponse(handledResponse)
    })
    .catch(async err => {
      const handledResponse = await handleResponse(err)
      setResponse(handledResponse)
    })
  }, [token])

  const paginationChange = (page) => {
    setStartAt(getStartAt(page, LIMIT))
  }

  useEffect(() => {
    loadPage(startAt)
  }, [startAt, loadPage])

  const renderContent = useCallback(() => {
    const { models, allModelsCount } = response.payload
    return (
      <Layout menuItem={MENU_ITEMS.STEPS}>
        <h1>
          <Lang text={i18n.CREATE_STEP.TITLE} />
        </h1>
        <div className="models-list">
        {models.map(model =>
          <ModelCard model={model} key={model.modelId} />
        )}
        </div>
        <Pagination
          onChange={paginationChange}
          total={allModelsCount}
          pageSize={LIMIT}
          current={getPageNumber(startAt, LIMIT)}
        />
      </Layout>
    )
  }, [response, startAt])

  return !response ? <Loader /> :
    <>
      {response.status === LOADING.UNAUTHORIZED && <Unauthorized />}
      {response.status === LOADING.ERROR && <Error message={response.error} />}
      {response.status === LOADING.SUCCESS && renderContent()}
    </>
}

export default CreateStep
