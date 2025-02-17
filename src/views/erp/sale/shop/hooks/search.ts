import { FormOptions } from '@/components/SmForm/src/types/types'
import { getIntDictOptions } from '@/utils/dict'


export const useSearchForm = (handleQuery, queryParams) => {

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
      type: 'input',
      label: '店铺名称',
      prop: 'name',
      placeholder: '请输入店铺名称',
      attrs: {
        class: '!w-240px',
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'select',
      placeholder: '请选择状态',
      prop: 'status',
      label: '状态',
      formItemConfig: {
        class: '!w-240px',
      },
      attrs: {
        // class: '!w-240px',
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: getIntDictOptions(DICT_TYPE.ERP_OFF_STATUS)
    },
    {
      type: 'select',
      placeholder: '请选择类型',
      prop: 'type',
      label: '类型',
      formItemConfig: {
        class: '!w-240px',
      },
      attrs: {
        // class: '!w-240px',
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
