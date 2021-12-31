import React, { useState, useEffect } from 'react'
import { MENU_ITEMS, HEADERS, API_URL } from '../../constants'
import i18n from '../../components/Lang/i18n'
import Lang from '../../components/Lang/Lang'
import Layout from '../../components/Layout'
import HandleResponse from '../../components/HandleResponse'
import { dateFormat, timeFormat } from '../../utils/date'

const CreateSteps = () => {
  const [responce, setResponce] = useState()
  const [startAt, setStartAt] = useState(0)
  const [limit, setLimit] = useState(4)

  useEffect(() => {
    getServerData()
  }, [])

  const getServerData = async () => {
    const token = localStorage.getItem('token')

    console.log(`>>> ${API_URL}/models/needPublishModels/${startAt}/${limit}`)

    await fetch(`${API_URL}/models/needPublishModels/${startAt}/${limit}`, {
      method: 'GET',
      headers: { ...HEADERS, token },
    })
    .then(res => setResponce(res))
    .catch(err => setResponce(err))
  }

  const Content = ({ result }) => {
    const { models } = result

    console.log(result)    

    return (
      <>
        <h1>
          <Lang text={i18n.STEPS.TITLE} />
        </h1>
        {models.map(model => {
          const { date, modelId, userId } = model
          const formattedDate = `${dateFormat(date)}  |  ${timeFormat(date)}`
          return (
            <div key={modelId}>
              <p>{formattedDate}</p>
              <p>{modelId}</p>
              <p>{userId}</p>
              <hr />
            </div>
          )
          })}
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