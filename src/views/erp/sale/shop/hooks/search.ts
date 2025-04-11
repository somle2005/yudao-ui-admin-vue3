import { FormOptions } from '@/components/SmForm/src/types/types'
import { getIntDictOptions } from '@/utils/dict'


export const useSearchForm = (handleQuery, queryParams) => {
  const platformList = getIntDictOptions(DICT_TYPE.ERP_SALES_PLATFORM).map((item: any) => {
    item.value = item.label
    return item
  })
  const searchFormOptions = ref<Array<FormOptions>>([
    {
      type: 'input',
      label: '店铺别名',
      prop: 'name',
      placeholder: '请输入店铺别名',
      attrs: {
        class: '!w-240px',
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'select',
      placeholder: '请选择平台',
      prop: 'platformCode',
      label: '平台',
      // formItemConfig: {
      //   class: '!w-240px',
      // },
      attrs: {
        class: '!w-240px',
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: platformList
    },
    {
      type: 'select',
      placeholder: '请选择类型',
      prop: 'type',
      label: '类型',
      // formItemConfig: {
      //   class: '!w-240px',
      // },
      attrs: {
        class: '!w-240px',
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: getIntDictOptions(DICT_TYPE.ERP_SHOP_TYPE)
    },
  ])

  const events = {
    'keyup.enter': (e, item) => {
      handleQuery()
    }
  }

  searchFormOptions.value.forEach((item) => {
    item.events = events
  })
  const getSearchFormData = () => {
    return queryParams
  }
  return {
    searchFormOptions,
    getSearchFormData
  }
}
