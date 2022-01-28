/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Skeleton, Empty } from 'antd'
import { observer } from 'mobx-react-lite'
import { stepsListStore as store } from './StepsListStore'
import i18n from '../../../components/Lang/i18n'
import Lang from '../../../components/Lang/Lang'

const IMAGE_STYLE = {
  width: 300,
  height: 300,
}

const StepImage = observer(({ imageName }) => {
  const [imageUrl, setImageUrl] = useState()
  const [imageLoaded, setImageLoaded] = useState(false)

  const loadImage = useCallback(async () => {
    try {
      const url = await store.loadStepImageURL(imageName)
      setImageUrl(url)
    } catch(err) {
      console.log(err)
    }
  }, [imageName])
  
  const onImageLoad = () => {
    setImageLoaded(true)
  }

  useEffect(() => {
    if (imageName && !imageLoaded) {
      loadImage()
    }
  }, [imageName, loadImage])

  const loaded = useMemo(() => (imageUrl && imageLoaded),
    [imageUrl, imageLoaded])

  return (
    <div
      className="step-image"
      style={imageName ? IMAGE_STYLE : null}
    >
      <img
        src={imageUrl}
        onLoad={onImageLoad}
        className={loaded ? 'loaded-image' : 'unloaded-image'}
        alt={imageName}
        style={{
          maxWidth: IMAGE_STYLE.width,
          maxHeight: IMAGE_STYLE.height,
          width: 'auto',
          height: 'auto',
        }}
      />
      {imageName && !loaded &&
        <Skeleton.Image 
          className="loaded-image"
          style={IMAGE_STYLE}
        />
      }
      {!imageName &&
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<Lang text={i18n.STEPS_LIST.NO_IMAGE} />}
        />
      }
    </div>
  )
})

export default StepImage
