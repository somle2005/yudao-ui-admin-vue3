import { filterObjKey } from '@/utils/transformData'
import { cloneDeep } from 'lodash-es'

interface MainItemBodyDataProp {
  queryParams: any
  mainQueryList: string[]
  itemQueryList: string[]
}

export const getMainItemBodyData = (data: MainItemBodyDataProp) => {
  const { queryParams, mainQueryList, itemQueryList } = data || {}
  const queryData = cloneDeep(queryParams)
  const bodyData: any = {
    mainQuery: {},
    itemQuery: {}
  }
  bodyData.mainQuery = filterObjKey(queryData, mainQueryList)
  bodyData.itemQuery = filterObjKey(queryData, itemQueryList)
  return bodyData
}
