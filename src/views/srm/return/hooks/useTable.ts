import { useTableData } from '@/components/SmTable/src/utils'
import { useWholeOrderMergeCompute, useWholeOrder, createBranchOrder } from '@/hooks/common/wholeOrder'
import { dateFormatter, dateFormatter2 } from '@/utils/formatTime'
import { mergeItemsToList } from '@/utils/transformData'
import { cloneDeep } from 'lodash-es'

/**
 * 
单据编号-1
单据日期-1
审核状态-1
退款状态-1 缺后端字典
供应商-1 
SKU编码-1
商品名称-1
仓库-1
数量-count产品数量
源单类型
源单单号
制单人-1
制单时间-1
审核人-1
审核时间-1
 */

export const useTable = () => {
  const { tableOptions, transformTableOptions } = useTableData()

  const { wholeOrderMergeCompute, WHOLE_ORDER_TYPE } = useWholeOrderMergeCompute()

  // 带有items标记的都是整单不进行展示的-到时候直接进行遍历即可

  // 字段是不是从items里面取麻烦标明一下 各个状态的字典值记得取一下
  const fieldMap = {
    no: '单据编号', // 退货单编号
    returnTime: {
      label: '单据日期', // 退货时间
      formatter: dateFormatter2, // 年月日-金蝶
      width: '200px'
    },

    // items-product带出barCode SKU name
    barCode: {
      label: 'SKU',
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },
  
    supplierName: '供应商',

    auditStatus: {
      label: '审核状态',
      slot: 'auditStatus',
      dictAttrs: { type: DICT_TYPE.SRM_AUDIT_STATUS }
    },

    refundStatus: {
      label: '退款状态', // 缺后端字典
      slot: 'refundStatus',
      dictAttrs: { type: DICT_TYPE.SRM_AUDIT_STATUS }
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
    // 海关品名 产品id里面有(能带出来吗)等后端

    warehouseName: {
      label: '仓库',
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },

    qty: {
      label: '数量',
      wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute
    },

    // actTaxPrice: {
    //   label: '含税单价',
    //   wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute
    // },
    // // taxPrice: {
    // //   label: '税额',
    // //   wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute
    // // },
    // allAmount: {
    //   label: '价税合计',
    //   wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute
    // },

    // itemApplicantName: {
    //   label: '申请人',
    //   wholeOrderEnable: WHOLE_ORDER_TYPE.items
    // },
    // itemApplicationDeptName: {
    //   label: '申请部门',
    //   wholeOrderEnable: WHOLE_ORDER_TYPE.items
    // },
    source: '源单类型',
    orderNo: '源单单号',

    creator: '制单人',
    createTime: {
      label: '制单时间',
      formatter: dateFormatter,
      width: '200px'
    },

    auditor: '审核人',
    auditTime: {
      label: '审核时间',
      formatter: dateFormatter,
      width: '200px'
    },

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
