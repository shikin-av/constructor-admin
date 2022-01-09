import React, { useState } from 'react'
import { Upload, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { storage, ref, uploadBytes, deleteObject } from '../firebase'
import i18n from './Lang/i18n'
import Lang from './Lang/Lang'

const UploadImage = ({ imageName, setImageName }) => {
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [imageList, setImageList] = useState([])

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    setPreviewImage(file.url || file.preview)
    setPreviewVisible(true)
  }

  const uploadImage = async (val) => {
    const storageRef = ref(storage, `published/${val.file.name}`)
    try {
      await uploadBytes(storageRef, val.file)
      val.onSuccess()
      setImageName(val.file.name || val.file.url.substring(val.file.url.lastIndexOf("/") + 1))
    } catch(err) {
      console.error(err)
      val.onError(err)
    }
  }

  const removeImage = async (file) => {
    const storageRef = ref(storage, `published/${file.name}`)
    try {
      deleteObject(storageRef)
      setImageName(null)
    } catch(err) {
      console.error(err)
    }
  }

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={imageList}
        onPreview={handlePreview}
        onChange={({ fileList }) => setImageList(fileList)}
        customRequest={uploadImage}
        onRemove={removeImage}
      >
        {imageList.length === 0 &&
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>
              <Lang text={i18n.CREATE_STEP.FORM.UPLOAD_IMAGE} />
            </div>
          </div>
        }
      </Upload>

      <Modal
        visible={previewVisible}
        title={imageName}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  )
}

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

export default UploadImage
