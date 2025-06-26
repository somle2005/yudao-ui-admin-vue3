import { useTableData } from '@/components/SmTable/src/utils'
import {
  useWholeOrderMergeCompute,
  useWholeOrder,
  createBranchOrder,
  useWholeOrderMergeComputeUp
} from '@/hooks/common/wholeOrder'
import { dateFormatter, dateFormatter2 } from '@/utils/formatTime'
import { mergeItemsToList, mergeItemsUpToList } from '@/utils/transformData'
import { transformVolumeColumn, transformVolumeNum } from '@/views/tms/common/utils'
import { cloneDeep } from 'lodash-es'

/**
 * 
单据编码-1
单据日期-1
审核状态-1
退款状态-1 缺后端字典
供应商-1 
产品编码编码-1
商品名称-1
仓库-1
数量-count产品数量
源单类型
上游单据编码
制单人-1
制单时间-1
审核人-1
审核时间-1
 */

export const useTable = () => {
  const { tableOptions, transformTableOptions } = useTableData()

  const { wholeOrderMergeCompute, WHOLE_ORDER_TYPE } = useWholeOrderMergeComputeUp()

  // 带有items标记的都是整单不进行展示的-到时候直接进行遍历即可

  // 字段是不是从items里面取麻烦标明一下 各个状态的字典值记得取一下
  const fieldMap = {
    returnTime: {
      label: '单据日期', // 退货时间
      formatter: dateFormatter2, // 年月日-金蝶
      width: '160px'
    },
    code: '单据编码', // 退货单编号
    supplierName: '供应商',

    auditStatus: {
      label: '审核状态',
      slot: 'auditStatus',
      dictAttrs: { type: DICT_TYPE.SRM_AUDIT_STATUS }
    },

    outboundStatus: {
      label: '出库状态',
      slot: 'outboundStatus',
      dictAttrs: { type: DICT_TYPE.SRM_OUTBOUND_STATUS }
    },

    itemsOutboundStatus: {
      label: '行出库状态',
      slot: 'itemsOutboundStatus',
      dictAttrs: { type: DICT_TYPE.SRM_OUTBOUND_STATUS }
    },

    totalPrice: '采购总价', // 汇总该退货单的总金额
    totalReturnCount: '退货数',
    // totalItemsQty: '退货数',

    totalWeight: '总毛重',
    totalVolume: {
      label: '总体积(m³)',
      hideSort: true
      // formatter: transformVolumeColumn
    },

    // 下面是分行内容
    // 产品编码	产品名称	仓库	数量	箱率	单价	含税单价	税额	价税合计	上游单据编码	申请部门

    // items-product带出barCode 产品编码 name
    itemsProductCode: {
      label: '产品编码',
      width: '160px',
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },
    itemsProductName: {
      label: '产品名称',
      width: '200px',
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },
    itemsWarehouseName: {
      label: '仓库',
      width: '100px',
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },

    itemsQty: {
      label: '数量',
      totalItemsKey: 'totalItemsQty',
      wholeOrderEnable: [WHOLE_ORDER_TYPE.mergeCompute, WHOLE_ORDER_TYPE.items]
    },
    itemsContainerRate: {
      label: '箱率',
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },

    // 行才展示这些价格就不汇总计算了-接口items里面有返回
    itemsProductPrice: {
      label: '单价',
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },

    itemsGrossPrice: {
      label: '含税单价',
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },
    itemsTax: {
      label: '税额',
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },

    itemsGrossTotalPrice: {
      label: '价税合计',
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },
    // itemsApplicantName: {
    //   label: '申请人',
    //   wholeOrderEnable: WHOLE_ORDER_TYPE.items
    // },
    itemsArriveCode: {
      label: '上游单据编码',
      width: '200px',
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },
    itemsApplicationDeptName: {
      label: '申请部门',
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },

    // refundStatus: {
    //   label: '退款状态', // 缺后端字典
    //   slot: 'refundStatus',
    //   dictAttrs: { type: DICT_TYPE.SRM_AUDIT_STATUS }
    // },

    // totalPrice最终合计价格  totalPrice = totalProductPrice + totalGrossPrice - discountPrice 最终合计价格
    // totalPrice: {
    //   label: '成交金额'
    //   // wholeOrderEnable: WHOLE_ORDER_TYPE.wholeOrder // 整单才进行展示
    // },

    // 海关品名 产品id里面有(能带出来吗)等后端

    // grossPrice: {
    //   label: '含税单价',
    //   wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute
    // },
    // // tax: {
    // //   label: '税额',
    // //   wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute
    // // },
    // grossTotalPrice: {
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
    // source: '源单类型',
    // orderNo: '上游单据编码',

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

    auditAdvice: '审核意见',

    operate: {
      label: '操作',
      slot: 'operate',
      fixed: 'right',
      width: '220px'
    }
  }

  const allOptions = transformTableOptions(fieldMap, {
    noComputePropList: [
      'code',
      'itemsProductCode',
      'supplierName',
      'warehouseName',
      'itemsProductCode',
      'itemsProductName',
      'itemsWarehouseName'
    ]
  })
  const wrapList = [
    'code',
    'supplierName',
    'productCode',
    'auditAdvice',
    'productName',
    'remark',
    // 'orderNo',
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
    data.list.forEach((item) => {
      item.totalVolume = transformVolumeNum(item.totalVolume)
    })

    itemsList.value = mergeItemsUpToList(data.list, 'items')
    // todo取出items里面对应对象数据
    wholeOrderList.value = wholeOrderMergeCompute(data.list, allOptions)
    itemsList.value = wholeOrderMergeCompute(itemsList.value, allOptions)

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

    switchList,
    useWholeOrder
  }
}
