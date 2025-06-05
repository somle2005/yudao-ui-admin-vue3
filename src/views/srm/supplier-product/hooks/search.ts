import { getProductList, getSupplierList } from '@/commonData'
import { FormOptions } from '@/components/SmForm/src/types/types'
import { getDictOptions, getIntDictOptions } from '@/utils/dict'

export const useSearchForm = (handleQuery, queryParams) => {
  const productList = getProductList(null, { label: 'barCode', value: 'id' })
  const supplierList = getSupplierList()
  const searchFormOptions = ref<Array<FormOptions>>([
    {
      type: 'input',
      label: '供应商产品编码',
      prop: 'code',
      placeholder: '请输入供应商产品编码',
      attrs: {
        class: '!w-240px',
        style: { width: '100%' },
        clearable: true
      }
    },

    {
      type: 'select',
      placeholder: '请选择供应商',
      prop: 'supplierId',
      label: '供应商',
      attrs: {
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: supplierList
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
      type: 'select',
      placeholder: '请选择采购货币代码',
      prop: 'purchasePriceCurrencyCode',
      label: '采购货币代码',
      attrs: {
        class: '!w-240px',
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: getIntDictOptions(DICT_TYPE.CURRENCY_CODE)
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
