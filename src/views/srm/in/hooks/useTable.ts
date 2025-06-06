import { useTableData } from '@/components/SmTable/src/utils'
import {
  useWholeOrderMergeCompute,
  useWholeOrder,
  createBranchOrder,
  useWholeOrderMergeComputeUp
} from '@/hooks/common/wholeOrder'
import { dateFormatter, dateFormatter2 } from '@/utils/formatTime'
import { mergeItemsToList, mergeItemsUpToList } from '@/utils/transformData'
import { transformVolumeColumn } from '@/views/tms/common/utils'
import { cloneDeep } from 'lodash-es'

/**
 * 
单据日期-1
单据编码-1
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
上游单据编码
制单人-1
制单时间-1
审核人-1
审核时间-1

暂无
海关品名


单据日期	单据编码	供应商	审核状态	入库状态	金额	数量	总毛重	总体积	创建人	创建日期	审核人	审核日期
 */

export const useTable = () => {
  const { tableOptions, transformTableOptions } = useTableData()

  const { wholeOrderMergeCompute, WHOLE_ORDER_TYPE } = useWholeOrderMergeComputeUp()

  // 带有items标记的都是整单不进行展示的-到时候直接进行遍历即可

  // 字段是不是从items里面取麻烦标明一下 各个状态的字典值记得取一下
  const fieldMap = {
    itemsId: {
      label: '行编号',
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },
    billTime: {
      label: '单据日期',
      formatter: dateFormatter2, // 年月日-金蝶
      width: '120px'
    },
    code: {
      label: '单据编码',
      width: '200px'
    }, // 采购单编号

    itemsOrderCode: {
      label: '上游单据编码',
      width: '200px',
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },
    supplierName: '供应商',

    // 状态字段好像缺失了
    auditStatus: {
      label: '审核状态',
      slot: 'auditStatus',
      dictAttrs: { type: DICT_TYPE.SRM_AUDIT_STATUS }
    },

    inboundStatus: {
      label: '入库状态',
      slot: 'inboundStatus',
      dictAttrs: { type: DICT_TYPE.SRM_STORAGE_STATUS }
      // wholeOrderEnable: WHOLE_ORDER_TYPE.wholeOrder // 入库状态
    },
    itemsInboundStatus: {
      label: '行入库状态',
      slot: 'itemsInboundStatus',
      dictAttrs: { type: DICT_TYPE.SRM_STORAGE_STATUS },
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },

    // 最终合计价格（= 产品价格合计 + 税额合计 - 折扣金额 + 其他金额）  totalPrice-和行合并的值不一致
    // 目前是前端计算出给后端的totalPrice 没有扣除其他金额-折扣=== 所以如果要扣除也无法扣除目前做的这个折扣是总的-后端也无法进行计算-分行似乎无法展示准确扣除的
    totalPrice: {
      label: '金额',
      width: '100px'
      // label: '成交金额',
      // wholeOrderEnable: WHOLE_ORDER_TYPE.wholeOrder // 整单才进行展示
    },

    totalItemsQty: '总数量',

    // 分行才展示
    // itemsTotalPrice: {
    //   // label: '总价',
    //   label: '金额',
    //   wholeOrderEnable: WHOLE_ORDER_TYPE.items
    // },

    totalWeight: '总毛重',
    totalVolume: {
      label: '总体积(m³)',
      hideSort: true,
      formatter: transformVolumeColumn
    },

    // payStatus: {
    //   label: '付款状态',
    //   slot: 'payStatus',
    //   dictAttrs: { type: DICT_TYPE.SRM_PAYMENT_STATUS }
    // },
    // itemsPayStatus: {
    //   label: '行付款状态',
    //   slot: 'itemsPayStatus',
    //   dictAttrs: { type: DICT_TYPE.SRM_PAYMENT_STATUS },
    //   wholeOrderEnable: WHOLE_ORDER_TYPE.items
    // },

    // 产品编码	产品名称	仓库	数量	实际数量	订单数量	箱率	单价	含税单价	税额	价税合计	申请部门	创建人	创建日期	审核人	审核日期

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

    itemsActualQty: {
      label: '实际入库数量',
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
      // wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute
    },
    itemsOrderQty: {
      label: '订单数量',
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },

    itemsContainerRate: {
      label: '箱率',
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },
    itemsProductPrice: {
      label: '单价',
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },

    // 海关品名 产品id里面有(能带出来吗)等后端

    itemsDeclaredType: {
      label: '海关品名',
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },

    // 行才展示这些价格就不汇总计算了-接口items里面有返回
    itemsActTaxPrice: {
      label: '含税单价',
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
      // wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute
    },
    itemsTaxPrice: {
      label: '税额',
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
      // wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute
    },
    itemsGrossTotalPrice: {
      label: '价税合计',
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
      // wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute
    },

    itemsApplicantName: {
      label: '申请人',
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },
    itemsApplicationDeptName: {
      label: '申请部门',
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },

    // source: '源单类型',
    // orderNo: '上游单据编码',
    auditAdvice: '审核意见',
    creatorName: '制单人',
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

    // arriveTime: {
    //   label: '入库时间',
    //   formatter: dateFormatter, // 年月日-金蝶
    //   width: '200px'
    // },

    // items-product带出barCode 产品编码 name
    // productCode: {

    // reconciliationStatus: {
    //   label: '对账状态',
    //   slot: 'reconciliationStatus'
    // },

    // itemsPayStatus: {
    //   label: '行付款状态',
    //   slot: 'itemsPayStatus',
    //   dictAttrs: { type: DICT_TYPE.SRM_PAYMENT_STATUS }
    // },

    // totalPrice最终合计价格  totalPrice = totalProductPrice + totalGrossPrice - discountPrice 最终合计价格

    // itemsExecuteStatus: {
    //   label: '行执行状态',
    //   slot: 'itemsExecuteStatus',
    //   dictAttrs: { type: DICT_TYPE.SRM_EXECUTE_STATUS },
    //   wholeOrderEnable: WHOLE_ORDER_TYPE.items
    // },
    // itemsInboundStatus: {
    //   label: '行入库状态',
    //   slot: 'itemsInboundStatus',
    //   dictAttrs: { type: DICT_TYPE.SRM_STORAGE_STATUS },
    //   wholeOrderEnable: WHOLE_ORDER_TYPE.items
    // },
    // itemsPayStatus: {
    //   label: '行付款状态',
    //   slot: 'itemsPayStatus',
    //   dictAttrs: { type: DICT_TYPE.SRM_PAYMENT_STATUS },
    //   wholeOrderEnable: WHOLE_ORDER_TYPE.items
    // },
    // itemsOffStatus: {
    //   label: '行关闭状态',
    //   slot: 'itemsOffStatus',
    //   dictAttrs: { type: DICT_TYPE.SRM_OFF_STATUS },
    //   wholeOrderEnable: WHOLE_ORDER_TYPE.items
    // },

    operate: {
      label: '操作',
      slot: 'operate',
      fixed: 'right',
      width: '220px'
    }
  }

  const allOptions = transformTableOptions(fieldMap, {
    allWrap: true,
    noComputePropList: [
      'code',
      'itemsProductCode',
      'supplierName',
      'warehouseName',
      'totalPrice',
      'itemsProductName',
      'itemsWarehouseName'
    ]
  })

  // const wrapList = [
  //   'code',
  //   'supplierName',
  //   'productCode',
  //   'auditAdvice',
  //   'productName',
  //   'remark',
  //   'orderNo',
  //   'warehouseName',
  //   'declaredType'
  // ]
  // allOptions.forEach((item: any) => {
  //   if (wrapList.includes(item.prop)) {
  //     item.slot = item.prop
  //     item.wrap = true
  //     item.width = '200px'
  //   }
  // })

  tableOptions.value = createBranchOrder(cloneDeep(allOptions))

  const wholeOrderEnable = ref(false)
  const itemsList = ref<any[]>([])
  const wholeOrderList = ref<any[]>([])
  const itemsTotal = ref(0) // 分行的总页数
  const wholeOrderTotal = ref(0) // 整单总页数

  // 整单分行列表切换
  const switchList = (list: any, total, data: any) => {
    /**
     * 防止后期值不明确来自哪里-统一命名-1
     * WHOLE_ORDER_TYPE.items-状态下的值都需要同步更名-1
     * 采购到货作为可选列表带出的数据-采购退货也需要进行注意带出的值
     * PurchaseInPaymentEnableList-可选列表值也要注意修改
     * 如果有别名id注意自己进行适配
     */

    wholeOrderList.value = wholeOrderMergeCompute(data.list, allOptions)
    itemsList.value = mergeItemsUpToList(data.list, 'items', { qty: 'itemsQty1' })
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
