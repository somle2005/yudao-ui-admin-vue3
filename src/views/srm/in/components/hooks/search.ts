import { getProductList, getSupplierList, getUserList } from '@/commonData'
import { FormOptions } from '@/components/SmForm/src/types/types'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'

export const useSearchForm = (handleQuery, queryParams) => {
  // const userList = getUserList()
  const productList = getProductList(null, { label: 'barCode', value: 'id' })
  // const supplierList = getSupplierList()
  const searchFormOptions = ref<Array<FormOptions>>([
    // 订单单号
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
    // 产品用产品编码
    {
      type: 'select',
      placeholder: '请选择产品编码',
      prop: 'productId',
      label: '产品编码',
      attrs: {
        clearable: true,
        filterable: true,
        class: '!w-240px',
        style: {
          width: '100%'
        }
      },
      children: productList
    },
    // 订单时间
    // {
    //   type: 'date-picker',
    //   placeholder: '请选择采购时间',
    //   prop: 'orderTime',
    //   label: '采购时间',
    //   attrs: {
    //     clearable: true,
    //     type: 'daterange',
    //     'value-format': 'x',
    //     'start-placeholder': '开始日期',
    //     'end-placeholder': '结束日期',
    //     defaultTime: [new Date('1 00:00:00'), new Date('1 23:59:59')],
    //     class: '!w-240px',
    //     style: {
    //       width: '100%'
    //     }
    //   }
    // },

    // {
    //   type: 'select',
    //   placeholder: '请选择供应商',
    //   prop: 'auditorId',
    //   label: '供应商',
    //   attrs: {
    //     class: '!w-240px',
    //     filterable: true,
    //     clearable: true,
    //     style: {
    //       width: '100%'
    //     }
    //   },
    //   children: supplierList
    // },

    // 制单人-创建人-注意后端是否处理了
    // {
    //   type: 'select',
    //   placeholder: '请选择制单人',
    //   prop: 'creator',
    //   label: '制单人',
    //   attrs: {
    //     class: '!w-240px',
    //     filterable: true,
    //     clearable: true,
    //     style: {
    //       width: '100%'
    //     }
    //   },
    //   children: userList
    // },
    // {
    //   type: 'select',
    //   placeholder: '请选择审核状态',
    //   prop: 'auditStatus',
    //   label: '审核状态',
    //   attrs: {
    //     class: '!w-240px',
    //     filterable: true,
    //     clearable: true,
    //     style: {
    //       width: '100%'
    //     }
    //   },
    //   children: getIntDictOptions(DICT_TYPE.SRM_AUDIT_STATUS)
    // },

    // {
    //   type: 'select',
    //   placeholder: '请选择入库状态',
    //   prop: 'inboundStatus',
    //   label: '入库状态',
    //   attrs: {
    //     class: '!w-240px',
    //     filterable: true,
    //     clearable: true,
    //     style: {
    //       width: '100%'
    //     }
    //   },
    //   children: getIntDictOptions(DICT_TYPE.SRM_STORAGE_STATUS)
    // }
  ])

  const events = {
    'keyup.enter': (e, item) => {
      handleQuery()
    }
  }

  searchFormOptions.value.forEach((item) => {
    item.events = events
    if (item.attrs) {
      item.attrs.class = '!w-160px'
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
