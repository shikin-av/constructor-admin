import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Alert, Row, Col, Typography, Select } from 'antd'
import { auth, signInWithEmailAndPassword } from '../firebase'
import Layout from '../components/Layout'
import i18n, { LANG } from '../components/Lang/i18n'
import { LangContext } from  '../components/Lang/LangContext'
import Lang from '../components/Lang/Lang'
const { Title } = Typography
const { Option } = Select


const Login = () => {
  const navigate = useNavigate()
  const [lang, setLang] = useContext(LangContext)
  const [error, setError] = useState(null)

  const handleSubmit = async ({ email, password, lang }) => {
    try {
      setError(null)
      const userCredential =  await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user    
      const token = await user.getIdToken(true)

      localStorage.setItem('token', `Bearer ${token}`)
      localStorage.setItem('lang', lang)

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
          <Title style={{ textAlign: "center" }}>
            <Lang text={i18n.AUTH.TITLE} />
          </Title>
          <Form
            onFinish={handleSubmit}
            autoComplete="on"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ flex: 1 }}
            initialValues={{ lang }}
          >
            <Form.Item 
              name="email" 
              label={<Lang text={i18n.AUTH.EMAIL_INPUT} />}
              rules={[{ 
                required: true, 
                message: <Lang text={i18n.AUTH.EMAIL_PLACEHOLDER} /> 
              }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="password"
              label={<Lang text={i18n.AUTH.PASSWORD_INPUT} />}
              rules={[{ 
                required: true, 
                message: <Lang text={i18n.AUTH.PASSWORD_PLACEHOLDER} />
              }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="lang"
              label={<Lang text={i18n.AUTH.LANGUAGE_SELECT} />}
              rules={[{
                required: true,
                message: <Lang text={i18n.AUTH.LANGUAGE_SELECT_PLACEHOLDER} />
              }]}
            >
              <Select onChange={setLang}>
                <Option value={LANG.ENG}>English</Option>
                <Option value={LANG.RUS}>Русский</Option>
              </Select>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                <Lang text={i18n.AUTH.LOGIN_BUTTON} />
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
