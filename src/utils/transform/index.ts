import { filterObjKey } from '@/utils/transformData'
import { cloneDeep } from 'lodash-es'

interface MainItemBodyDataProp {
  queryParams: any
  mainQueryList: string[]
  itemQueryList: string[]
}

interface MainItemBodyProp {
  name: string
  fieldList: string[]
}

interface MainItemBodyDataFieldProp {
  queryParams: any
  configList: MainItemBodyProp[]
}

// export const getMainItemBodyData = (data: MainItemBodyDataProp) => {
//   try {
//     const { queryParams, mainQueryList, itemQueryList } = data || {}
//     const queryData = cloneDeep(queryParams)
//     const bodyData: any = {
//       mainQuery: {},
//       itemQuery: {}
//     }
//     bodyData.mainQuery = filterObjKey(queryData, mainQueryList)
//     bodyData.itemQuery = filterObjKey(queryData, itemQueryList)
//     bodyData.pageNo = queryData.pageNo
//     bodyData.pageSize = queryData.pageSize
//     return bodyData
//   } catch (e) {
//     console.log(e, '报错')
//   }
// }

export const getMainItemBodyDataField = (data: MainItemBodyDataFieldProp) => {
  try {
    const { queryParams, configList = [] } = data || {}
    const queryData = cloneDeep(queryParams)
    let bodyData: any = {}
    // 主单查询-主表添加后-删除-子表中不出现
    const mainIndex = configList.findIndex((item) => item.name === 'main')
    if (mainIndex !== -1) {
      const { fieldList } = configList[mainIndex]
      bodyData = filterObjKey(queryData, fieldList)
      configList.splice(mainIndex, 1)
    }

    configList.forEach((item) => {
      bodyData[item.name] = {}
      bodyData[item.name] = filterObjKey(queryData, item.fieldList)
    })
    bodyData.pageNo = queryData.pageNo
    bodyData.pageSize = queryData.pageSize
    return bodyData
  } catch (e) {
    console.log(e, '报错')
  }
}
