import request from '@/config/axios'

export interface StockOwnershipMoveVO {
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
  itemList?: WmsStockOwnershipMoveItemSaveReqVO[]
  /**
   * 单据号
   */
  no?: string
  /**
   * 仓库ID
   */
  warehouseId: number
}

export interface WmsStockOwnershipMoveItemSaveReqVO {
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
  ownershipMoveId: number
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
export const StockOwnershipMoveApi = {
  // 批量调归属 导入产品归属移动清单
  importStockOwnershipMove: async (data: any) => {
    return await request.upload({ url: `/wms/stock-ownership-move/import-excel`, data })
  },

  // 调归属 创建所有者库存移动
  createStockOwnershipMove: async (data: StockOwnershipMoveVO) => {
    return await request.post({ url: `/wms/stock-ownership-move/create`, data })
  }
}
