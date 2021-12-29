import React from 'react'
import { Alert } from 'antd'

const Error = ({ message }) => (
  <div className='full-height alert-container'>
    <Alert 
      message={message}
      type="error"
      showIcon
    />
  </div>
)

export default Error