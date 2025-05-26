import request from '@/config/axios'

// 盘点 VO
export interface InventoryVO {
  id: number // 主键
  no: string // 单据号
  warehouseId: number // 仓库ID
  auditStatus: number // 出库单审批状态 ; WmsInventoryAuditStatus : 0-起草中 , 1-待审批 , 2-已驳回 , 3-已通过
  creatorNotes: string // 创建者备注
  comment?: string // 审核意见
}


// 盘点 API
export const InventoryApi = {
  // 查询盘点分页
  getInventoryPage: async (data: any) => {
    return await request.post({ url: `/wms/inventory/page`, data })
  },

  // 查询盘点详情
  getInventory: async (id: number) => {
    return await request.get({ url: `/wms/inventory/get?id=` + id })
  },

  // 新增盘点
  createInventory: async (data: InventoryVO) => {
    return await request.post({ url: `/wms/inventory/create`, data })
  },

  // 修改盘点
  updateInventory: async (data: InventoryVO) => {
    return await request.put({ url: `/wms/inventory/update`, data })
  },

  // 删除盘点
  deleteInventory: async (id: number) => {
    return await request.delete({ url: `/wms/inventory/delete?id=` + id })
  },

  // 导出盘点 Excel
  exportInventory: async (params) => {
    return await request.download({ url: `/wms/inventory/export-excel`, params })
  },

  // 盘点提交审核
  submitInventoryAudit: async (data: { billId: number; comment?: string }) => {
    return await request.put({
      url: `/wms/inventory/submit`,
      data
    })
  },

  // 同意审核盘点
  agreeInventoryAuditStatus: async (data: { billId: number; comment?: string }) => {
    return await request.put({
      url: `/wms/inventory/agree`,
      data
    })
  },
  // 不同意审核盘点
  rejectInventoryAuditStatus: async (data: { billId: number; comment?: string }) => {
    return await request.put({
      url: `/wms/inventory/reject`,
      data
    })
  },

  // 作废盘点
  abandonInventory: async (data: { billId: number; comment?: string }) => {
    return await request.put({
      url: `/wms/inventory/abandon`,
      data
    })
  },
}
