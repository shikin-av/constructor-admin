/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { Divider } from 'antd'
import { observer } from 'mobx-react-lite'
import { createStepStore as store } from './CreateStepStore'
import i18n from '../../../components/Lang/i18n'
import Lang from '../../../components/Lang/Lang'
import { ModelCard, MODEL_CARD_SIZE as SIZE } from './ModelCard'

const StepBlock =  observer(() => {
  return (
    <div className="step-block shadow">
      <div>
        <Divider>
          <Lang text={i18n.CREATE_STEP.STEP_BLOCK_TITLE} />
        </Divider>
      </div>
      <div className="step-block-models">
        {store.selectedModels.map(model => {
          const { modelId } = model
          return (
            <ModelCard
              modelId={modelId}
              key={modelId}
              size={SIZE.SMALL}
              onSelect={() => {}}
              selected={false}
            />
          )
        })}
      </div>
    </div>
  )
})

export default StepBlock
