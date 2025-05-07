import request from '@/config/axios'

// 库存流水 VO
export interface StockFlowVO {
  id: number // 主键
  stockType: number // 库存类型
  stockId: number // 库存ID，分别指向三张库存表的ID
  reason: number // 流水发生的原因
  reasonBillId: number // 流水触发的单据ID
  reasonItemId: number // 流水触发的单据下对应的明细ID
  prevFlowId: number // 前一个流水ID
  deltaQuantity: number // 变更量
  purchasePlanQuantity: number // 采购计划量
  purchaseTransitQuantity: number // 采购在途量
  returnTransitQuantity: number // 退件在途数量
  pendingShelvingQuantity: number // 待上架数量
  availableQuantity: number // 可用量，在库的良品数量
  sellableQuantity: number // 可售量，未被单据占用的良品数量
  pendingOutboundQuantity: number // 待出库量
  defectiveQuantity: number // 不良品数量
  flowTime: Date // 流水发生的时间
}

// 库存流水 API
export const StockFlowApi = {
  // 查询库存流水分页
  getStockFlowPage: async (params: any) => {
    return await request.get({ url: `/wms/stock-flow/page`, params })
  },

  // 查询库存流水详情
  getStockFlow: async (id: number) => {
    return await request.get({ url: `/wms/stock-flow/get?id=` + id })
  },

  // 新增库存流水
  createStockFlow: async (data: StockFlowVO) => {
    return await request.post({ url: `/wms/stock-flow/create`, data })
  },

  // 修改库存流水
  updateStockFlow: async (data: StockFlowVO) => {
    return await request.put({ url: `/wms/stock-flow/update`, data })
  },

  // 删除库存流水
  deleteStockFlow: async (id: number) => {
    return await request.delete({ url: `/wms/stock-flow/delete?id=` + id })
  },

  // 导出库存流水 Excel
  exportStockFlow: async (params) => {
    return await request.download({ url: `/wms/stock-flow/export-excel`, params })
  },

  // 获得所有者库存流水分页
  getStockFlowPageOwnership: async (data: any) => {
    return await request.post({ url: `/wms/stock-flow/page-ownership`, data })
  },

  // 获得仓库库存流水分页
  getStockFlowPageWarehouse: async (data: any) => {
    return await request.post({ url: `/wms/stock-flow/page-warehouse`, data })
  },

  // 获得仓位库存流水分页
  getStockFlowPageBin: async (data: any) => {
    return await request.post({ url: `/wms/stock-flow/page-bin`, data })
  },

  // 导出库位库存流水 Excel
  exportStockFlowBin: async (data) => {
    return await request.download({
      url: `/admin-api/wms/stock-flow/export-bin`,
      data,
      method: 'POST'
    })
  },

  // 导出仓库库存流水 Excel
  exportStockFlowWarehouse: async (data) => {
    return await request.download({
      url: `/wms/stock-flow/export-warehouse`,
      data,
      method: 'POST'
    })
  },

  // 导出所有者库位库存流水 Excel
  exportStockFlowOwnership: async (data) => {
    return await request.download({
      url: `/wms/stock-flow/export-ownership`,
      data,
      method: 'POST'
    })
  }
}
