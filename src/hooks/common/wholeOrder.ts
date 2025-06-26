import { cloneDeep } from 'lodash-es'

const includesType = (type, compareType) => {
  if (Array.isArray(type)) {
    return type.includes(compareType)
  } else {
    return type === compareType
  }
}

const noIncludesType = (type, compareType) => {
  return !includesType(type, compareType)
}

export const WHOLE_ORDER_TYPE = {
  items: 'items', // 分行才进行展示 整单不展示
  mergeCompute: 'mergeCompute',
  wholeOrder: 'wholeOrder' // 整单才进行展示
}

const isWholeOrder = (item) => {
  return noIncludesType(item.wholeOrderEnable, WHOLE_ORDER_TYPE.items)
}

const isBranch = (item) => {
  return noIncludesType(item.wholeOrderEnable, WHOLE_ORDER_TYPE.wholeOrder)
}

export const createWholeOrder = (allOptions) => {
  return allOptions.filter((item) => isWholeOrder(item))
}
export const createBranchOrder = (allOptions) => {
  return allOptions.filter((item) => isBranch(item))
}

const isEnableFlag = (wholeOrderEnable, item) => {
  return wholeOrderEnable.value ? isWholeOrder(item) : isBranch(item)
}

// 因为整单分行需要区分对应状态下-是否启用字段 齿轮设置项使用
export const addWholeOrderProp = (wholeOrderEnable, allOptions) => {
  allOptions.forEach((item) => {
    const flag = isEnableFlag(wholeOrderEnable, item)
    if (flag) {
      item.isEnable = true
    } else {
      item.isEnable = false
    }
  })
  return allOptions
}

export const createWholeOrderOrBranchOptions = (wholeOrderEnable, allOptions) => {
  return wholeOrderEnable.value
    ? createWholeOrder(cloneDeep(allOptions))
    : createBranchOrder(cloneDeep(allOptions))
}

// wholeOrderTableFieldOptions-可能是allOptions也可能是diffTableOptions
export const switchWholeOrderOptions = (
  wholeOrderEnable,
  tableOptions,
  wholeOrderTableFieldOptions
) => {
  tableOptions.value = wholeOrderTableFieldOptions.filter((item) => {
    const flag = isEnableFlag(wholeOrderEnable, item)
    // 保存过saveFlag 就应该取保存过的isEnable 为true  就不能过滤 虽然应该是整单或者分行才能展示字段-但是用户强行点击保存启用-后面可以齿轮再扩展一列-整单分行应展示 标记可用
    return item.saveFlag ? item.isEnable : flag
  })

  // tableOptions.value = createWholeOrderOrBranchOptions(
  //   wholeOrderEnable,
  //   wholeOrderTableFieldOptions
  // )
}

export const useWholeOrder = (
  createTableFiledOptions,
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
    try {
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
      createTableFiledOptions()
    } catch (e) {
      console.log(e, '报错了')
    }
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

/*
 因为计算的是items里面的可能需要转化一下
 外部list显示itemsTaxPrice
 传递的是allOptions进行合并计算否则-就会有部分比如items才能出现的分行
 */
export const useWholeOrderMergeComputeUp = () => {
  const wholeOrderMergeCompute = (list: any[], branchOptions, transformKey = 'items') => {
    const computeSum = (items: any[], key: string) => {
      if (!items?.length) return
      return items.reduce((prev, cur) => {
        if (cur[key]) {
          return cur[key] + prev
        }
        return prev
      }, 0)
    }

    const transformKeyStr = (key: string, transformKey: string) => {
      try {
        const len = transformKey.length
        let str = key.slice(len)
        str = str[0].toLowerCase() + str.slice(1)
        return str
      } catch (e) {
        console.log(e, 'e-key', key)
      }
    }

    const keyList = branchOptions.filter((item) =>
      includesType(item.wholeOrderEnable, WHOLE_ORDER_TYPE.mergeCompute)
    )
    // .map((item) => item.prop)

    return cloneDeep(list).map((item) => {
      keyList.forEach((keyItem) => {
        const { prop, totalItemsKey } = keyItem
        const sumVal = computeSum(item.items, transformKeyStr(prop, transformKey)!)
        /**
         * 通过branchOptions获取 totalItemKey 处理总的totalItemsQty值和itemQty的区分
         * 如果有值就把值给totalItemsKey展示看- itemsQty依然拿的是分行的值
         */
        if (totalItemsKey) {
          item[totalItemsKey] = sumVal
        } else {
          item[prop] = sumVal
        }
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

export const getWholeOrderItems = (
  selectionList: any[],
  wholeOrderEnable: any,
  itemIdKey: string
) => {
  let list: any = []
  if (wholeOrderEnable.value) {
    selectionList.forEach((item: any) => {
      if (!item?.items?.length) return
      item.items.forEach((a) => {
        a[itemIdKey] = a.id
        list.push(a)
      })
    })
  } else {
    list = selectionList
  }
  return list
}
