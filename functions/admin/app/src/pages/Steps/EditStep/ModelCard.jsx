/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Skeleton  } from 'antd'
import { observer } from 'mobx-react-lite'
import { editStepStore as store } from './EditStepStore'
import { dateFormat, timeFormat } from '../../../utils/date'
import { LOADING } from '../../../constants'

const IMAGE_STYLE = {
  width: 341,
  height: 341,
}

const ModelCard = observer(({ modelId, selected }) => {
  const [model, setModel] = useState()
  const [imageUrl, setImageUrl] = useState()
  const [imageLoaded, setImageLoaded] = useState(false)

  const loadImage = useCallback(async () => {
    try {
      const url = await store.loadModelImageURL(model)
      setImageUrl(url)
    } catch(err) {
      console.log(err)
    }
  }, [model])

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

  const loaded = useMemo(() => (model && imageUrl && imageLoaded),
    [model, imageUrl, imageLoaded])

  const divClass = useMemo(() => {
    const loadedClass = loaded ? 'cursor-pointer' : ''
    const selectedClass = selected ? 'selected-big-card' : ''

    return `models-card shadow ${loadedClass} ${selectedClass}`
  }, [loaded, selected])

  const imageClass = useMemo(() => {
    const loadedClass = loaded ? 'loaded-image' : 'unloaded-image'
    const selectedClass = selected ? 'selected-big-card-image' : ''

    return `${loadedClass} ${selectedClass}`
  }, [loaded, selected])

  const onClick = useCallback(() => {
    if (!loaded || store.saveLoading === LOADING.PROGRESS) return

    store.switchSelectModel(modelId)
  }, [loaded, modelId])

  return (
    <div
      className={divClass}
      onClick={onClick}
    >
      <img
        src={imageUrl}
        onLoad={onImageLoad}
        className={imageClass}
        alt={model?.modelId}
        style={IMAGE_STYLE}
      />
      {!loaded &&
        <Skeleton.Image 
          className="loaded-image"
          style={IMAGE_STYLE}
        />
      }
      {loaded
        ? <div className="models-card-description">
            <p>{model?.formattedDate}</p>
            <p>{model?.modelId}</p>
            <p>{model?.userId}</p>
          </div>
        : <Skeleton paragraph={{ rows: 2 }} />
      }
    </div>
  )
})

export default ModelCard
