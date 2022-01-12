import React from 'react'
import { Spin } from 'antd'

const Loader = () => (
  <div className="full-center alert-container">
    <Spin size="large" />
  </div>
)

export default Loader