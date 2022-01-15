import React, { useMemo, useContext } from 'react'
import { Input, Collapse  } from 'antd'
import { observer } from 'mobx-react-lite'
import { editStepStore as store } from './EditStepStore'
import i18n from '../../../components/Lang/i18n'
import { LangContext } from '../../../components/Lang/LangContext'
import { EMPTY_LANG_INPUTS } from '../../../constants'
const { Panel } = Collapse

const DescriptionsBlock =  observer(() => {
  const [lang] = useContext(LangContext)

  const titleHeader = useMemo(() => {
    const title = i18n.EDIT_STEP.FORM.TITLE[lang]
    const allCount = Object.values(store.title).length
    const fillCount = Object.values(store.title).filter(KEY => !!KEY).length

    return `${title} [ ${fillCount} / ${allCount} ]`
  }, [store.title])

  const descriptionHeader = useMemo(() => {
    const description = i18n.EDIT_STEP.FORM.DESCRIPTION[lang]
    const allCount = Object.values(store.description).length
    const fillCount = Object.values(store.description).filter(KEY => !!KEY).length

    return `${description} [ ${fillCount} / ${allCount} ]`
  }, [store.description])

  return (
    <Collapse accordion>
      <Panel header={titleHeader} key="title">
        {Object.keys(EMPTY_LANG_INPUTS).map(KEY =>(
          <div className="inline-input" key={KEY}>
            <span className="inline-label">{KEY}</span>
            <Input
              value={store.title[KEY]}
              onChange={(e) => store.setTitle(e.target.value, KEY)}
            />
          </div>
        ))}        
      </Panel>
      <Panel header={descriptionHeader} key="description">
        {Object.keys(EMPTY_LANG_INPUTS).map(KEY =>(
          <div className="inline-input" key={KEY}>
            <span className="inline-label">{KEY}</span>
            <Input
              value={store.description[KEY]}
              onChange={(e) => store.setDescription(e.target.value, KEY)}
            />          
          </div>
        ))} 
      </Panel>
    </Collapse>
  )
})

export default DescriptionsBlock
