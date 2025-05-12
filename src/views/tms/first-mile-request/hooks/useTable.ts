import { useTableData } from '@/components/SmTable/src/utils'
import {
  useWholeOrderMergeCompute,
  useWholeOrder,
  createBranchOrder
} from '@/hooks/common/wholeOrder'
import { dateFormatter, dateFormatter2 } from '@/utils/formatTime'
import { formatDecimalFormatter } from '@/utils/num'
import { mergeItemsUpToList } from '@/utils/transformData'
import { cloneDeep } from 'lodash-es'

export const useTable = () => {
  const { tableOptions, transformTableOptions } = useTableData()

  const { wholeOrderMergeCompute, WHOLE_ORDER_TYPE } = useWholeOrderMergeCompute()

  // 带有items标记的都是整单不进行展示的-到时候直接进行遍历即可

  // 字段是不是从items里面取麻烦标明一下 各个状态的字典值记得取一下
  //   单据编码	"申请人
  // 申请部门"		目的仓	订购状态	关闭状态	产品总数量	总重量	总体积

  const fieldMap = {
    code: '单据编码',

    request: {
      label: '申请人 申请部门',
      slot: 'request'
    }, //申请人-申请部门
    // requestUserName: '申请人名称',
    // requestDeptName: '申请部门名称',

    toWarehouseName: '目的仓',
    orderStatus: {
      label: '订购状态',
      slot: 'orderStatus',
      dictAttrs: { type: DICT_TYPE.SRM_ORDER_STATUS }
    },
    offStatus: {
      label: '关闭状态',
      slot: 'offStatus',
      dictAttrs: { type: DICT_TYPE.SRM_OFF_STATUS }
    },
    itemCount: '产品总数量',
    totalWeight: '总重量(kg)',
    totalVolume: {
      label: '总体积(m³)',
      formatter: formatDecimalFormatter
    },

    auditStatus: {
      label: '审核状态',
      slot: 'auditStatus',
      dictAttrs: { type: DICT_TYPE.SRM_AUDIT_STATUS }
    },

    // 已订购数	销售公司	逻辑库存	采购在途数	包装长宽高	毛重	体积

    itemsBarCode: {
      label: '产品编码',
      width: '150px',
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },
    itemsFbaBarCode: {
      label: 'FBA条码',
      width: '150px',
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },
    itemsQty: '数量',
    itemsOrderStatus: {
      label: '行订购状态',
      slot: 'itemsOrderStatus',
      dictAttrs: { type: DICT_TYPE.SRM_ORDER_STATUS },
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },
    itemsOffStatus: {
      label: '行关闭状态',
      slot: 'itemsOffStatus',
      dictAttrs: { type: DICT_TYPE.SRM_OFF_STATUS },
      wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },

    orderClosedQty: '已订购数',
    salesCompanyName: '销售公司',
    package: {
      label: '包装长宽高',
      slot: 'package'
    },

    // 逻辑库存	采购在途数
    itemsPackageWeight: '毛重(kg)',
    itemsVolume: {
      label: '体积(m³)',
      formatter: formatDecimalFormatter
    },

    // comment: '审批意见',
    // remark: '备注',
    // updateTime: {
    //   label: '更新时间',
    //   formatter: dateFormatter,
    //   width: '200px'
    // },
    // updaterName: '更新人',
    // createTime: {
    //   label: '创建时间',
    //   formatter: dateFormatter,
    //   width: '200px'
    // },
    // creatorName: '创建人',
    operate: {
      label: '操作',
      slot: 'operate',
      fixed: 'right',
      width: '200px'
    }
  }
  const allOptions = transformTableOptions(fieldMap, {
    wrapList: ['code'],
    noComputePropList: ['code', 'auditStatus', 'orderStatus', 'offStatus', 'itemsBarCode']
  })

  tableOptions.value = createBranchOrder(cloneDeep(allOptions))

  const wholeOrderEnable = ref(false)
  const itemsList = ref<any[]>([])
  const wholeOrderList = ref<any[]>([])
  const itemsTotal = ref(0) // 分行的总页数
  const wholeOrderTotal = ref(0) // 整单总页数

  // 整单分行列表切换
  const switchList = (list: any, total, data: any) => {
    wholeOrderList.value = wholeOrderMergeCompute(data.list, allOptions)
    itemsList.value = mergeItemsUpToList(data.list)

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
    mergeItemsUpToList,
    switchList,
    useWholeOrder
  }
}
