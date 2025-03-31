import {
  getAccountList,
  getProductList,
  getUserList,
  getWarehouseList
} from '@/commonData'
import { FormOptions } from '@/components/SmForm/src/types/types'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'

export const useSearchForm = (handleQuery, queryParams) => {
  const userList = getUserList()
  const productList = getProductList(null, { label: 'barCode', value: 'id' })
  const warehouseList = getWarehouseList()
  const accountList = getAccountList()
  const searchFormOptions = ref<Array<FormOptions>>([
    // 入库单号
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
    // 产品用SKU
    {
      type: 'select',
      placeholder: '请选择SKU',
      prop: 'productId',
      label: 'SKU',
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
      type: 'date-picker',
      placeholder: '请选择单据日期',
      prop: 'returnTime',
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
      children: warehouseList
    },

    // 制单人-创建人-注意后端是否处理了
    {
      type: 'select',
      placeholder: '请选择制单人',
      prop: 'creator',
      label: '制单人',
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
    // 关联订单
    // {
    //   type: 'input',
    //   label: '源单单号',
    //   prop: 'orderNo',
    //   placeholder: '请输入源单单号',
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
    //   children: getIntDictOptions(DICT_TYPE.ERP_PAYMENT_STATUS)
    // },
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
      children: getIntDictOptions(DICT_TYPE.ERP_AUDIT_STATUS)
    },
    // refundStatus退款状态
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
