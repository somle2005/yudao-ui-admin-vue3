import { cloneDeep } from 'lodash-es'

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
