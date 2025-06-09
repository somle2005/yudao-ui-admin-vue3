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

  //   <el-table-column label="主键" align="center" prop="id" />
  // <el-table-column label="单据号" align="center" prop="code" />
  // <el-table-column label="类型" align="center" prop="type" />
  // <el-table-column label="调出仓库ID" align="center" prop="warehouseId" />
  // <el-table-column label="状态" align="center" prop="auditStatus" />
  // <el-table-column label="特别说明" align="center" prop="remark" />
  // <el-table-column
  //   label="创建时间"
  //   align="center"
  //   prop="createTime"
  //   :formatter="dateFormatter"
  //   width="180px"
  // />

  const fieldMap = {
    code: '单据编码',

    type: {
      label: '类型',
      width: '150px',
      slot: 'type',
      dictAttrs: { type: DICT_TYPE.WMS_EXCHANGE_TYPE }
    },

    auditStatus: {
      label: '状态',
      slot: 'auditStatus',
      dictAttrs: { type: DICT_TYPE.WMS_EXCHANGE_AUDIT_STATUS }
    },

    createTime: {
      label: '创建时间',
      formatter: dateFormatter,
      width: '180px'
    },

    remark: '备注',
    // comment: '审批意见',

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
    tableOptions
  }
}
