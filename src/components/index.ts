import type { App } from 'vue'
import { Icon } from './Icon'
import { SmTable } from './SmTable'
import { SmForm } from './SmForm'
import { SmUpload } from './SmUpload'

export const setupGlobCom = (app: App<Element>): void => {
  app.component('Icon', Icon)
  app.component('SmTable', SmTable)
  app.component('SmForm', SmForm)
  app.component('SmUpload', SmUpload)
}
