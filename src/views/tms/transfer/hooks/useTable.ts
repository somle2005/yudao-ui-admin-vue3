import { useTableData } from '@/components/SmTable/src/utils'
import { dateFormatter, dateFormatter2 } from '@/utils/formatTime'
import { cloneDeep } from 'lodash-es'

export const useTable = () => {
  const { tableOptions, transformTableOptions } = useTableData()

  /**
    没有整单分行的概念
   */

  // Time时间前缀会被自动转化
  const fieldMap = {
    code: '调拨单编码',
    fromWarehouseName: '调拨仓',
    toWarehouseName: '目的仓',

    traceNo: '跟踪号',

    auditStatus: {
      label: '状态',
      slot: 'auditStatus',
      dictAttrs: { type: DICT_TYPE.SRM_AUDIT_STATUS }
    },
    inboundStatus: {
      label: '入库状态',
      slot: 'inboundStatus',
      dictAttrs: { type: DICT_TYPE.WMS_INBOUND_STATUS }
    },
    outboundStatus: {
      label: '出库状态',
      slot: 'outboundStatus',
      dictAttrs: { type: DICT_TYPE.WMS_OUTBOUND_STATUS }
    },

    remark: '备注',
    // comment: '审批意见',

    updateTime: {
      label: '更新时间',
      formatter: dateFormatter,
      width: '180px'
    },
    updaterName: '更新人',
    creatorName: '创建人',
    createTime: {
      label: '创建时间',
      formatter: dateFormatter,
      width: '180px'
    },
    operate: {
      label: '操作',
      slot: 'operate',
      fixed: 'right',
      width: '200px'
    }
  }
  const allOptions = transformTableOptions(fieldMap, {
    wrapList: ['code'],
    noComputePropList: ['code', 'auditStatus']
  })

  tableOptions.value = allOptions

  return {
    tableOptions
  }
}
