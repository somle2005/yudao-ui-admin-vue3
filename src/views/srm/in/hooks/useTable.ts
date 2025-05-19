import { useTableData } from '@/components/SmTable/src/utils'
import {
  useWholeOrderMergeCompute,
  useWholeOrder,
  createBranchOrder
} from '@/hooks/common/wholeOrder'
import { dateFormatter, dateFormatter2 } from '@/utils/formatTime'
import { mergeItemsToList } from '@/utils/transformData'
import { cloneDeep } from 'lodash-es'

/**
 * 
单据日期-1
单据编号-1
供应商-1
审核状态-1
付款状态-1
成交金额-1
产品编码-1
商品名称(产品名称)-1
海关品名
仓库-1
数量 -产品数量-1
含税单价-1
价税合计-1
申请人-1
申请部门-1
源单类型
源单单号
制单人-1
制单时间-1
审核人-1
审核时间-1

暂无
海关品名
 */

export const useTable = () => {
  const { tableOptions, transformTableOptions } = useTableData()

  const { wholeOrderMergeCompute, WHOLE_ORDER_TYPE } = useWholeOrderMergeCompute()

  // 带有items标记的都是整单不进行展示的-到时候直接进行遍历即可

  // 字段是不是从items里面取麻烦标明一下 各个状态的字典值记得取一下
  const fieldMap = {
    code: '单据编号', // 采购单编号
    noTime: {
      label: '单据日期',
      formatter: dateFormatter2, // 年月日-金蝶
      width: '200px'
    },
    inTime: {
      label: '入库时间',
      formatter: dateFormatter, // 年月日-金蝶
      width: '200px'
    },

    // items-product带出barCode 产品编码 name
    productBarCode: {
      label: '产品编码',
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },

    supplierName: '供应商',

    auditStatus: {
      label: '审核状态',
      slot: 'auditStatus',
      dictAttrs: { type: DICT_TYPE.SRM_AUDIT_STATUS }
    },

    // inStatus: {
    //   label: '入库状态',
    //   slot: 'inStatus',
    //   dictAttrs: { type: DICT_TYPE.SRM_STORAGE_STATUS }
    // },
    payStatus: {
      label: '付款状态',
      slot: 'payStatus',
      dictAttrs: { type: DICT_TYPE.SRM_PAYMENT_STATUS }
    },
    reconciliationStatus: {
      label: '对账状态',
      slot: 'reconciliationStatus'
    },
    rowPayStatus: {
      label: '行付款状态',
      slot: 'rowPayStatus',
      dictAttrs: { type: DICT_TYPE.SRM_PAYMENT_STATUS },
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },

    // rowPayStatus: {
    //   label: '行付款状态',
    //   slot: 'rowPayStatus',
    //   dictAttrs: { type: DICT_TYPE.SRM_PAYMENT_STATUS }
    // },

    // totalPrice最终合计价格  totalPrice = totalProductPrice + totalTaxPrice - discountPrice 最终合计价格
    totalPrice: {
      label: '成交金额',
      wholeOrderEnable: WHOLE_ORDER_TYPE.wholeOrder // 整单才进行展示
    },

    // 分行才展示
    itemTotalPrice: {
      label: '总价',
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },

    productName: {
      label: '产品名称',
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },
    // 海关品名 产品id里面有(能带出来吗)等后端

    declaredType: {
      label: '海关品名',
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },

    warehouseName: {
      label: '仓库',
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },

    qty: {
      label: '数量',
      wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute
    },

    actTaxPrice: {
      label: '含税单价',
      wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute
    },
    // taxPrice: {
    //   label: '税额',
    //   wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute
    // },
    allAmount: {
      label: '价税合计',
      wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute
    },

    applicantName: {
      label: '申请人',
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },
    applicationDeptName: {
      label: '申请部门',
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },
    source: '源单类型',
    orderNo: '源单单号',

    creator: '制单人',
    createTime: {
      label: '制单时间',
      formatter: dateFormatter,
      width: '200px'
    },

    auditorName: '审核人',
    auditTime: {
      label: '审核时间',
      formatter: dateFormatter,
      width: '200px'
    },

    // rowExecuteStatus: {
    //   label: '行执行状态',
    //   slot: 'rowExecuteStatus',
    //   dictAttrs: { type: DICT_TYPE.SRM_EXECUTE_STATUS },
    //   wholeOrderEnable: WHOLE_ORDER_TYPE.items
    // },
    // rowInStatus: {
    //   label: '行入库状态',
    //   slot: 'rowInStatus',
    //   dictAttrs: { type: DICT_TYPE.SRM_STORAGE_STATUS },
    //   wholeOrderEnable: WHOLE_ORDER_TYPE.items
    // },
    // rowPayStatus: {
    //   label: '行付款状态',
    //   slot: 'rowPayStatus',
    //   dictAttrs: { type: DICT_TYPE.SRM_PAYMENT_STATUS },
    //   wholeOrderEnable: WHOLE_ORDER_TYPE.items
    // },
    // rowOffStatus: {
    //   label: '行关闭状态',
    //   slot: 'rowOffStatus',
    //   dictAttrs: { type: DICT_TYPE.SRM_OFF_STATUS },
    //   wholeOrderEnable: WHOLE_ORDER_TYPE.items
    // },

    reviewComment: '审核意见',

    operate: {
      label: '操作',
      slot: 'operate',
      fixed: 'right',
      width: '220px'
    }
  }

  const allOptions = transformTableOptions(fieldMap)
  const wrapList = [
    'code',
    'supplierName',
    'productBarCode',
    'reviewComment',
    'productName',
    'remark',
    'orderNo',
    'warehouseName',
    'declaredType'
  ]
  allOptions.forEach((item: any) => {
    if (wrapList.includes(item.prop)) {
      item.slot = item.prop
      item.wrap = true
      item.width = '200px'
    }
  })

  tableOptions.value = createBranchOrder(cloneDeep(allOptions))

  const wholeOrderEnable = ref(false)
  const itemsList = ref<any[]>([])
  const wholeOrderList = ref<any[]>([])
  const itemsTotal = ref(0) // 分行的总页数
  const wholeOrderTotal = ref(0) // 整单总页数

  // 整单分行列表切换
  const switchList = (list: any, total, data: any) => {
    itemsTotal.value = data.itemsTotal || data.total
    wholeOrderTotal.value = data.total

    list.value = wholeOrderEnable.value ? wholeOrderList.value : itemsList.value
    total.value = wholeOrderEnable.value ? wholeOrderTotal.value : itemsTotal.value
  }

  return {
    allOptions,
    tableOptions,

    wholeOrderEnable,
    itemsList,
    wholeOrderList,
    itemsTotal,
    wholeOrderTotal,

    wholeOrderMergeCompute,
    mergeItemsToList,
    switchList,
    useWholeOrder
  }
}
