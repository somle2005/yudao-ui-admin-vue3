import { useTableData } from '@/components/SmTable/src/utils'
import { dateFormatter, dateFormatter2 } from '@/utils/formatTime'
import { formatDecimalFormatter } from '@/utils/num'
import { cloneDeep } from 'lodash-es'

export const useTable = () => {
  const { tableOptions, transformTableOptions } = useTableData()

  const fieldMap = {
    code: '港口编码',
    name: '港口中文名',
    nameEn: '港口英文名',

    countryCode: {
      label: '国家代码',
      slot: 'countryCode',
      dictAttrs: { type: DICT_TYPE.COUNTRY_CODE }
    },
    countryName: '国家描述',
    cityName: '城市中文名',
    cityNameEn: '城市英文名',
    remark: '备注',

    status: {
      label: '状态',
      slot: 'status',
      dictAttrs: { type: DICT_TYPE.COMMON_BOOLEAN_STATUS }
    },


    updateTime: {
      label: '更新时间',
      formatter: dateFormatter,
      width: '180px'
    },
    updater: '更新人',
    creator: '创建人',
    createTime: {
      label: '创建时间',
      formatter: dateFormatter,
      width: '180px'
    },
    operate: {
      label: '操作',
      slot: 'operate',
      fixed: 'right',
      width: '180px'
    }
  }

  tableOptions.value = transformTableOptions(fieldMap, {
    wrapList: ['code'],
    noComputePropList: ['code']
  })

  return {
    tableOptions
  }
}
