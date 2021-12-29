import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, Button } from 'antd'
import { MENU_ITEMS } from '../constants'


const Unauthorized = () => {
  const navigate = useNavigate()

  return (
    <div className='full-height alert-container'>
      <Alert 
        message="You don't have enough rights" 
        type="error"
        showIcon
        action={
          <Button size="small" danger onClick={() => navigate(`/${MENU_ITEMS.LOGIN}`)}>Login</Button>
        }
      />
    </div>
  )
}

export default Unauthorized