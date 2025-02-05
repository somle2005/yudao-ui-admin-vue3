import { cloneDeep } from 'vue-json-pretty/types/utils'

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

const testData =   [
  {
    "id": 32561,
    "no": "string",
    "applicant": "string",
    "applicantName": "芋道",
    "applicationDept": "string",
    "requestTime": "2019-08-24T14:15:22.123Z",
    "status": 2,
    "offStatus": 1,
    "orderStatus": 1,
    "auditor": "string",
    "auditTime": "2019-08-24T14:15:22.123Z",
    "creator": "制单人就是创建人",
    "createTime": "2019-08-24T14:15:22.123Z",
    "items": [
      {
        "id": 11756,
        "warehouseId": 3113,
        "productId": 3113,
        "productPrice": 100,
        "count": 100,
        "remark": "随便"
      },
      {
        "id": 117561,
        "warehouseId": 31131,
        "productId": 31131,
        "productPrice": 1001,
        "count": 1001,
        "remark": "随便1"
      }
    ],
    "productNames": "string",
    "totalCount": 100
  }
]


mergeItemsToList(testData)


