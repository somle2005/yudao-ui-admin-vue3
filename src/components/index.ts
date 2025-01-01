import type { App } from 'vue'
import { Icon } from './Icon'
import { SmTable } from './SmTable'
import { SmForm } from './SmForm'
import { ElTreeSelect } from 'element-plus'
import { SmUpload } from './SmUpload'

export const setupGlobCom = (app: App<Element>): void => {
  const componentsMap = {
    Icon: Icon,
    ElTreeSelect: ElTreeSelect,
    SmTable: SmTable,
    SmForm: SmForm,
    SmUpload: SmUpload
  }
  for (const key in componentsMap) {
    app.component(key, componentsMap[key])
  }
}
