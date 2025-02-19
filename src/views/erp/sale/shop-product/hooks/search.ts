import { FormOptions } from '@/components/SmForm/src/types/types'
import { getIntDictOptions } from '@/utils/dict'
import { getShopList } from '@/commonData/index'

export const useSearchForm = (handleQuery, queryParams) => {
  const shopList = getShopList()
  const searchFormOptions = ref<Array<FormOptions>>([
    {
      type: 'input',
      label: '平台',
      prop: 'platform',
      placeholder: '请输入平台',
      attrs: {
        class: '!w-240px',
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'select',
      placeholder: '请选择店铺名称',
      prop: 'shopId',
      label: '店铺名称',
      attrs: {
        class: '!w-240px',
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: shopList
    },
    {
      type: 'select',
      placeholder: '请选择状态',
      prop: 'status',
      label: '状态',
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
      children: getIntDictOptions(DICT_TYPE.ERP_OFF_STATUS)
    }
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
