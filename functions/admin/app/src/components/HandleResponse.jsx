import React, { useEffect, useState } from 'react'
import { LOADING } from '../constants'
import Unauthorized from './Unauthorized'
import Error from './Error'
import Loader from './Loader'

const HandleResponse = ({ res, render }) => {
  const [data, setData] = useState(null)

  useEffect(() => {
    handle(res)
  }, [res])

  const handle = async (res) => {
    if (!res) return

    const { status } = res
    if (status) {
      if (status >= 200 && status <= 299) {
        try {
          const payload = await res.json()
          setData({
            status: LOADING.SUCCESS,
            payload,
          })
        } catch (err) {
          setData({
            status: LOADING.ERROR,
            error: err.message || err,
          })
        }    
      } else if (status === 401 || status === 403) {
        setData({
          status: LOADING.UNAUTHORIZED,
        })
      } else {
        setData({
          status: LOADING.ERROR,
          error: res.message || res,
        })
      }
    } else {
      setData({
        status: LOADING.ERROR,
        error: res.message || JSON.stringify(res),
      })
    }
  }

  return !data ? <Loader /> : (
    <>
      {data.status === LOADING.SUCCESS && render(data.payload)}
      {data.status === LOADING.UNAUTHORIZED && <Unauthorized />}
      {data.status === LOADING.ERROR && <Error message={data.error} />}
      {console.log('Loaded', data)}
    </>
  )
}

export default HandleResponse
