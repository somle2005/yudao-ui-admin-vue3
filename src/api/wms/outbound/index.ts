import request from '@/config/axios'

// 出库单 VO
export interface OutboundVO {
  id: number // 主键
  no: string // 单据号
  warehouseId: number // 仓库ID
  type: number // 类型
  status: string // 状态
  auditStatus: number // 审核状态
  sourceBillId: number // 来源单据ID
  sourceBillNo: string // 来源单据号
  sourceBillType: number // 来源单据类型
  remark: string // 备注，创建方专用
  comment?: string // 审核意见
  itemList: any[] 
}

// 出库单 API
export const OutboundApi = {
  // 查询出库单分页
  getOutboundPage: async (params: any) => {
    return await request.get({ url: `/wms/outbound/page`, params })
  },

  // 查询出库单详情
  getOutbound: async (id: number) => {
    return await request.get({ url: `/wms/outbound/get?id=` + id })
  },

  // 新增出库单
  createOutbound: async (data: OutboundVO) => {
    return await request.post({ url: `/wms/outbound/create`, data })
  },

  // 修改出库单
  updateOutbound: async (data: OutboundVO) => {
    return await request.put({ url: `/wms/outbound/update`, data })
  },

  // 删除出库单
  deleteOutbound: async (id: number) => {
    return await request.delete({ url: `/wms/outbound/delete?id=` + id })
  },

  // 导出出库单 Excel
  exportOutbound: async (params) => {
    return await request.download({ url: `/wms/outbound/export-excel`, params })
  },

  // 入库单提交审核
  submitOutboundAudit: async (data: { billId: number }) => {
    return await request.put({
      url: `/wms/outbound/submit`,
      data
    })
  },

  // 同意审核出库单
  agreeOutboundAuditStatus: async (data: { billId: number; comment?: string }) => {
    return await request.put({
      url: `/wms/outbound/agree`,
      data
    })
  },
  // 不同意审核出库单
  rejectOutboundAuditStatus: async (data: { billId: number; comment?: string }) => {
    return await request.put({
      url: `/wms/outbound/reject`,
      data
    })
  },

  // 完成出库单
  finishOutbound: async (data: { billId: number; comment?: string }) => {
    return await request.put({
      url: `/wms/outbound/finish`,
      data
    })
  }
}
