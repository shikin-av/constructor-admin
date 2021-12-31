import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { MENU_ITEMS, HEADERS, API_URL } from '../constants'
import HandleResponse from '../components/HandleResponse'
import i18n from '../components/Lang/i18n'

const Home = () => {
  const [responce, setResponce] = useState()

  useEffect(() => {
    getServerData()
  }, [])

  const getServerData = async () => {
    const token = localStorage.getItem('token')

    await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: { ...HEADERS, token },
    })
    .then(res => setResponce(res))
    .catch(err => setResponce(err))
  }

  const Content = ({ result: { users } }) => {
    return (
      <>
        <h1>{i18n.HOME.TITLE}</h1>
        {users.map(user => (
          <div key={user.uid}>
            <p>{user.uid}</p>
            <p>{user.email}</p>
            <hr />
          </div>
        ))}
      </>
    )
  }

  return (
    <Layout menuItem={MENU_ITEMS.HOME}>
      <HandleResponse res={responce} render={result => <Content result={result} />}/>
    </Layout>
  )
}

export default Home