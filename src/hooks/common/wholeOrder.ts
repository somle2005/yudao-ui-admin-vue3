import { cloneDeep } from 'lodash-es'

export const WHOLE_ORDER_TYPE = {
  items: 'items', // 分行才进行展示 整单不展示
  mergeCompute: 'mergeCompute',
  wholeOrder: 'wholeOrder' // 整单才进行展示
}

export const createWholeOrder = (allOptions) => {
  return allOptions.filter((item) => item.wholeOrderEnable !== WHOLE_ORDER_TYPE.items)
}
export const createBranchOrder = (allOptions) => {
  return allOptions.filter((item) => item.wholeOrderEnable !== WHOLE_ORDER_TYPE.wholeOrder)
}

export const useWholeOrder = (
  allOptions,
  tableOptions,
  selectionList,
  list,
  total,
  itemsList,
  itemsTotal,
  wholeOrderList,
  wholeOrderTotal
) => {
  const handleWholeOrderEnable = (val) => {
    if (val) {
      // 防止大屏宽度没有占满对最后四项做处理最后一项操作不做处理
      const options = createWholeOrder(cloneDeep(allOptions))
      // 采购申请-采购订单-采购入库 列数超过10条以上-整单
      // const len = options.length - 1
      // const limit = len - 4
      // // 宽度适配
      // for (let i = limit; i < len; i++) {
      //   options[i].width = undefined
      // }

      tableOptions.value = options
      list.value = wholeOrderList.value
      total.value = wholeOrderTotal.value
    } else {
      tableOptions.value = createBranchOrder(cloneDeep(allOptions))
      list.value = itemsList.value
      total.value = itemsTotal.value
    }
    selectionList.value = []
  }

  return {
    createBranchOrder,
    createWholeOrder,
    handleWholeOrderEnable
  }
}

export const useWholeOrderMergeCompute = () => {
  const wholeOrderMergeCompute = (list: any[], branchOptions) => {
    const computeSum = (items: any[], key: string) => {
      if (!items?.length) return
      return items.reduce((prev, cur) => {
        if (cur[key]) {
          return cur[key] + prev
        }
        return prev
      }, 0)
    }

    const keyList = branchOptions
      .filter((item) => item.wholeOrderEnable === WHOLE_ORDER_TYPE.mergeCompute)
      .map((item) => item.prop)
    return cloneDeep(list).map((item) => {
      keyList.forEach((key) => {
        item[key] = computeSum(item.items, key)
      })
      return item
    })
  }

  return {
    wholeOrderMergeCompute,
    WHOLE_ORDER_TYPE
  }
}

export const getWholeOrderItemsId = (
  selectionList: any[],
  wholeOrderEnable: any,
  itemIdKey: string
) => {
  let ids: any = []
  if (wholeOrderEnable.value) {
    selectionList.forEach((item: any) => {
      if (!item?.items?.length) return
      item.items.forEach((item) => {
        ids.push(item.id)
      })
    })
  } else {
    ids = selectionList.map((item: any) => item[itemIdKey])
  }
  return ids
}

// 对整单和分行的items-id获取做了处理
export const getBatchId = (wholeOrderEnable, selectionList) => {
  let ids: any = []
  if (wholeOrderEnable.value) {
    selectionList.value.forEach((item: any) => {
      if (item?.items?.length) {
        item.items.forEach((a: any) => {
          // ids.push({ id: a.id })
          ids.push(a.id)
        })
      }
    })
  } else {
    ids = selectionList.value.map((item: any) => {
      // return { id: item.itemsId }
      return item.itemsId
    })
  }
  return ids
}
