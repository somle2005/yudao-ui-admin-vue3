import request from '@/config/axios'

// 仓库库存 VO
export interface StockWarehouseVO {
  id: number // 主键
  warehouseId: number // 仓库ID
  productId: string // 产品ID
  productSku: string // 产品SKU
  purchasePlanQuantity: number // 采购计划量
  purchaseTransitQuantity: number // 采购在途量
  returnTransitQuantity: number // 退件在途数量
  pendingShelvingQuantity: number // 待上架数量
  availableQuantity: number // 可用量，在库的良品数量
  sellableQuantity: number // 可售量，未被单据占用的良品数量
  pendingOutboundQuantity: number // 待出库量
  defectiveQuantity: number // 不良品数量
}

// 仓库库存 API
export const StockWarehouseApi = {
  // 查询仓库库存分页
  getStockWarehousePage: async (params: any) => {
    return await request.get({ url: `/wms/stock-warehouse/page`, params })
  },

  // 查询仓库库存详情
  getStockWarehouse: async (id: number) => {
    return await request.get({ url: `/wms/stock-warehouse/get?id=` + id })
  },

  // 新增仓库库存
  createStockWarehouse: async (data: StockWarehouseVO) => {
    return await request.post({ url: `/wms/stock-warehouse/create`, data })
  },

  // 修改仓库库存
  updateStockWarehouse: async (data: StockWarehouseVO) => {
    return await request.put({ url: `/wms/stock-warehouse/update`, data })
  },

  // 删除仓库库存
  deleteStockWarehouse: async (id: number) => {
    return await request.delete({ url: `/wms/stock-warehouse/delete?id=` + id })
  },

  // 导出仓库库存 Excel
  exportStockWarehouse: async (params) => {
    return await request.download({ url: `/wms/stock-warehouse/export-excel`, params })
  },
}