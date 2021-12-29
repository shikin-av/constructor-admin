import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as firebase from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { Form, Input, Button, Alert, Row, Col, Typography } from 'antd'
import FIREBASE_CONFIG from '../firebaseConfig'
import Layout from '../components/Layout'
import i18n from '../i18n'
const { Title } = Typography

const auth = getAuth(firebase.initializeApp(FIREBASE_CONFIG))

const Login = () => {
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  const handleSubmit = async ({ email, password }) => {
    try {
      setError(null)
      const userCredential =  await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user    
      const token = await user.getIdToken(true)
      localStorage.setItem('token', `Bearer ${token}`)
      navigate('/')
    } catch (err) {
      console.log(err)
      setError(JSON.stringify(err))
    }
  }

  return (
    <Layout>
      <Row align="middle" className="full-height">
        <Col span={8}></Col>
        <Col span={8}>
          <Title style={{ textAlign: "center" }}>{i18n.AUTH.TITLE}</Title>
          <Form
            onFinish={handleSubmit}
            autoComplete="on"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ flex: 1 }}
          >
            <Form.Item 
              name="email" 
              label={i18n.AUTH.EMAIL_INPUT}
              rules={[{ required: true, message: i18n.AUTH.EMAIL_PLACEHOLDER }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="password"
              label={i18n.AUTH.PASSWORD_INPUT}           
              rules={[{ required: true, message: i18n.AUTH.PASSWORD_PLACEHOLDER }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                {i18n.AUTH.LOGIN_BUTTON}
              </Button>
            </Form.Item>
          </Form>
          {error && <Alert message={error} type="error" />}
        </Col>
        <Col span={8}></Col>
      </Row>
    </Layout>
  )
}

export default Login
