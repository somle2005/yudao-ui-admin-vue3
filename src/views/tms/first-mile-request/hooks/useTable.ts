import { useTableData } from '@/components/SmTable/src/utils'
import {
  useWholeOrderMergeCompute,
  useWholeOrder,
  createBranchOrder
} from '@/hooks/common/wholeOrder'
import { dateFormatter, dateFormatter2 } from '@/utils/formatTime'
import { mergeItemsUpToList } from '@/utils/transformData'
import { cloneDeep } from 'lodash-es'

export const useTable = () => {
  const { tableOptions, transformTableOptions } = useTableData()

  const { wholeOrderMergeCompute, WHOLE_ORDER_TYPE } = useWholeOrderMergeCompute()

  // 带有items标记的都是整单不进行展示的-到时候直接进行遍历即可

  // 字段是不是从items里面取麻烦标明一下 各个状态的字典值记得取一下
  const fieldMap = {
    code: '单据编码',
    requestUserName: '申请人名称',
    requestDeptName: '申请部门名称',
    toWarehouseName: '目的仓名称',
    totalWeight: '总重量(kg)',
    totalVolume: '总体积(m³)',
    itemCount: '明细数量',

    auditStatus: {
      label: '审核状态',
      slot: 'auditStatus',
      dictAttrs: { type: DICT_TYPE.SRM_AUDIT_STATUS }
    },
    orderStatus: {
      label: '审核状态',
      slot: 'orderStatus',
      dictAttrs: { type: DICT_TYPE.SRM_ORDER_STATUS }
    },
    offStatus: {
      label: '关闭状态',
      slot: 'offStatus',
      dictAttrs: { type: DICT_TYPE.SRM_OFF_STATUS },
      // wholeOrderEnable: WHOLE_ORDER_TYPE.items
    },

    // comment: '审批意见',
    // remark: '备注',
    // updateTime: {
    //   label: '更新时间',
    //   formatter: dateFormatter,
    //   width: '200px'
    // },
    // updaterName: '更新人',
    createTime: {
      label: '创建时间',
      formatter: dateFormatter,
      width: '200px'
    },
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
    noComputePropList: ['code', 'auditStatus', 'orderStatus', 'offStatus']
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
