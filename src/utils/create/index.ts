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
