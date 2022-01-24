import React, { useEffect, useState, useCallback } from 'react'
import { MENU_ITEMS, HEADERS, API_URL, LOADING } from '../constants'
import { handleResponse } from '../utils/response'
import Layout from '../components/Layout'
import i18n from '../components/Lang/i18n'
import Lang from '../components/Lang/Lang'
import Unauthorized from '../components/Unauthorized'
import Error from '../components/Error'
import Loader from '../components/Loader'

const Home = () => {
  const token = localStorage.getItem('token')
  const [response, setResponse] = useState()

  const getServerData = useCallback(async () => {
    setResponse({
      status: LOADING.SUCCESS
    })
    return null

    await fetch(`${API_URL}/test`, {
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

  useEffect(() => {
    getServerData()
  }, [getServerData])

  const renderContent = useCallback(() => {
    // const { users } = response.payload

    console.log(response.payload)

    return (
      <Layout menuItem={MENU_ITEMS.HOME}>
        <h1>
          <Lang text={i18n.HOME.TITLE} />
        </h1>
        {/* {users.map(user => (
          <div key={user.uid}>
            <p>{user.uid}</p>
            <p>{user.email}</p>
            <hr />
          </div>
        ))} */}
      </Layout>
    )
  }, [response])

  return !response ? <Loader /> :
    <>
      {response.status === LOADING.NONE && null}
      {response.status === LOADING.PROGRESS && <Loader />}
      {response.status === LOADING.UNAUTHORIZED && <Unauthorized />}
      {response.status === LOADING.ERROR && <Error message={response.error} />}
      {response.status === LOADING.SUCCESS && renderContent()}
    </>
}

export default Home