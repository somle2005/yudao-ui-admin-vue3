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
  getStockCheckPage: async (data: any) => {
    return await request.post({ url: `/wms/stock-check/page`, data })
  },

  // 查询盘点详情
  getStockCheck: async (id: number) => {
    return await request.get({ url: `/wms/stock-check/get?id=` + id })
  },

  // 新增盘点
  createStockCheck: async (data: StockCheckVO) => {
    return await request.post({ url: `/wms/stock-check/create`, data })
  },

  // 修改盘点
  updateStockCheck: async (data: StockCheckVO) => {
    return await request.put({ url: `/wms/stock-check/update`, data })
  },

  // 删除盘点
  deleteStockCheck: async (id: number) => {
    return await request.delete({ url: `/wms/stock-check/delete?id=` + id })
  },

  // 导出盘点 Excel
  exportStockCheck: async (params) => {
    return await request.download({ url: `/wms/stock-check/export-excel`, params })
  },

  // 盘点提交审核
  submitStockCheckAudit: async (data: { billId: number; comment?: string }) => {
    return await request.put({
      url: `/wms/stock-check/submit`,
      data
    })
  },

  // 同意审核盘点
  agreeStockCheckAuditStatus: async (data: { billId: number; comment?: string }) => {
    return await request.put({
      url: `/wms/stock-check/agree`,
      data
    })
  },
  // 不同意审核盘点
  rejectStockCheckAuditStatus: async (data: { billId: number; comment?: string }) => {
    return await request.put({
      url: `/wms/stock-check/reject`,
      data
    })
  },

  // 作废盘点
  abandontStockCheck: async (data: { billId: number; comment?: string }) => {
    return await request.put({
      url: `/wms/stock-check/abandon`,
      data
    })
  },
}
