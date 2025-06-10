import request from '@/config/axios'

export interface StockLogicMoveVO {
  /**
   * 执行状态
   */
  executeStatus?: number
  /**
   * 主键
   */
  id?: number
  /**
   * 详情清单
   */
  itemList?: StockLogicMoveItemSaveReqVO[]
  /**
   * 单据号
   */
  no?: string
  /**
   * 仓库ID
   */
  warehouseId: number
}

export interface StockLogicMoveItemSaveReqVO {
  /**
   * 调出财务公司ID
   */
  fromCompanyId?: number
  /**
   * 调出部门ID
   */
  fromDeptId?: number
  /**
   * 主键
   */
  id?: number
  /**
   * 所有者移动表ID
   */
  logicMoveId: number
  /**
   * 产品ID
   */
  productId?: number
  /**
   * 移动数量
   */
  qty: number
  /**
   * 备注
   */
  remark?: string
  /**
   * 调入财务公司ID
   */
  toCompanyId?: number
  /**
   * 调入部门ID
   */
  toDeptId?: number
}

// 所有者库存 API
export const StockLogicMoveApi = {
  // 批量调归属 导入产品归属移动清单
  importStockLogicMove: async (data: any) => {
    return await request.upload({ url: `/wms/stock-logic-move/import-excel`, data })
  },

  // 调归属 创建所有者库存移动
  createStockLogicMove: async (data: StockLogicMoveVO) => {
    return await request.post({ url: `/wms/stock-logic-move/create`, data })
  },

  // 下载模板 库存归属
  downloadStockLogicMoveTemplate: async (params) => {
    return await request.download({ url: `/wms/stock-logic-move/download-template`, params })
  }
}
