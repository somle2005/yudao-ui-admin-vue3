import { getWarehouseZoneList, getWMSWarehouseList } from '@/commonData/wms'
import { FormOptions } from '@/components/SmForm/src/types/types'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'

export const useSearchForm = (handleQuery, queryParams) => {
  const WMSWarehouseList = getWMSWarehouseList()
  const warehouseZoneList = getWarehouseZoneList()
  const searchFormOptions = ref<Array<FormOptions>>(
    [
    
      {
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
        type: 'select',
        label: '库区',
        prop: 'zoneId',
        placeholder: '请选择库区',
        attrs: {
          style: { width: '100%' },
          filterable: true,
          clearable: true
        },
        children: warehouseZoneList
      },
      {
        type: 'input',
        label: '库位代码',
        prop: 'code',
        placeholder: '请输入库位代码',
        attrs: {
          style: { width: '100%' },
          clearable: true
        }
      },
      {
        type: 'input',
        label: '库位',
        prop: 'name',
        placeholder: '请输入库位',
        attrs: {
          style: { width: '100%' },
          clearable: true
        }
      },
      {
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
        label: '拣货顺序',
        prop: 'pickingOrder',
        placeholder: '请输入拣货顺序',
        attrs: {
          style: { width: '100%' },
          clearable: true,
          min: 0
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
          'value-format': 'x',
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
