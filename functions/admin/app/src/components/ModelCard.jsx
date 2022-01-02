import React, { useState, useEffect, useCallback, createRef } from 'react'
import { storage, ref, getDownloadURL } from '../firebase'
import { Skeleton  } from 'antd'
import { dateFormat, timeFormat } from '../utils/date'

const ModelCard = ({ model }) => {
  const { date, modelId, userId } = model
  const formattedDate = `${dateFormat(date)}  |  ${timeFormat(date)}`
  const [imageUrl, setImageUrl] = useState()
  const [imageLoaded, setImageLoaded] = useState(false)

  const loadImage = useCallback(async () => {
    try {
      const url = await getDownloadURL(ref(storage, `${userId}/${modelId}.png`))
      setImageUrl(url)
    } catch(err) {
      console.log(err)
    }
  }, [userId, modelId])

  const onImageLoad = () => {
    setImageLoaded(true)
  }

  useEffect(() => {
    if (!imageUrl) {
      loadImage()
    }
  }, [imageUrl])

  const loaded = imageUrl && imageLoaded

  return (
    <div className="models-card shadow">
      <img
        src={imageUrl}
        onLoad={onImageLoad}
        className={loaded ? 'loaded-image' : 'unloaded-image'}
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
            <p>{formattedDate}</p>
            <p>{modelId}</p>
            <p>{userId}</p>
          </div>
        : <>
            <Skeleton paragraph={{ rows: 2 }} />
          </>
      }
    </div>
  )
}

export default ModelCard
