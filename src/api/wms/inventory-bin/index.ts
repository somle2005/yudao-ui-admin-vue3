import request from '@/config/axios'

// 库位盘点 VO
export interface InventoryBinVO {
  id: number // 主键
  inventoryId: number // 盘点结果单ID
  productId: number // 产品ID
  expectedQty: number // 预期库存，仓位可用库存
  actualQuantity: number // 实际库存，实盘数量
  notes: string // 备注
}

export interface InventoryBinActualQtyVO {
  /**
   * 实际库存，实盘数量
   */
  actualQty?: number
  /**
   * 仓位ID
   */
  binId?: number
  /**
   * 预期库存，仓位可用库存
   */
  expectedQty?: number
  /**
   * 主键
   */
  id?: number
  /**
   * 盘点结果单ID
   */
  inventoryId?: number
  /**
   * 产品ID
   */
  productId?: number
  /**
   * 备注
   */
  remark?: string
}

// 库位盘点 API
export const InventoryBinApi = {
  // 查询库位盘点分页
  getInventoryBinPage: async (params: any) => {
    return await request.get({ url: `/wms/stock-check-bin/page`, params })
  },

  // 查询库位盘点详情
  getInventoryBin: async (id: number) => {
    return await request.get({ url: `/wms/stock-check-bin/get?id=` + id })
  },

  // 新增库位盘点
  createInventoryBin: async (data: InventoryBinVO) => {
    return await request.post({ url: `/wms/stock-check-bin/create`, data })
  },

  // 修改库位盘点
  updateInventoryBin: async (data: InventoryBinVO) => {
    return await request.put({ url: `/wms/stock-check-bin/update`, data })
  },

  // 删除库位盘点
  deleteInventoryBin: async (id: number) => {
    return await request.delete({ url: `/wms/stock-check-bin/delete?id=` + id })
  },

  // 导出库位盘点 Excel
  exportInventoryBin: async (params) => {
    return await request.download({ url: `/wms/stock-check-bin/export-excel`, params })
  },
  // 设置实际库存量
  updateInventoryBinActualQuantity: async (data: Array<InventoryBinActualQtyVO>) => {
    return await request.put({ url: `/wms/stock-check-bin/update-actual-quantity`, data })
  },

  //  追加盘点库位
  appendInventoryBin: async (data: Array<InventoryBinActualQtyVO>) => {
    return await request.post({ url: `/wms/stock-check-bin/append`, data })
  },

  //  导入盘点结果
  importInventoryBinExcel: async (data: any) => {
    return await request.upload({ url: `/wms/stock-check-bin/import-excel`, data })
  },

  //  导入盘点产品
  importInventoryProductExcel: async (data: any) => {
    return await request.upload({ url: `/wms/stock-check/import-excel`, data })
  },

  //  产品库位转换
  parseInventoryProductBin: async (data: any) => {
    return await request.upload({ url: `/wms/stock-check-bin/parse-product-bin`, data })
  },

  // 下载模板 盘点导入产品转换
  downloadInventoryBinProductTemplate: async (params) => {
    return await request.download({ url: `/wms/stock-check-bin/download-product-template`, params })
  },

  // 下载模板 盘点结果
  downloadInventoryBinTemplate: async (params) => {
    return await request.download({ url: `/wms/stock-check-bin/download-template`, params })
  }
}
