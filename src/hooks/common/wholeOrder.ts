import { cloneDeep } from 'lodash-es'

export const WHOLE_ORDER_TYPE = {
  items: 'items', // 分行才进行展示 整单不展示
  mergeCompute: 'mergeCompute',
  wholeOrder: 'wholeOrder', // 整单才进行展示
}

export const useWholeOrder = (
  branchOptions,
  tableOptions,
  selectionList,
  list,
  total,
  itemsList,
  itemsTotal,
  wholeOrderList,
  wholeOrderTotal
) => {
  const createWholeOrder = (branchOptions) => {
    return branchOptions.filter((item) => item.wholeOrderEnable !== WHOLE_ORDER_TYPE.items)
  }
  const handleWholeOrderEnable = (val) => {
    if (val) {
      // 防止大屏宽度没有占满对最后四项做处理最后一项操作不做处理
      const options = createWholeOrder(cloneDeep(branchOptions))
      const len = options.length - 1
      const limit = len - 4
      // 宽度适配
      for (let i = limit; i < len; i++) {
        options[i].width = undefined
      }

      tableOptions.value = options
      list.value = wholeOrderList.value
      total.value = wholeOrderTotal.value
    } else {
      tableOptions.value = cloneDeep(branchOptions)
      list.value = itemsList.value
      total.value = itemsTotal.value
    }
    selectionList.value = []
  }

  return {
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
