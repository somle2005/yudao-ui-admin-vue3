import { FormOptions } from "@/components/SmForm/src/types/types"
import { getIntDictOptions } from "@/utils/dict"

export const useSearchForm = (handleQuery,queryParams) => {


  const searchFormOptions = ref<Array<FormOptions>>([
    {
      type: 'input',
      label: '客户名称',
      prop: 'name',
      placeholder: '请输入客户名称',
      attrs: {
        class: '!w-240px',
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'input',
      label: '手机',
      prop: 'mobile',
      placeholder: '请输入手机',
      attrs: {
        class: '!w-240px',
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'select',
      placeholder: '请选择所属行业',
      prop: 'industryId',
      label: '所属行业',
      attrs: {
        class: '!w-240px',
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: getIntDictOptions(DICT_TYPE.CRM_CUSTOMER_INDUSTRY),
    },
    {
      type: 'select',
      placeholder: '请选择客户级别',
      prop: 'level',
      label: '客户级别',
      attrs: {
        class: '!w-240px',
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: getIntDictOptions(DICT_TYPE.CRM_CUSTOMER_LEVEL),
    },
    {
      type: 'select',
      placeholder: '请选择客户来源',
      prop: 'source',
      label: '客户来源',
      attrs: {
        class: '!w-240px',
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: getIntDictOptions(DICT_TYPE.CRM_CUSTOMER_SOURCE),
    },

    // {
    //   type: 'input',
    //   label: '公司名称',
    //   prop: 'companyName',
    //   placeholder: '请输入公司名称',
    //   attrs: {
    //     class: '!w-240px',
    //     style: { width: '100%' },
    //     clearable: true
    //   }
    // },
    {
      type: 'input',
      label: '公司介绍',
      prop: 'companyIntroduce',
      placeholder: '请输入公司介绍',
      attrs: {
        class: '!w-240px',
        style: { width: '100%' },
        clearable: true,
      }
    },
    {
      type: 'input',
      label: '官网',
      prop: 'companyWebsite',
      placeholder: '请输入官网',
      attrs: {
        class: '!w-240px',
        style: { width: '100%' },
        clearable: true
      }
    },
    // {
    //   type: 'select',
    //   placeholder: '请选择客户标签',
    //   prop: 'labelCodes',
    //   label: '客户标签',
    //   attrs: {
    //     class: '!w-240px',
    //     filterable: true,
    //     clearable: true,
    //     multiple: true,
    //     style: {
    //       width: '100%'
    //     }
    //   },
    //   children: getIntDictOptions(DICT_TYPE.CRM_CLIENT_TAG)
    // },
    // {
    //   type: 'select',
    //   placeholder: '请选择国家',
    //   prop: 'countryCodes',
    //   label: '国家',
    //   attrs: {
    //     class: '!w-240px',
    //     filterable: true,
    //     clearable: true,
    //     multiple: true,
    //     style: {
    //       width: '100%'
    //     }
    //   },
    //   children: getIntDictOptions(DICT_TYPE.COUNTRY_CODE)
    // },
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