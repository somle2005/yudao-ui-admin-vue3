import { FormOptions } from '@/components/SmForm/src/types/types'

export const useSearchForm = (handleQuery, queryParams) => {
  const searchFormOptions = ref<Array<FormOptions>>([
    {
      type: 'input',
      label: '入库单编号',
      prop: 'inboundNo',
      placeholder: '请输入入库单编号',
      attrs: {
        style: { width: '100%' },
        clearable: true
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
