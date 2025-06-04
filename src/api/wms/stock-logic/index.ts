import request from '@/config/axios'

// 所有者库存 VO
export interface StockLogicVO {
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
export const StockLogicApi = {
  // 查询所有者库存分页
  getStockLogicPage: async (data: any) => {
    return await request.post({ url: `/wms/stock-logic/page`, data })
  },

  // 查询所有者库存详情
  getStockLogic: async (id: number) => {
    return await request.get({ url: `/wms/stock-logic/get?id=` + id })
  },

  // 新增所有者库存
  createStockLogic: async (data: StockLogicVO) => {
    return await request.post({ url: `/wms/stock-logic/create`, data })
  },

  // 修改所有者库存
  updateStockLogic: async (data: StockLogicVO) => {
    return await request.put({ url: `/wms/stock-logic/update`, data })
  },

  // 删除所有者库存
  deleteStockLogic: async (id: number) => {
    return await request.delete({ url: `/wms/stock-logic/delete?id=` + id })
  },

  // 导出所有者库存 Excel
  exportStockLogic: async (data) => {
    return await request.download({ url: `/wms/stock-logic/export-excel`, data, method: 'POST' })
  },
}
