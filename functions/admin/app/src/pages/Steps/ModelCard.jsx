/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Skeleton  } from 'antd'
import { observer } from 'mobx-react-lite'
import { createStepStore as store } from './CreateStepStore'
import { dateFormat, timeFormat } from '../../utils/date'

export const MODEL_CARD_SIZE = {
  BIG: 'big',
  SMALL: 'small',
}

export const ModelCard = observer(({ modelId, size, onSelect, selected }) => {
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

  const loaded = useMemo(() => (model && imageUrl && imageLoaded),
    [model, imageUrl, imageLoaded])

  const imageClass = useMemo(() => {
    const loadedClass = loaded ? 'loaded-image' : 'unloaded-image'
    const selectedClass = selected ? 'selected-image' : ''

    return `${loadedClass} ${selectedClass}`
  }, [loaded, selected])

  const onClick = useCallback(() => {
    if (!loaded) return

    onSelect(modelId)
  }, [loaded, modelId, onSelect])

  return (
    <>
      {size === MODEL_CARD_SIZE.BIG &&
        <BigCard
          model={model}
          imageUrl={imageUrl}
          loaded={loaded}
          onImageLoad={onImageLoad}
          onClick={onClick}
          selected={selected}
          imageClass={imageClass}
        />
      }
      {size === MODEL_CARD_SIZE.SMALL &&
        <SmallCard
          model={model}
          imageUrl={imageUrl}
          loaded={loaded}
          onImageLoad={onImageLoad}
          onClick={onClick}
          selected={selected}
          imageClass={imageClass}
        />
      }
    </>
  )
})

const BigCard = ({ 
  model,
  imageUrl,
  loaded,
  onImageLoad,
  onClick,
  selected,
  imageClass,
}) => (
  <div
    className={`models-card shadow ${selected ? 'selected-card' : ''}`}
    onClick={onClick}
  >
    <img
      src={imageUrl}
      onLoad={onImageLoad}
      className={imageClass}
      alt={model?.modelId}
    />
    {!loaded &&
      <Skeleton.Image 
        className="loaded-image"
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

const SmallCard = ({
  model,
  imageUrl,
  loaded,
  onImageLoad,
  onClick,
  selected,
  imageClass,
}) => (
  <div
    className={`models-card shadow ${selected ? 'selected-card' : ''}`}
    onClick={onClick}
  >
    <img
      src={imageUrl}
      onLoad={onImageLoad}
      className={imageClass}
      alt={model?.modelId}
    />
    {!loaded &&
      <Skeleton.Image 
        className="loaded-image"
      />
    }
  </div>
)
