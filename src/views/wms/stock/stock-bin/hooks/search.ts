import { getProductList } from '@/commonData'
import { getWarehouseBinList, getWarehouseZoneList, getWMSWarehouseList } from '@/commonData/wms'
import { FormOptions } from '@/components/SmForm/src/types/types'

export const useSearchForm = (handleQuery, queryParams) => {
  const WMSWarehouseList = getWMSWarehouseList()
  const productList = getProductList() // 产品列表
  const warehouseZoneList = getWarehouseZoneList()
  const warehouseBinList = getWarehouseBinList()

  const searchFormOptions = ref<Array<FormOptions>>([
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
      placeholder: '请选择产品编码',
      prop: 'productId',
      label: '产品编码',
      attrs: {
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: productList
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
      type: 'select',
      label: '库位',
      prop: 'binId',
      placeholder: '请选择库位',
      attrs: {
        style: { width: '100%' },
        filterable: true,
        clearable: true
      },
      children: warehouseBinList
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
        // defaultTime: [new Date('1 00:00:00'), new Date('1 23:59:59')],
        class: '!w-240px',
        style: {
          width: '100%'
        }
      }
    },

    {
      componentType: 'sm-range',
      label: '可售数',
      prop: 'sellableQty',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      componentType: 'sm-range',
      label: '可用数',
      prop: 'availableQty',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    }
  ])

  const events = {
    'keyup.enter': (e, item) => {
      handleQuery()
    }
  }

  searchFormOptions.value.forEach((item) => {
    item.events = events
    if (item.attrs) {
      item.attrs.class = '!w-240px'
    } else {
      item.attrs = {
        class: '!w-240px'
      }
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
