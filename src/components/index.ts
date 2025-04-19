import type { App } from 'vue'
import { Icon } from './Icon'
import { SmTable } from './SmTable'
import { SmForm } from './SmForm'
import { SmUpload } from './SmUpload'
import { ElTreeSelect } from 'element-plus'
import { SmRemoteSelect } from './SmRemoteSelect'
import { SmRadioGroup } from './SmRadioGroup'
import { SmSelect } from './SmSelect'
import { SmRange } from './SmRange'
import { SmTableField } from './SmTableField'
import { SmNumber } from './SmNumber'

export const setupGlobCom = (app: App<Element>): void => {
  const componentsMap = {
    Icon: Icon,
    SmTable: SmTable,
    SmForm: SmForm,
    SmUpload: SmUpload,
    ElTreeSelect: ElTreeSelect,
    SmRemoteSelect: SmRemoteSelect,
    SmRadioGroup: SmRadioGroup,
    SmSelect: SmSelect,
    SmRange: SmRange,
    SmTableField: SmTableField,
    SmNumber: SmNumber
  }
  for (const key in componentsMap) {
    app.component(key, componentsMap[key])
  }
  // app.component('SmTableField', SmTableField)
}
