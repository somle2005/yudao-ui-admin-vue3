import { VOLUMN_PRECISION } from '@/views/tms/common/constant'
import { TableColumnCtx } from 'element-plus'

// js保留n位小数 不四舍五入补0
export const formatDecimal = (num, decimal) => {
  try {
    if(!num) return num
    num = num.toString()
    const index = num.indexOf('.')
    if (index !== -1) {
      num = num.substring(0, decimal + index + 1)
    } else {
      num = num.substring(0)
    }
    return parseFloat(num).toFixed(decimal)
  } catch (e) {
    console.log(e, 'e')
  }
}

export const formatDecimalFormatter = (
  _row: any,
  _column: TableColumnCtx<any>,
  cellValue: any
): string => {
  return formatDecimal(cellValue, VOLUMN_PRECISION)
}
