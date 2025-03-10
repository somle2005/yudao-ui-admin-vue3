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
export const distinctList = (list: any[], selectList: any[], compareKey = 'id') => {
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

/**
 * 计算税额和价税合计
 * @param list
 * @param keyMap 申请数量applyCount 税率taxPercent 含税单价actTaxPrice   价税合计allAmount 税额taxPrice
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
  }
) => {
  if (!list?.length) return list
  const {
    taxPercent = 'taxPercent',
    applyCount = 'count',
    actTaxPrice = 'actTaxPrice',
    allAmount = 'allAmount',
    taxPrice = 'taxPrice'
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
  })
}
