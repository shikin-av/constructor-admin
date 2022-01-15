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

  const titlesHeader = useMemo(() => {
    const titleName = i18n.EDIT_STEP.FORM.TITLE[lang]
    const allCount = Object.values(store.titles).length
    const fillCount = Object.values(store.titles).filter(KEY => !!KEY).length

    return `${titleName} [ ${fillCount} / ${allCount} ]`
  }, [store.titles])

  const descriptionsHeader = useMemo(() => {
    const titleName = i18n.EDIT_STEP.FORM.DESCRIPTION[lang]
    const allCount = Object.values(store.descriptions).length
    const fillCount = Object.values(store.descriptions).filter(KEY => !!KEY).length

    return `${titleName} [ ${fillCount} / ${allCount} ]`
  }, [store.descriptions])

  return (
    <Collapse accordion>
      <Panel header={titlesHeader} key="titles">
        {Object.keys(EMPTY_LANG_INPUTS).map(KEY =>(
          <div className="inline-input" key={KEY}>
            <span className="inline-label">{KEY}</span>
            <Input
              value={store.titles[KEY]}
              onChange={(e) => store.setTitles(e.target.value, KEY)}
            />
          </div>
        ))}        
      </Panel>
      <Panel header={descriptionsHeader} key="descriptions">
        {Object.keys(EMPTY_LANG_INPUTS).map(KEY =>(
          <div className="inline-input" key={KEY}>
            <span className="inline-label">{KEY}</span>
            <Input
              value={store.descriptions[KEY]}
              onChange={(e) => store.setDescriptions(e.target.value, KEY)}
            />          
          </div>
        ))} 
      </Panel>
    </Collapse>
  )
})

export default DescriptionsBlock
