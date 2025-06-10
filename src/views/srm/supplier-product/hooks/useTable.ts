import { useTableData } from '@/components/SmTable/src/utils'
import { dateFormatter, dateFormatter2 } from '@/utils/formatTime'
import { formatDecimalFormatter } from '@/utils/num'
import { cloneDeep } from 'lodash-es'

export const useTable = (columnMinWidth) => {
  const { tableOptions, transformTableOptions } = useTableData()

  // Time时间前缀会被自动转化
  const fieldMap = {
    code: {
      label: '供应商产品编码',
      'min-width': columnMinWidth,
      dictAttrs: { type: DICT_TYPE.SRM_AUDIT_STATUS }
    },
    supplierName: '供应商',
    barcode: '产品编码', // 等后端返回
    // productName: '产品',
    packageHeight: '包装高度',
    packageLength: '包装长度',
    packageWeight: '包装重量',
    packageWidth: '包装宽度',
    purchasePrice: '采购价格',

    purchasePriceCurrencyCode: {
      label: '采购货币代码',
      slot: 'purchasePriceCurrencyCode',
      dictAttrs: { type: DICT_TYPE.CURRENCY_CODE }
    },
    createTime: {
      label: '创建时间',
      formatter: dateFormatter,
      width: '180px'
    },
    operate: {
      label: '操作',
      slot: 'operate',
      fixed: 'right',
      width: '120px'
    }
  }
  const allOptions = transformTableOptions(fieldMap)
  allOptions.forEach(item => {
    item.width = undefined
  })

  tableOptions.value = allOptions

  return {
    tableOptions
  }
}
