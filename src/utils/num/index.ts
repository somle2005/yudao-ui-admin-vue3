import { TableColumnCtx } from 'element-plus'

// js保留n位小数 不四舍五入补0
export const formatDecimal = (num, decimal) => {
  num = num.toString()
  const index = num.indexOf('.')
  if (index !== -1) {
    num = num.substring(0, decimal + index + 1)
  } else {
    num = num.substring(0)
  }
  return parseFloat(num).toFixed(decimal)
}

export const formatDecimalFormatter = (
  _row: any,
  _column: TableColumnCtx<any>,
  cellValue: any
): string => {
  return formatDecimal(cellValue, 3)
}
