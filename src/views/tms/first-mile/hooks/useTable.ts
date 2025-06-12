import { useTableData } from '@/components/SmTable/src/utils'
import { dateFormatter, dateFormatter2 } from '@/utils/formatTime'
import { formatDecimalFormatter } from '@/utils/num'
import { cloneDeep } from 'lodash-es'

export const useTable = () => {
  const { tableOptions, transformTableOptions } = useTableData()

  /**
    没有整单分行的概念
   */

  // Time时间前缀会被自动转化
  const fieldMap = {
    code: '单据编码',
    toWarehouseName: '目的仓',

    auditStatus: {
      label: '状态',
      slot: 'auditStatus',
      dictAttrs: { type: DICT_TYPE.SRM_AUDIT_STATUS }
    },

    outboundStatus: {
      label: '发货状态',
      slot: 'outboundStatus',
      dictAttrs: { type: DICT_TYPE.WMS_OUTBOUND_STATUS }
    },
    inboundStatus: {
      label: '入库状态',
      slot: 'inboundStatus',
      dictAttrs: { type: DICT_TYPE.WMS_INBOUND_STATUS }
    },

    cabinetType: {
      label: '柜型',
      slot: 'cabinetType',
      dictAttrs: { type: DICT_TYPE.TMS_CABINET_TYPE }
    },

    geometry: {
      label: '总箱数/数量/重量/体积',
      slot: 'geometry'
    },

    company: {
      label: '出口公司 中转公司',
      slot: 'company'
    },

    voyageNo: {
      label: '提单号 箱号 航次',
      slot: 'voyageNo'
    },

    loadOutbound: {
      label: '装柜日期 出库时间',
      slot: 'loadOutbound'
    },
    create: {
      label: '创建人 创建时间',
      width: '250px',
      slot: 'create'
    },

    // comment: '审批意见',
    // remark: '备注',
    // updateTime: {
    //   label: '更新时间',
    //   formatter: dateFormatter,
    //   width: '200px'
    // },
    // updaterName: '更新人',
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

  tableOptions.value = allOptions

  return {
    tableOptions,
  }
}
