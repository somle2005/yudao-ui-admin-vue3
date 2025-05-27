import { getProductList } from '@/commonData'
import { getWMSWarehouseList } from '@/commonData/wms'
import { FormOptions } from '@/components/SmForm/src/types/types'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'

export const useSearchForm = (handleQuery, queryParams) => {
  const WMSWarehouseList = getWMSWarehouseList()
  const productList = getProductList()
  const searchFormOptions = ref<Array<FormOptions>>([
    {
      type: 'input',
      placeholder: '请输入调拨单编码',
      prop: 'code',
      label: '调拨单编码',
      attrs: {
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      }
    },

    {
      type: 'select',
      label: '调拨仓',
      prop: 'fromWarehouseId',
      placeholder: '请选择调拨仓',
      attrs: {
        style: { width: '100%' },
        filterable: true,
        clearable: true
      },
      children: WMSWarehouseList
    },

    {
      type: 'select',
      label: '目的仓',
      prop: 'toWarehouseId',
      placeholder: '请选择目的仓',
      attrs: {
        style: { width: '100%' },
        filterable: true,
        clearable: true
      },
      children: WMSWarehouseList
    },

    {
      type: 'input',
      prop: 'traceNo',
      label: '跟踪号',
      placeholder: '请输入跟踪号',
      attrs: {
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      }
    },

    {
      type: 'select',
      placeholder: '请选择产品编码',
      prop: 'productId',
      label: '产品编码',
      attrs: {
        clearable: true,
        filterable: true,
        class: '!w-240px',
        style: {
          width: '100%'
        }
      },
      children: productList
    },

    {
      type: 'input',
      placeholder: '请输入备注',
      prop: 'remark',
      label: '备注',
      attrs: {
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      }
    },
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
