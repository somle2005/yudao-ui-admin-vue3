import { useTableData } from '@/components/SmTable/src/utils'
import {
  useWholeOrderMergeCompute,
  useWholeOrder,
  createWholeOrder,
  createBranchOrder
} from '@/hooks/common/wholeOrder'
import { dateFormatter, dateFormatter2 } from '@/utils/formatTime'
import { mergeItemsToList } from '@/utils/transformData'
import { cloneDeep } from 'lodash-es'

export const useTable = () => {
  const { tableOptions, transformTableOptions } = useTableData()

  const { wholeOrderMergeCompute, WHOLE_ORDER_TYPE } = useWholeOrderMergeCompute()

  // 带有items标记的都是整单不进行展示的-到时候直接进行遍历即可

  // 字段是不是从items里面取麻烦标明一下 各个状态的字典值记得取一下
  const fieldMap = {
    no: '单据编号', // 采购单编号
    noTime: {
      label: '单据日期',
      formatter: dateFormatter2, // 年月日-金蝶
      width: '200px'
    },

    // items-product带出barCode SKU name
    productBarCode: {
      label: 'SKU',
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },

    supplierName: '供应商',

    auditStatus: {
      label: '审核状态',
      slot: 'auditStatus',
      dictAttrs: { type: DICT_TYPE.ERP_AUDIT_STATUS }
    },

    // inStatus: {
    //   label: '入库状态',
    //   slot: 'inStatus',
    //   dictAttrs: { type: DICT_TYPE.ERP_STORAGE_STATUS }
    // },
    payStatus: {
      label: '付款状态',
      slot: 'payStatus',
      dictAttrs: { type: DICT_TYPE.ERP_PAYMENT_STATUS }
    },
    reconciliationStatus: {
      label: '对账状态',
      slot: 'reconciliationStatus'
    },
    rowPayStatus: {
      label: '行付款状态',
      slot: 'rowPayStatus',
      dictAttrs: { type: DICT_TYPE.ERP_PAYMENT_STATUS },
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },
    // totalPrice最终合计价格  totalPrice = totalProductPrice + totalTaxPrice - discountPrice 最终合计价格
    totalPrice: {
      label: '成交金额',
      wholeOrderEnable: WHOLE_ORDER_TYPE.wholeOrder // 整单才进行展示
    },

    productName: {
      label: '产品名称',
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },
    // 报关品名 产品id里面有(能带出来吗)等后端

    warehouseName: {
      label: '仓库',
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },

    count: {
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

    itemApplicantName: {
      label: '申请人',
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },
    itemApplicationDeptName: {
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
    reviewComment: '审核意见',

    // operate: {
    //   label: '操作',
    //   slot: 'operate',
    //   fixed: 'right',
    //   width: '220px'
    // }
  }

  const allOptions = transformTableOptions(fieldMap)
  const wrapList = [
    'no',
    'supplierName',
    'productBarCode',
    'reviewComment',
    'productName',
    'remark',
    'orderNo',
    'warehouseName'
  ]
  allOptions.forEach((item: any) => {
    if (wrapList.includes(item.prop)) {
      item.slot = item.prop
      item.wrap = true
      item.width = '200px'
    }
  })

  // tableOptions.value = createBranchOrder(cloneDeep(allOptions))
  tableOptions.value = createWholeOrder(cloneDeep(allOptions))
  

  // 退货单只能整单
  const wholeOrderEnable = ref(true)
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
