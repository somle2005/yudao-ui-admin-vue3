import { FormOptions } from "@/components/SmForm/src/types/types"
import {  getIntDictOptions } from "@/utils/dict"

export const useSearchForm = (handleQuery,queryParams) => {

  const searchFormOptions = ref<Array<FormOptions>>([
    {
      type: 'input',
      label: '线索名称',
      prop: 'name',
      placeholder: '请输入线索名称',
      attrs: {
        class: '!w-240px',
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'select',
      placeholder: '请选择转化状态',
      prop: 'transformStatus',
      label: '转化状态',
      attrs: {
        class: '!w-240px',
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: [{
        label: '未转化',
        value: false,
      },
      {
        label: '已转化',
        value: true,
      }]
    },
    {
      type: 'input',
      label: '手机号',
      prop: 'mobile',
      placeholder: '请输入手机号',
      attrs: {
        class: '!w-240px',
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'input',
      label: '电话',
      prop: 'telephone',
      placeholder: '请输入电话',
      attrs: {
        class: '!w-240px',
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'input',
      label: '公司名称',
      prop: 'companyName',
      placeholder: '请输入公司名称',
      attrs: {
        class: '!w-240px',
        style: { width: '100%' },
        clearable: true
      }
    },
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