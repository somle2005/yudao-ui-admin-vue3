import { reduceVal } from '../transformData'

export const createSelectSummaries = (columnList: string[], selectionList: any) => {
  /** 合计 */
  const getSelectSummaries = (param: any) => {
    const { columns, data } = param
    const sums: any[] = []
    columns.forEach((column, index: number) => {
      // if (index === 0) {
      //   sums[index] = '合计'
      //   return
      // }
      // const columnList = ['itemsPackageWeight', 'itemsVolume', 'itemsQty']
      if (columnList.includes(column.property)) {
        const sum = reduceVal(column.property, unref(selectionList))
        sums[index] = sum
      } else {
        sums[index] = ''
      }
    })
    return sums
  }

  return {
    getSelectSummaries
  }
}

export const createWholeOrderSelectSummaries = (
  wholeOrderEnable,
  computeList: Array<{
    wholeOrdeColumnKey?: string
    wholeOrderKey?: string
    wholeOrderTotalKey?: string
    itemsColumnKey?: string
    itemsKey?: string
    itemsTotalKey?: string
    formatter?: Function
  }>,
  selectionList: any,
  summary
) => {
  /** 合计 */
  const getWholeOrderSelectSummaries = (param: any) => {
    const { columns, data } = param
    const sums: any[] = []
    columns.forEach((column, index: number) => {
      // if (index === 0) {
      //   sums[index] = '合计'
      //   return
      // }
      const columnKey = wholeOrderEnable.value ? 'wholeOrdeColumnKey' : 'itemsColumnKey'
      const columnList = computeList
        .filter((item) => item[columnKey])
        .map((item) => item[columnKey])

      const selectList = unref(selectionList)

      // 选中项空数组时处理
      const resolveTotal = (sums) => {
        let sum
        const item = computeList.find((item) => item[columnKey] === column.property)!
        const { wholeOrderTotalKey, itemsTotalKey, formatter } = item as any

        // 看后端这种总值是否是list[0]-还是data-再提供一个接口进行带出
        if (wholeOrderEnable.value) {
          sum = unref(summary)[wholeOrderTotalKey]
          // sum = 200
        } else {
          sum = unref(summary)[itemsTotalKey]
          // sum = 300
        }
        // sum过滤
        sums[index] = formatter ? formatter(sum) : sum
      }

      const computeColumn = (sums) => {
        let sum
        const item = computeList.find((item) => item[columnKey] === column.property)!
        const { wholeOrderKey, itemsKey, formatter } = item as any
        if (wholeOrderEnable.value) {
          sum = reduceVal(wholeOrderKey, selectList)
        } else {
          sum = reduceVal(itemsKey, selectList)
        }
        // sum过滤
        sums[index] = formatter ? formatter(sum) : sum
      }

      if (!columnList.includes(column.property)) {
        sums[index] = ''
        return
      }
      selectList.length ? computeColumn(sums) : resolveTotal(sums)
    })
    return sums
  }

  return {
    getWholeOrderSelectSummaries
  }
}
