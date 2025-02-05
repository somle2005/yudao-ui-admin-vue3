import { cloneDeep } from 'lodash-es'

/**
 *
 * @param list
 * @param keyId 防止items和外部项id冲突 起别名
 * 提取list中的items合并当前list项 展示每一项的items 合并进行数组
 */
export const mergeItemsToList = (list: any[], keyId = 'purchaseOrderId') => {
  if (!list?.length) return []
  const arr: any = []
  cloneDeep(list).forEach((item: any) => {
    if (item.items?.length) {
      item.items.forEach((obj: any) => {
        arr.push({
          ...obj,
          [keyId]: obj.id,
          ...item // 会覆盖前面的id
        })
      })
    } else {
      arr.push(item)
    }
  })
  arr.forEach((item: any) => {
    item.items = undefined
  })
  return arr
}


