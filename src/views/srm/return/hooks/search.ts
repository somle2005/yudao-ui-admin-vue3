import { getAccountList, getProductList, getSupplierList, getUserList } from '@/commonData'
import { getWMSWarehouseList } from '@/commonData/wms'
import { FormOptions } from '@/components/SmForm/src/types/types'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'

export const useSearchForm = (handleQuery, queryParams) => {
  // const userList = getUserList()
  // const accountList = getAccountList()
  const productList = getProductList(null, { label: 'barCode', value: 'id' })
  const WMSWarehouseList = getWMSWarehouseList()
  const supplierList = getSupplierList()
  const searchFormOptions = ref<Array<FormOptions>>([
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
      children: getIntDictOptions(DICT_TYPE.SRM_AUDIT_STATUS)
    },

    {
      type: 'select',
      placeholder: '请选择出库状态',
      prop: 'outboundStatus',
      label: '出库状态',
      attrs: {
        class: '!w-240px',
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: getIntDictOptions(DICT_TYPE.SRM_OUTBOUND_STATUS)
    },

    {
      type: 'select',
      placeholder: '请选择行出库状态',
      prop: 'itemsOutboundStatus',
      label: '行出库状态',
      attrs: {
        class: '!w-240px',
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: getIntDictOptions(DICT_TYPE.SRM_OUTBOUND_STATUS)
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

    {
      type: 'input',
      label: '上游单据编码',
      prop: 'arriveCode',
      placeholder: '请输入上游单单据编码',
      attrs: {
        class: '!w-240px',
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'select',
      placeholder: '请选择仓库',
      prop: 'warehouseId',
      label: '仓库',
      attrs: {
        class: '!w-240px',
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: WMSWarehouseList
    }

    // {
    //   type: 'date-picker',
    //   placeholder: '请选择单据日期',
    //   prop: 'returnTime',
    //   label: '单据日期',
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
    // }
    // 关联订单
    // {
    //   type: 'input',
    //   label: '上游单据编码',
    //   prop: 'orderNo',
    //   placeholder: '请输入上游单据编码',
    //   attrs: {
    //     class: '!w-240px',
    //     style: { width: '100%' },
    //     clearable: true
    //   }
    // },
    // {
    //   type: 'select',
    //   placeholder: '请选择结算账户',
    //   prop: 'accountId',
    //   label: '结算账户',
    //   attrs: {
    //     class: '!w-240px',
    //     filterable: true,
    //     clearable: true,
    //     style: {
    //       width: '100%'
    //     }
    //   },
    //   children: accountList
    // },
    // {
    //   type: 'select',
    //   placeholder: '请选择付款状态',
    //   prop: 'payStatus',
    //   label: '付款状态',
    //   attrs: {
    //     class: '!w-240px',
    //     filterable: true,
    //     clearable: true,
    //     style: {
    //       width: '100%'
    //     }
    //   },
    //   children: getIntDictOptions(DICT_TYPE.SRM_PAYMENT_STATUS)
    // },

    // refundStatus退款状态
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
