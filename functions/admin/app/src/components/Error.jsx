import React from 'react'
import { Alert } from 'antd'

const Error = ({ message }) => (
  <div className="full-center alert-container">
    <Alert 
      message={message}
      type="error"
      showIcon
    />
  </div>
)

export default Error