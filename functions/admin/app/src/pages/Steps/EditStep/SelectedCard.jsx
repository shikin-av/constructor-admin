/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Skeleton } from 'antd'
import { LeftSquareFilled, RightSquareFilled, CloseSquareFilled } from '@ant-design/icons'
import { observer } from 'mobx-react-lite'
import { editStepStore as store } from './EditStepStore'

const IMAGE_STYLE = {
  width: 150,
  height: 150,
}

const SelectedCard = observer(({ modelId }) => {
  const [model, setModel] = useState()
  const [imageUrl, setImageUrl] = useState()
  const [imageLoaded, setImageLoaded] = useState(false)

  const loadImage = useCallback(async () => {
    try {
      const url = await store.loadModelImageURL(model.userId, modelId)
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
    setModel({ ...m })
  }, [modelId])

  useEffect(() => {
    if (model && !imageUrl) {
      loadImage()
    }
  }, [imageUrl, model, loadImage])

  const loaded = useMemo(() => (model && imageUrl && imageLoaded),
    [model, imageUrl, imageLoaded])

  return (
    <div
      className="step-models-card"
      style={IMAGE_STYLE}
    >
      <img
        src={imageUrl}
        onLoad={onImageLoad}
        className={loaded ? 'loaded-image' : 'unloaded-image'}
        alt={model?.modelId}
        style={IMAGE_STYLE}
      />
      {loaded &&
        <div className="step-models-card-panel">
          <div className="step-models-card-arrows">
            {!store.isFirstSelected(modelId) &&
              <LeftSquareFilled onClick={() => store.selectedToLeft(modelId)} />
            }
            {!store.isLastSelected(modelId) &&
              <RightSquareFilled onClick={() => store.selectedToRight(modelId)} />
            }
          </div>

          <div className="step-models-card-close" >
            <CloseSquareFilled
              onClick={() => store.unselectModel(modelId)}
              style={{ color: '#ff4d4f' }}
            />
          </div>
        </div>
      }
      {!loaded &&
        <Skeleton.Image 
          className="loaded-image"
          style={IMAGE_STYLE}
        />
      }
    </div>
  )
})

export default SelectedCard
