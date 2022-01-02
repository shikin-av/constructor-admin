import React, { useState, useEffect, useCallback } from 'react'
import { MENU_ITEMS, HEADERS, API_URL } from '../../constants'
import i18n from '../../components/Lang/i18n'
import Lang from '../../components/Lang/Lang'
import Layout from '../../components/Layout'
import HandleResponse from '../../components/HandleResponse'
import ModelCard from '../../components/ModelCard'


const CreateSteps = () => {
  const [responce, setResponce] = useState()
  const [startAt, setStartAt] = useState(0)
  const [limit, setLimit] = useState(4)

  const getServerData = useCallback(async () => {
    const token = localStorage.getItem('token')

    console.log(`>>> ${API_URL}/models/needPublishModels/${startAt}/${limit}`)

    await fetch(`${API_URL}/models/needPublishModels/${startAt}/${limit}`, {
      method: 'GET',
      headers: { ...HEADERS, token },
    })
    .then(res => setResponce(res))
    .catch(err => setResponce(err))
  }, [startAt, limit])

  useEffect(() => {
    getServerData()
  }, [getServerData])

  const Content = ({ result }) => {
    const { models } = result

    return (
      <>
        <h1>
          <Lang text={i18n.STEPS.TITLE} />
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
      <HandleResponse res={responce} render={result => <Content result={result} />}/>
    </Layout>
  )
}

export default CreateSteps