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
    wholeOrdeColumnKey: string
    wholeOrderKey: string
    wholeOrderTotalKey?: string
    itemsColumnKey: string
    itemsKey: string
    itemsTotalKey?: string
    formatter?: Function
  }>,
  selectionList: any
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
      const columnList = computeList.map((item) => item[columnKey])
      if (columnList.includes(column.property)) {
        const item = computeList.find((item) => item[columnKey] === column.property)!
        const { wholeOrderKey, itemsKey, formatter } = item
        let sum
        if (wholeOrderEnable.value) {
          sum = reduceVal(wholeOrderKey, unref(selectionList))
        } else {
          sum = reduceVal(itemsKey, unref(selectionList))
        }
        // sum过滤
        sums[index] = formatter ? formatter(sum) : sum
      } else {
        sums[index] = ''
      }
    })
    return sums
  }

  return {
    getWholeOrderSelectSummaries
  }
}
