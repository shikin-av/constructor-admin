import React, { useState, useEffect, useCallback } from 'react'
import { storage, ref, getDownloadURL } from '../firebase'
import { Skeleton, Image } from 'antd'

const ModelCard = ({ userId, modelId }) => {
  const [imageUrl, setImageUrl] = useState()

  const loadImage = useCallback(async () => {
    try {
      const url = await getDownloadURL(ref(storage, `${userId}/${modelId}.png`))
      setImageUrl(url)
    } catch(err) {
      console.log(err)
    }
  }, [userId, modelId])

  useEffect(() => {
    if (!imageUrl) {
      loadImage()
    }
  }, [imageUrl])

  return (
    <>{imageUrl && <Image src={imageUrl} width={300} />}</>
  )
}

export default ModelCard
