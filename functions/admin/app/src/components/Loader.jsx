import React from 'react'
import { Spin } from 'antd'

const Loader = () => (
  <div className='full-height alert-container'>
    <Spin size="large" />
  </div>
)

export default Loader