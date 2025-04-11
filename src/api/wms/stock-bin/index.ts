import request from '@/config/axios'

// 仓位库存 VO
export interface StockBinVO {
  id: number // 主键
  warehouseId: number // 仓库ID
  binId: number // 库位ID
  productId: string // 产品ID
  availableQty: number // 可用量，在库的良品数量
  sellableQty: number // 可售量，未被单据占用的良品数量
  outboundPendingQty: number // 待出库量
}

// 仓位库存 API
export const StockBinApi = {
  // 查询仓位库存分页
  getStockBinPage: async (data: any) => {
    return await request.post({ url: `/wms/stock-bin/page`, data })
  },

  // 查询仓位库存详情
  getStockBin: async (id: number) => {
    return await request.get({ url: `/wms/stock-bin/get?id=` + id })
  },

  // 新增仓位库存
  createStockBin: async (data: StockBinVO) => {
    return await request.post({ url: `/wms/stock-bin/create`, data })
  },

  // 修改仓位库存
  updateStockBin: async (data: StockBinVO) => {
    return await request.put({ url: `/wms/stock-bin/update`, data })
  },

  // 删除仓位库存
  deleteStockBin: async (id: number) => {
    return await request.delete({ url: `/wms/stock-bin/delete?id=` + id })
  },

  // 导出仓位库存 Excel
  exportStockBin: async (params) => {
    return await request.download({ url: `/wms/stock-bin/export-excel`, params })
  },
}
