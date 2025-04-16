import { getWMSWarehouseList } from '@/commonData/wms'
import { FormOptions } from '@/components/SmForm/src/types/types'

export const useSearchForm = (handleQuery, queryParams) => {
  const WMSWarehouseList = getWMSWarehouseList()
  const searchFormOptions = ref<Array<FormOptions>>([
    {
      type: 'input',
      label: '单据编号',
      prop: 'no',
      placeholder: '请输入单据编号',
      attrs: {
        style: { width: '100%' },
        clearable: true
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
