import { getProductList } from '@/commonData'
import { getWMSWarehouseList } from '@/commonData/wms'
import { FormOptions } from '@/components/SmForm/src/types/types'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'

export const useSearchForm = (handleQuery, queryParams) => {
  const WMSWarehouseList = getWMSWarehouseList()
  const productList = getProductList() // 产品列表
  const searchFormOptions = ref<Array<FormOptions>>([
    {
      type: 'input',
      label: '入库单号',
      prop: 'code',
      placeholder: '请输入入库单号',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    // {
    //   type: 'input',
    //   label: '上游单据编号',
    //   prop: 'upstreamCode',
    //   placeholder: '请输入上游单据编号',
    //   attrs: {
    //     style: { width: '100%' },
    //     clearable: true
    //   }
    // },
    {
      type: 'select',
      placeholder: '请选择产品编码',
      prop: 'productId',
      label: '产品编码',
      attrs: {
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: productList
    },
    {
      type: 'select',
      label: '仓库',
      prop: 'warehouseId',
      placeholder: '请选择仓库',
      attrs: {
        style: { width: '100%' },
        filterable: true,
        clearable: true
      },
      children: WMSWarehouseList
    },
    {
      type: 'select',
      placeholder: '请选择类型',
      prop: 'type',
      label: '类型',
      attrs: {
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: getIntDictOptions(DICT_TYPE.WMS_INBOUND_TYPE)
    },
    // {
    //   type: 'select',
    //   placeholder: '请选择状态',
    //   prop: 'status',
    //   label: '状态',
    //   attrs: {
    //     filterable: true,
    //     clearable: true,
    //     style: {
    //       width: '100%'
    //     }
    //   },
    //   children: getIntDictOptions(DICT_TYPE.WMS_INBOUND_STATUS)
    // },
    {
      type: 'select',
      placeholder: '请选择状态',
      prop: 'auditStatus',
      label: '状态',
      attrs: {
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: getIntDictOptions(DICT_TYPE.WMS_INBOUND_AUDIT_STATUS)
    },
    {
      type: 'input',
      label: '跟踪号',
      prop: 'traceNo',
      placeholder: '请输入跟踪号',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'select',
      placeholder: '请选择运输方式',
      prop: 'shippingMethod',
      label: '运输方式',
      attrs: {
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: getIntDictOptions(DICT_TYPE.WMS_SHIPPING_METHOD)
    },
    {
      type: 'date-picker',
      placeholder: '请选择创建时间',
      prop: 'createTime',
      label: '创建时间',
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
    // {
    //   type: 'date-picker',
    //   placeholder: '请选择计划到货时间',
    //   prop: 'arrivalPlanTime',
    //   label: '计划到货时间',
    //   attrs: {
    //     clearable: true,
    //     type: 'date',
    //     'value-format': 'x',
    //     class: '!w-1/1',
    //     style: {
    //       width: '100%'
    //     }
    //   }
    // },
    {
      type: 'input',
      label: '特别说明',
      prop: 'remark',
      placeholder: '请输入特别说明',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    // {
    //   type: 'input-number',
    //   label: '初始库龄',
    //   prop: 'initAge',
    //   placeholder: '请输入初始库龄',
    //   attrs: {
    //     style: { width: '100%' },
    //     clearable: true,
    //     min: 0
    //   }
    // },
    {
      colConfig: { span: 24 },
      slot: 'items',
      formItemConfig: {
        class: 'common-form-items'
      }
    }
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
