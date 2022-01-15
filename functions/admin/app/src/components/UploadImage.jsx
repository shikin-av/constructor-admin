import React, { useState } from 'react'
import { Upload, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import i18n from './Lang/i18n'
import Lang from './Lang/Lang'

const UploadImage = ({ chooseImage, removeImage }) => {
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

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={imageList}
        onPreview={handlePreview}
        onChange={({ fileList }) => setImageList(fileList)}
        customRequest={chooseImage}
        onRemove={removeImage}
      >
        {imageList.length === 0 &&
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>
              <Lang text={i18n.EDIT_STEP.FORM.UPLOAD_IMAGE} />
            </div>
          </div>
        }
      </Upload>

      <Modal
        visible={previewVisible}
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
