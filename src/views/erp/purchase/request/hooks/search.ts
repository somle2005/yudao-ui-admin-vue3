import { getDeptTree, getProductList, getSupplierProductList, getUserList } from '@/commonData'
import { FormOptions } from '@/components/SmForm/src/types/types'
import { getDictOptions } from '@/utils/dict'


export const useSearchForm = (handleQuery) => {
  /**
  no-string-单据编号
  申请人-applicant-string 
  申请部门-applicationDept
  单据日期-requestTime
  status-状态
  auditor-审核者
  */

  //  const searchFormOptions = ref([
  //  {
  //     type: 'input',
  //     label: '单据编号',
  //     prop: 'no',
  //     placeholder: '请输入单据编号',
  //     attrs: {
  //       style: { width: '100%' },
  //       clearable: true
  //     }
  //   },
  //  ])

  const userList = getUserList()
  const { deptList, defaultProps } = getDeptTree()
  // const supplierProductList = getSupplierProductList()
  const searchFormOptions = ref<Array<FormOptions>>([
    {
      type: 'input',
      label: '单据编号',
      prop: 'no',
      placeholder: '请输入单据编号',
      attrs: {
        class: '!w-240px',
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'date-picker',
      placeholder: '请选择单据日期',
      prop: 'requestTime',
      label: '单据日期',
      attrs: {
        clearable: true,
        type: 'daterange',
        'value-format': 'YYYY-MM-DD HH:mm:ss',
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
      prop: 'applicant',
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
      prop: 'applicationDept',
      label: '申请部门',
      attrs: {
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
      },
    },


    {
      type: 'select',
      placeholder: '请选择审核状态',
      prop: 'status',
      label: '审核状态',
      attrs: {
        class: '!w-240px',
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: getDictOptions(DICT_TYPE.ERP_AUDIT_STATUS).map(item=>{
        item.type = 'option'
        return item
      })
    },

    {
      type: 'select',
      placeholder: '请选择审核人',
      prop: 'applicant',
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
    },

    

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
    //         formData.barCode = productItem.barCode
    //         // const modelVal = smFormRef.value.getFormData()
    //         // modelVal.barCode = productItem.barCode
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
      console.log(e, '回车事件出发了', item)
    }
  }

  searchFormOptions.value.forEach((item) => {
    item.events = events
  })
  return searchFormOptions
}
