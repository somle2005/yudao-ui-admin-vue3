import { FormOptions } from '@/components/SmForm/src/types/types'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'

export const useSearchForm = (handleQuery, queryParams) => {
  const searchFormOptions = ref<Array<FormOptions>>([
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
      label: '仓库属性',
      prop: 'mode',
      placeholder: '请输入仓库属性',
      attrs: {
        style: { width: '100%' },
        filterable: true,
        clearable: true
      },
      children: getIntDictOptions(DICT_TYPE.WMS_WAREHOUSE_MODE)
    },

    {
      type: 'input',
      label: '仓库代码',
      prop: 'code',
      placeholder: '请输入仓库代码',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'input',
      label: '仓库',
      prop: 'name',
      placeholder: '请输入仓库',
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
      type: 'input',
      label: '公司名称',
      prop: 'companyName',
      placeholder: '请输入公司名称',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },

    {
      type: 'select',
      label: '国家编码',
      prop: 'country',
      placeholder: '请输入国家编码',
      attrs: {
        style: { width: '100%' },
        filterable: true,
        clearable: true
      },
      children: getIntDictOptions(DICT_TYPE.COUNTRY_CODE).map((item: any) => {
        item.value = item.label
        return item
      })
    },

    {
      type: 'input',
      label: '省/州',
      prop: 'province',
      placeholder: '请输入省/州',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'input',
      label: '城市',
      prop: 'city',
      placeholder: '请输入城市',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'input',
      label: '详细地址1',
      prop: 'addressLine1',
      placeholder: '请输入详细地址1',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'input',
      label: '详细地址2',
      prop: 'addressLine2',
      placeholder: '请输入详细地址2',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },

    {
      type: 'input',
      label: '邮编',
      prop: 'postcode',
      placeholder: '请输入邮编',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'input',
      label: '联系人',
      prop: 'contactPerson',
      placeholder: '请输入联系人',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'input',
      label: '联系电话',
      prop: 'contactPhone',
      placeholder: '请输入联系电话',
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
