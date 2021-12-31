import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, Button } from 'antd'
import { MENU_ITEMS } from '../constants'
import i18n from './Lang/i18n'
import Lang from './Lang/Lang'


const Unauthorized = () => {
  const navigate = useNavigate()

  return (
    <div className='full-height alert-container'>
      <Alert 
        message={<Lang text={i18n.ERROR.UNAUTHORIZED} />}
        type="error"
        showIcon
        action={
          <Button size="small" danger onClick={() => navigate(`/${MENU_ITEMS.LOGIN}`)}>
            <Lang text={i18n.AUTH.LOGIN_BUTTON} />
          </Button>
        }
      />
    </div>
  )
}

export default Unauthorized