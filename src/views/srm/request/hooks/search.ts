import {
  getDeptTree,
  getProductList,
  getSupplierList,
  getSupplierProductList,
  getUserList
} from '@/commonData'
import { FormOptions } from '@/components/SmForm/src/types/types'
import { getDictOptions } from '@/utils/dict'

export const useSearchForm = (handleQuery) => {
  const userList = getUserList()
  const { deptList, defaultProps } = getDeptTree()
  // const supplierProductList = getSupplierProductList()
  const productList = getProductList(null, { label: 'code', value: 'id' })
  const supplierList = getSupplierList()
  const searchFormOptions = ref<Array<FormOptions>>([
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
      prop: 'productIds',
      label: '产品编码',
      attrs: {
        multiple: true,
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
      type: 'input',
      label: '单据编码',
      prop: 'code',
      placeholder: '请输入单据编码',
      attrs: {
        class: '!w-240px',
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'date-picker',
      placeholder: '请选择单据日期',
      prop: 'billTime',
      label: '单据日期',
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
      placeholder: '请选择申请人',
      prop: 'applicantId',
      label: '申请人',
      attrs: {
        class: '!w-240px',
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: userList
    },
    {
      type: 'tree-select',
      placeholder: '请选择申请部门',
      prop: 'applicationDeptIds',
      label: '申请部门',
      attrs: {
        multiple: true,
        class: '!w-240px',
        filterable: true,
        clearable: true,
        data: deptList,
        props: defaultProps,
        'check-strictly': true,
        'node-key': 'id'
        // style: {
        //   width: '100%'
        // }
      }
    },
    {
      type: 'select',
      placeholder: '请选择关闭状态',
      prop: 'offStatus',
      label: '关闭状态',
      attrs: {
        class: '!w-240px',
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: getDictOptions(DICT_TYPE.SRM_OFF_STATUS)
    },
    {
      type: 'select',
      placeholder: '请选择审核状态',
      prop: 'auditStatus',
      label: '审核状态',
      attrs: {
        class: '!w-240px',
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: getDictOptions(DICT_TYPE.SRM_AUDIT_STATUS)
    },

    {
      type: 'select',
      placeholder: '请选择审核人',
      prop: 'auditorId',
      label: '审核人',
      attrs: {
        class: '!w-240px',
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: userList
    }

    // {
    //   type: 'select',
    //   placeholder: '请选择供应商产品',
    //   prop: 'supplierId',
    //   label: '供应商产品',
    //   attrs: {
    //     filterable: true,
    //     clearable: true,
    //     style: {
    //       width: '100%'
    //     }
    //   },
    //   rules: [
    //     {
    //       required: true,
    //       message: '供应商产品不能为空',
    //       trigger: 'change'
    //     }
    //   ],
    //   children: supplierProductList
    // },

    // {
    //   type: 'select',
    //   value: '',
    //   placeholder: '请选择产品',
    //   prop: 'productId',
    //   label: '产品',
    //   attrs: {
    //     clearable: true,
    //     filterable: true,
    //     style: {
    //       width: '100%'
    //     },
    //     onChange: (value) => {
    //       const productItem = productList1.value.find((item: any) => item.value === value)
    //       if (productItem) {
    //         const formData = getFormData()
    //         formData.code = productItem.code
    //         // const modelVal = smFormRef.value.getFormData()
    //         // modelVal.code = productItem.code
    //       }
    //     }
    //   },
    //   rules: [
    //     {
    //       required: true,
    //       message: '产品不能为空',
    //       trigger: 'change'
    //     }
    //   ],
    //   children: productList1
    // },
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
  return searchFormOptions
}
