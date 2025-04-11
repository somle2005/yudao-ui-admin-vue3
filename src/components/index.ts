import type { App } from 'vue'
import { Icon } from './Icon'
import { SmTable } from './SmTable'
import { SmForm } from './SmForm'
import { SmUpload } from './SmUpload'
// import {ElDatePicker} from 'element-plus'
import { ElTreeSelect } from 'element-plus'
import { SmRemoteSelect } from './SmRemoteSelect'
import { SmRadioGroup } from './SmRadioGroup'
import { SmSelect } from './SmSelect'
import { SmRange } from './SmRange'
import { SmTableField } from './SmTableField'

export const setupGlobCom = (app: App<Element>): void => {
  app.component('Icon', Icon)
  app.component('SmTable', SmTable)
  app.component('SmForm', SmForm)
  app.component('SmUpload', SmUpload)
  app.component('ElTreeSelect', ElTreeSelect)
  app.component('SmRemoteSelect', SmRemoteSelect)
  app.component('SmRadioGroup', SmRadioGroup)
  app.component('SmSelect', SmSelect)
  app.component('SmRange', SmRange)
  app.component('SmTableField', SmTableField)
  // app.component('ElDatePicker', ElDatePicker)
}
