import { getWMSWarehouseList } from '@/commonData/wms'
import { FormOptions } from '@/components/SmForm/src/types/types'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'

export const useSearchForm = (handleQuery, queryParams) => {
  const WMSWarehouseList = getWMSWarehouseList()

  const searchFormOptions = ref<Array<FormOptions>>(
    [
      {
        requiredFlag: true,
        type: 'select',
        label: '仓库',
        prop: 'warehouseId',
        placeholder: '请选择仓库',
        attrs: {
          style: { width: '100%' },
          filterable: true,
          clearable: true
        },
        children: WMSWarehouseList
      },
  
      {
        requiredFlag: true,
        type: 'input',
        label: '库区代码',
        prop: 'code',
        placeholder: '请输入库区代码',
        attrs: {
          style: { width: '100%' },
          clearable: true
        }
      },
      {
        requiredFlag: true,
        type: 'input',
        label: '库区名称',
        prop: 'name',
        placeholder: '请输入库区名称',
        attrs: {
          style: { width: '100%' },
          clearable: true
        }
      },
  
      { 
        requiredFlag: true,
        type: 'select',
        placeholder: '请选择存货类型',
        prop: 'stockType',
        label: '存货类型',
        attrs: {
          filterable: true,
          clearable: true,
          style: {
            width: '100%'
          }
        },
        children: getIntDictOptions(DICT_TYPE.WMS_STOCK_TYPE)
      },
      {
        requiredFlag: true,
        type: 'select',
        placeholder: '请选择分区类型',
        prop: 'partitionType',
        label: '分区类型',
        attrs: {
          filterable: true,
          clearable: true,
          style: {
            width: '100%'
          }
        },
        children: getIntDictOptions(DICT_TYPE.WMS_WAREHOUSE_AREA_PARTITION_TYPE)
      },
  
      {
        requiredFlag: true,
        type: 'select',
        placeholder: '请选择状态',
        prop: 'status',
        label: '状态',
        attrs: {
          filterable: true,
          clearable: true,
          style: {
            width: '100%'
          }
        },
        children: getIntDictOptions(DICT_TYPE.WMS_VALID_STATUS)
      },
      {
        type: 'input-number',
        label: '优先级',
        prop: 'priority',
        placeholder: '请输入优先级',
        attrs: {
          style: { width: '100%' },
          clearable: true,
          min:0,
        }
      },

      {
        type: 'date-picker',
        placeholder: '请选择创建时间',
        prop: 'createTime',
        label: '创建时间',
        attrs: {
          clearable: true,
          type: 'daterange',
          'value-format': 'YYYY-MM-DD HH:mm:ss',
          'start-placeholder': '开始日期',
          'end-placeholder': '结束日期',
          defaultTime: [new Date('1 00:00:00'), new Date('1 23:59:59')],
          class: '!w-240px',
          style: {
            width: '100%'
          }
        }
      },
    ]
  )

  const events = {
    'keyup.enter': (e, item) => {
      handleQuery()
    }
  }

  searchFormOptions.value.forEach((item) => {
    item.events = events
    if (item.attrs) {
      item.attrs.class = '!w-240px'
    }
  })
  const getSearchFormData = () => {
    return queryParams
  }
  return {
    searchFormOptions,
    getSearchFormData
  }
}
