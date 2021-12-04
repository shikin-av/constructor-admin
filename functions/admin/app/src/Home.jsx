import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  const [responce, setResponce] = useState()

  useEffect(() => {
    getServerData()
  }, [])

  const getServerData = async () => {
      const token = localStorage.getItem('token')

      await fetch(`${process.env.REACT_APP_API_URL}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          token,
        },
      })
      .then(async result => {
        if (result.status !== 200) throw 'Unauthorized'

        return await result.json()
      })
      .then(result => {
        // setResponce(result)
        console.log(result)
      })
      .catch(err => {
        // console.log(err)
        navigate('/login')
      })
  }

  return (
    <div>
      <h1>Home</h1>
      <p>{responce}</p>
    </div>
  )
}

export default Home