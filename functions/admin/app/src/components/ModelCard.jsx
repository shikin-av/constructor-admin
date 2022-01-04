import React, { useState, useEffect, useCallback } from 'react'
import { Skeleton  } from 'antd'
import { observer } from 'mobx-react-lite'
import { createStepStore as store } from '../pages/Steps/CreateStepStore'
import { dateFormat, timeFormat } from '../utils/date'

const ModelCard = observer(({ modelId }) => {
  const [model, setModel] = useState()
  const [imageUrl, setImageUrl] = useState()
  const [imageLoaded, setImageLoaded] = useState(false)

  const loadImage = useCallback(async () => {
    try {
      const url = await store.loadModelImage(model.userId, modelId)
      setImageUrl(url)
    } catch(err) {
      console.log(err)
    }
  }, [model, modelId])

  const onImageLoad = () => {
    setImageLoaded(true)
  }

  useEffect(() => {
    const m = store.getModelById(modelId)
    setModel({
      ...m,
      formattedDate: `${dateFormat(m.date)}  |  ${timeFormat(m.date)}`
    })
  }, [modelId])

  useEffect(() => {
    if (model && !imageUrl) {
      loadImage()
    }
  }, [imageUrl, model, loadImage])

  const loaded = model && imageUrl && imageLoaded

  return (
    <div className="models-card shadow">
      <img
        src={imageUrl}
        onLoad={onImageLoad}
        className={loaded ? 'loaded-image' : 'unloaded-image'}
        alt={modelId}
      />
      {
        !loaded &&
        <Skeleton.Image 
          className="loaded-image"
        />
      }
      {
        loaded
        ? <div className="models-card-description">
            <p>{model.formattedDate}</p>
            <p>{modelId}</p>
            <p>{model.userId}</p>
          </div>
        : <>
            <Skeleton paragraph={{ rows: 2 }} />
          </>
      }
    </div>
  )
})

export default ModelCard
