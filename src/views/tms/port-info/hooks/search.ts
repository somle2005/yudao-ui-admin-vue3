import { FormOptions } from '@/components/SmForm/src/types/types'
import { getIntDictOptions, DICT_TYPE, getBoolDictOptions } from '@/utils/dict'

export const useSearchForm = (handleQuery, queryParams) => {
  const searchFormOptions = ref<Array<FormOptions>>([
    {
      type: 'input',
      label: '港口编码',
      prop: 'code',
      placeholder: '请输入港口编码',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'input',
      label: '港口中文名',
      prop: 'name',
      placeholder: '请输入港口中文名',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'input',
      label: '港口英文名',
      prop: 'nameEn',
      placeholder: '请输入港口英文名',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'select',
      label: '国家代码',
      prop: 'countryCode',
      placeholder: '请选择国家代码',
      attrs: {
        style: { width: '100%' },
        filterable: true,
        clearable: true
      },
      children: getIntDictOptions(DICT_TYPE.COUNTRY_CODE)
    },
    {
      type: 'input',
      label: '城市中文名',
      prop: 'cityName',
      placeholder: '请输入城市中文名',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'input',
      label: '城市英文名',
      prop: 'cityNameEn',
      placeholder: '请输入城市英文名',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'input',
      label: '备注',
      prop: 'remark',
      placeholder: '请输入备注',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'select',
      label: '状态',
      prop: 'cabinetType',
      placeholder: '请选择状态',
      attrs: {
        style: { width: '100%' },
        filterable: true,
        clearable: true
      },
      children: getBoolDictOptions(DICT_TYPE.COMMON_BOOLEAN_STATUS)
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
