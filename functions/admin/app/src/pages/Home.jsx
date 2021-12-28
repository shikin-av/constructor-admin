import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Unauthorized from '../components/Unauthorized'
import { LOADING } from '../constants'
import { MENU_ITEMS } from '../constants'

const Home = () => {
  const navigate = useNavigate()
  const [loading, setLoading ] = useState(LOADING.NONE)
  const [responce, setResponce] = useState()

  useEffect(() => {
    getServerData()
  }, [])

  const getServerData = async () => {
      const token = localStorage.getItem('token')
      setLoading(LOADING.START)

      await fetch(`${process.env.REACT_APP_API_URL}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          token,
        },
      })
      .then(async result => {
        if (result.status === 403 || result.status === 401) {
          throw LOADING.UNAUTHORIZED
        }

        return await result.json()
      })
      .then(result => {
        setLoading(LOADING.SUCCESS)
        setResponce(result)
        console.log(result)
      })
      .catch(err => {
        setLoading(err == LOADING.UNAUTHORIZED ? LOADING.UNAUTHORIZED : LOADING.ERROR)
        console.log(err)
        // navigate('/login')
      })
  }

  return (
    <Layout menuItem={MENU_ITEMS.HOME}>
      <>
      {(loading == LOADING.NONE ||
        loading == LOADING.START ||
        loading == LOADING.PROGRESS) &&
        <h1>LOADING</h1>
      }
      {
        loading == LOADING.ERROR &&
        <h1>ERROR</h1>
      }
      {
        loading == LOADING.UNAUTHORIZED &&
        <Unauthorized />
      }
      {
        loading == LOADING.SUCCESS &&
        <>
          <h1>Home</h1>
          <p>{JSON.stringify(responce)}</p>
        </>
      }
      </>
    </Layout>
  )
}

export default Home