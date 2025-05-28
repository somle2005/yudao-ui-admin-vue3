import request from '@/config/axios'

// 调拨单 VO
export interface TransferVO {
  code: string // 调拨单编码
  fromWarehouseId: number // 发出仓库ID
  toWarehouseId: number // 目的仓库ID
  remark: string // 备注
  traceNo: string // 跟踪号
  items: any[]
}

export interface TransferAuditVO {
  /**
   * 审核意见
   */
  auditAdvice?: string
  /**
   * 调拨主表ID
   */
  id: number
  /**
   * 通过与否
   * 审核通过/不通过
   */
  pass: boolean
  /**
   * 审核/反审核
   * 审核通过/审核撤销
   */
  reviewed: boolean
}

// 调拨单 API
export const TransferApi = {
  // 查询调拨单分页
  getTransferPage: async (data: any) => {
    return await request.post({ url: `/tms/transfer/page`, data })
  },

  // 查询调拨单详情
  getTransfer: async (id: number) => {
    return await request.get({ url: `/tms/transfer/get?id=` + id })
  },

  // 新增调拨单
  createTransfer: async (data: TransferVO) => {
    return await request.post({ url: `/tms/transfer/create`, data })
  },

  // 修改调拨单
  updateTransfer: async (data: TransferVO) => {
    return await request.put({ url: `/tms/transfer/update`, data })
  },

  // 删除调拨单
  deleteTransfer: async (id: number) => {
    return await request.delete({ url: `/tms/transfer/delete?id=` + id })
  },

  // 导出调拨单 Excel
  exportTransfer: async (params) => {
    return await request.download({ url: `/tms/transfer/export-excel`, params })
  },

  // ==================== 子表（调拨单明细） ====================

  // 获得调拨单明细列表
  getTransferItemListByTransferId: async (transferId) => {
    return await request.get({
      url: `/tms/transfer/transfer-item/list-by-transfer-id?transferId=` + transferId
    })
  },

  // 调拨单提交审核
  submitTransferAudit: async (data: number[]) => {
    return await request.put({ url: `/tms/transfer/submit-audit`, data })
  },

  // 调拨单审核/反审核
  auditTransferStatus: async (data: TransferAuditVO) => {
    return await request.put({ url: `/tms/transfer/audit-status`, data })
  },

  // 调拨单开关
  updateTransferoffStatus: async (data: { itemIds: number[]; enable: boolean }) => {
    return await request.put({ url: `/tms/transfer/off-status`, data })
  }
}
