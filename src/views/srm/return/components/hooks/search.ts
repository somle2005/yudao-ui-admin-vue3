import {
  getAccountList,
  getProductList,
  getSupplierList,
  getUserList,
  getWarehouseList
} from '@/commonData'
import { getWMSWarehouseList } from '@/commonData/wms'
import { FormOptions } from '@/components/SmForm/src/types/types'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'

export const useSearchForm = (handleQuery, queryParams) => {
  const productList = getProductList(null, { label: 'barCode', value: 'id' })
  const supplierList = getSupplierList()
  const searchFormOptions = ref<Array<FormOptions>>([
    // 入库单号
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

    {
      type: 'select',
      placeholder: '请选择供应商',
      prop: 'auditorId',
      label: '供应商',
      attrs: {
        class: '!w-240px',
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: supplierList
    },

    // {
    //   type: 'input',
    //   label: '上游单据编码',
    //   prop: 'orderCode',
    //   placeholder: '请输入上游单据编码',
    //   attrs: {
    //     class: '!w-240px',
    //     style: { width: '100%' },
    //     clearable: true
    //   }
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
      children: getIntDictOptions(DICT_TYPE.SRM_AUDIT_STATUS)
    },

    {
      type: 'select',
      placeholder: '请选择入库状态',
      prop: 'inStatus',
      label: '入库状态',
      attrs: {
        class: '!w-240px',
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: getIntDictOptions(DICT_TYPE.SRM_STORAGE_STATUS)
    },

    // {
    //   type: 'select',
    //   placeholder: '请选择行入库状态',
    //   prop: 'itemsInStatus',
    //   label: '行入库状态',
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
  })
  const getSearchFormData = () => {
    return queryParams
  }
  return {
    searchFormOptions,
    getSearchFormData
  }
}
