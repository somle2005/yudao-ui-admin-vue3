import type { App } from 'vue'
import { Icon } from './Icon'
import { SmTable } from './SmTable'

export const setupGlobCom = (app: App<Element>): void => {
  app.component('Icon', Icon)
  app.component('SmTable', SmTable)
}
