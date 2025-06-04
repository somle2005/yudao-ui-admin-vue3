import request from '@/config/axios'

// 盘点 VO
export interface StockCheckVO {
  id: number // 主键
  no: string // 单据号
  warehouseId: number // 仓库ID
  auditStatus: number // 出库单审批状态 ; WmsInventoryAuditStatus : 0-起草中 , 1-待审批 , 2-已驳回 , 3-已通过
  creatorNotes: string // 创建者备注
  comment?: string // 审核意见
}


// 盘点 API
export const StockCheckApi = {
  // 查询盘点分页
  getInventoryPage: async (data: any) => {
    return await request.post({ url: `/wms/stock-check/page`, data })
  },

  // 查询盘点详情
  getInventory: async (id: number) => {
    return await request.get({ url: `/wms/stock-check/get?id=` + id })
  },

  // 新增盘点
  createInventory: async (data: StockCheckVO) => {
    return await request.post({ url: `/wms/stock-check/create`, data })
  },

  // 修改盘点
  updateInventory: async (data: StockCheckVO) => {
    return await request.put({ url: `/wms/stock-check/update`, data })
  },

  // 删除盘点
  deleteInventory: async (id: number) => {
    return await request.delete({ url: `/wms/stock-check/delete?id=` + id })
  },

  // 导出盘点 Excel
  exportInventory: async (params) => {
    return await request.download({ url: `/wms/stock-check/export-excel`, params })
  },

  // 盘点提交审核
  submitInventoryAudit: async (data: { billId: number; comment?: string }) => {
    return await request.put({
      url: `/wms/stock-check/submit`,
      data
    })
  },

  // 同意审核盘点
  agreeInventoryAuditStatus: async (data: { billId: number; comment?: string }) => {
    return await request.put({
      url: `/wms/stock-check/agree`,
      data
    })
  },
  // 不同意审核盘点
  rejectInventoryAuditStatus: async (data: { billId: number; comment?: string }) => {
    return await request.put({
      url: `/wms/stock-check/reject`,
      data
    })
  },

  // 作废盘点
  abandonInventory: async (data: { billId: number; comment?: string }) => {
    return await request.put({
      url: `/wms/stock-check/abandon`,
      data
    })
  },
}
