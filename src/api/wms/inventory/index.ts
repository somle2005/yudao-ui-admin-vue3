import request from '@/config/axios'

// 盘点 VO
export interface InventoryVO {
  id: number // 主键
  no: string // 单据号
  warehouseId: number // 仓库ID
  auditStatus: number // 出库单审批状态 ; WmsInventoryAuditStatus : 0-起草中 , 1-待审批 , 2-已驳回 , 3-已通过
  creatorNotes: string // 创建者备注
}

// 盘点 API
export const InventoryApi = {
  // 查询盘点分页
  getInventoryPage: async (params: any) => {
    return await request.get({ url: `/wms/inventory/page`, params })
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
}