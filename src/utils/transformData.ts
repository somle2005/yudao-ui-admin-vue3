import { cloneDeep } from 'lodash-es'
import { erpPriceMultiply } from '@/utils'

/**
 *
 * @param list
 * @param keyId 防止items和外部项id冲突 起别名
 * 提取list中的items合并当前list项 展示每一项的items 合并进行数组
 */
export const mergeItemsToList = (list: any[], mapKey = {}) => {
  if (!list?.length) return []
  const arr: any = []
  cloneDeep(list).forEach((item: any) => {
    if (item.items?.length) {
      item.items.forEach((obj) => {
        const newItem = {
          ...obj,
          ...item // 会覆盖前面的id
        }
        for (const key in mapKey) {
          newItem[mapKey[key]] = obj[key]
        }
        arr.push(newItem)
      })
    } else {
      arr.push(item)
    }
  })
  // arr.forEach((item: any) => {
  //   item.items = undefined
  // })
  return arr
}

/**
 *
 * @param list
 * @param mapKey 用来弥补itemsQty 合并计算 映射和内容不items-qty冲突问题
 * 提取list中的items合并当前list项 展示每一项的items 合并进行数组- 小驼峰形式拼接字段
 */
export const mergeItemsUpToList = (list: any[], itemKey = 'items', mapKey = {}) => {
  if (!list?.length) return []
  const arr: any = []
  cloneDeep(list).forEach((item: any) => {
    if (item[itemKey]?.length) {
      item[itemKey].forEach((obj) => {
        const newItem = {
          ...item
        }
        for (const key in obj) {
          // key首字母大写
          newItem[itemKey + key[0].toUpperCase() + key.slice(1)] = obj[key]
        }
        for (const key in mapKey) {
          newItem[mapKey[key]] = obj[key]
        }
        arr.push(newItem)
      })
    } else {
      arr.push(item)
    }
  })
  return arr
}

/**
 *
 * @param formData 表单数据
 * @param mapKeys 需要判空转化为空数组的属性
 * 处理后端null值需要转化为空数组的属性
 */
export const nullToList = (formData: any, mapKeys: string[]) => {
  mapKeys.forEach((key) => {
    if (formData.value[key] == null) {
      formData.value[key] = []
    }
  })
  return formData
}

// 数组去重
export const distinctList = (sourceList: any[], selectList: any[], compareKey = 'id') => {
  const list = cloneDeep(sourceList)
  try {
    const map = {}
    list.forEach((item) => {
      map[item[compareKey]] = 1
    })
    selectList.forEach((item) => {
      if (!map[item[compareKey]]) {
        list.push(item)
      }
    })
  } catch (e) {
    console.log('报错了', e)
  }
  return list
}

// 获取相同项SameKeyItem
export const getSameKeyItemList = (list, sameKey = 'id') => {
  if (!list?.length) return list
  const baseId = list[0][sameKey]
  return list.filter((item) => item[sameKey] === baseId)
}

/**
 * 计算税额和价税合计
 * @param list
 * @param keyMap 申请数量applyCount 税率taxPercent 含税单价actTaxPrice   价税合计allAmount 税额taxPrice productPrice产品单价
 * @returns
 */

export const computeTaxPriceAndAllAmount = (
  list: any[],
  keyMap?: {
    taxPercent?: string
    applyCount?: string
    actTaxPrice?: string
    allAmount?: string
    taxPrice?: string
    onePrice?: string
    totalPrice?: string
  }
) => {
  if (!list?.length) return list
  const {
    taxPercent = 'taxPercent',
    applyCount = 'qty',
    actTaxPrice = 'actTaxPrice',
    allAmount = 'allAmount',
    taxPrice = 'taxPrice',
    onePrice = 'productPrice',
    totalPrice = 'totalPrice'
  } = keyMap || {}

  list.forEach((item) => {
    // 申请数量和税率都要有 才能计算出税额
    if (item[taxPercent] && item[applyCount] && item[actTaxPrice]) {
      const taxPercent100 = item.taxPercent / 100.0
      // 税额 = 含税单价 * (税率/(1+税率)) * 申请数量
      const scale = (taxPercent100 / (1 + taxPercent100)) * item[applyCount]
      item[taxPrice] = erpPriceMultiply(item[actTaxPrice], scale)
      // 价税合计 = 含税单价 * 申请数量。
      item[allAmount] = erpPriceMultiply(item[actTaxPrice], item[applyCount])
    }

    // 税率-含税单价才能计算出产品单价
    if (item[taxPercent] && item[actTaxPrice]) {
      const taxPercent100 = item.taxPercent / 100.0
      // 单价
      item[onePrice] = erpPriceMultiply(item[actTaxPrice], 1 / (1 + taxPercent100))
    } else {
      // 税率-含税单价 其中一个没有单价变为空
      item[onePrice] = undefined
    }
  })

  // totalPrice 总价 = 含税单价 * 数量
  list.forEach((item) => {
    item[totalPrice] = erpPriceMultiply(item[actTaxPrice], item[applyCount])
  })
}

// 计算优惠金额和优惠后金额totalPrice
export const computeDiscountPriceAndTotalPrice = (
  formRef: any,
  formData: any,
  keyMap?: {
    totalPriceStr?: string
    discountPriceStr?: string
    discountPercentStr?: string
    otherPriceStr?: string // 采购入库
  }
) => {
  const {
    totalPriceStr = 'totalPrice',
    discountPriceStr = 'discountPrice',
    discountPercentStr = 'discountPercent',
    otherPriceStr = 'otherPrice'
  } = keyMap || {}

  const updateVal = () => {
    nextTick(() => {
      const formValue = formRef.value.getFormData()
      formValue[discountPriceStr] = formData[discountPriceStr]
      formValue[totalPriceStr] = formData[totalPriceStr]
    })
  }

  const discountPercent = formData[discountPercentStr] ? formData[discountPercentStr] : 0
  const totalPrice = formData.items.reduce((prev, curr) => prev + curr[totalPriceStr], 0)
  const discountPrice = erpPriceMultiply(totalPrice, discountPercent / 100.0) || 0
  formData[discountPriceStr] = discountPrice
  // 优惠后金额
  formData.totalPrice = totalPrice - discountPrice + (formData[otherPriceStr] || 0)
  updateVal()
}

export const resetQueryParams = (queryParams: { [key: string]: any }, queryFormRef: any) => {
  for (const key in queryParams) {
    queryParams[key] = undefined
  }
  queryParams.pageNo = 1
  queryParams.pageSize = 10
  if (queryFormRef.value) {
    queryFormRef.value.resetFields()
  }
}

export const filterObjKey = (queryParams: { [key: string]: any }, saveObjkeyList: string[]) => {
  try {
    const map = {}
    saveObjkeyList.forEach((key) => {
      map[key] = queryParams[key]
    })
    return map
  } catch (e) {
    console.log(e, '报错了')
  }
}

export const listToJson = (list: any[], jsonList: string[]) => {
  list.forEach((item) => {
    jsonList.forEach((key) => {
      if (item[key]) {
        item[key] = JSON.stringify(item[key])
      }
    })
  })
  return list
}

export const jsonToList = (list: any[], jsonList: string[]) => {
  list.forEach((item) => {
    jsonList.forEach((key) => {
      if (item[key]) {
        item[key] = JSON.parse(item[key])
      } else {
        item[key] = []
      }
    })
  })
  return list
}

export const reduceVal = (computeKey: string, list: any[]) => {
  if (!list?.length || !Array.isArray(list)) return null
  return list.reduce((prev, cur) => prev + cur[computeKey], 0)
}

interface MapListObj {
  targetKey: string
  computeKey: string
  listKey: string
}

export const computeList = (mapList: Array<MapListObj>, list: any[]) => {
  if (!list?.length || !Array.isArray(list)) return list
  try {
    list.forEach((item) => {
      mapList.forEach((sourceMap) => {
        const { targetKey, computeKey, listKey } = sourceMap
        if (!item[listKey]?.length) return
        item[targetKey] = reduceVal(computeKey, item[listKey])
      })
    })
    return list
  } catch (e) {
    console.log(e, '报错')
  }
}

export const getLastListProp = (list: any[], prop: string) => {
  if (!list?.length) return
  try {
    return list[list.length - 1][prop]
  } catch (e) {
    console.log(e, '报错')
  }
}

export const computeTargetQty = (list: any[], mapKey?: { [key: string]: any }) => {
  const {
    targetQtyKey = 'pickQty',
    computeQtyKey = 'planQty',
    computeKey = 'productId'
  } = mapKey || {}
  const map = {}
  list.forEach((item) => {
    if (!map[item[computeKey]]) {
      map[item[computeKey]] = item[computeQtyKey]
    } else {
      map[item[computeKey]] += item[computeQtyKey] || 0
    }
  })
  list.forEach((item) => {
    item[targetQtyKey] = map[item[computeKey]]
  })
}
