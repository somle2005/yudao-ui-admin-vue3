import request from '@/config/axios'

// 所有者库存 VO
export interface StockOwnershipVO {
  id: number // 主键
  warehouseId: number // 仓库ID
  productId: number // 产品ID
  productSku: string // 产品SKU
  inventorySubjectId: number // 库存主体ID
  inventoryOwnerId: number // 库存归属ID
  availableQuantity: number // 可用库存
  pendingOutboundQuantity: number // 待出库库存
}

// 所有者库存 API
export const StockOwnershipApi = {
  // 查询所有者库存分页
  getStockOwnershipPage: async (data: any) => {
    return await request.post({ url: `/wms/stock-ownership/page`, data })
  },

  // 查询所有者库存详情
  getStockOwnership: async (id: number) => {
    return await request.get({ url: `/wms/stock-ownership/get?id=` + id })
  },

  // 新增所有者库存
  createStockOwnership: async (data: StockOwnershipVO) => {
    return await request.post({ url: `/wms/stock-ownership/create`, data })
  },

  // 修改所有者库存
  updateStockOwnership: async (data: StockOwnershipVO) => {
    return await request.put({ url: `/wms/stock-ownership/update`, data })
  },

  // 删除所有者库存
  deleteStockOwnership: async (id: number) => {
    return await request.delete({ url: `/wms/stock-ownership/delete?id=` + id })
  },

  // 导出所有者库存 Excel
  exportStockOwnership: async (params) => {
    return await request.download({ url: `/wms/stock-ownership/export-excel`, params })
  },
}
