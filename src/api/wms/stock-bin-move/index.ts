import request from '@/config/axios'

// 库位移动 VO
export interface StockBinMoveVO {
  /**
   * 库存类型 ; WmsMoveExecuteStatus : 0-草稿 , 1-已执行
   */
  executeStatus?: number;
  /**
   * 主键
   */
  id?: number;
  /**
   * 详情清单
   */
  itemList?: WmsStockBinMoveItemSaveReqVO[];
  /**
   * 单据号
   */
  no?: string;
  /**
   * 仓库ID
   */
  warehouseId: number;
}

export interface WmsStockBinMoveItemSaveReqVO {
  /**
   * 库位移动表ID
   */
  binMoveId: number;
  /**
   * 调出库位ID
   */
  fromBinId?: number;
  /**
   * 主键
   */
  id?: number;
  /**
   * 产品ID
   */
  productId?: number;
  /**
   * 移动数量
   */
  qty: number;
  /**
   * 调入库位ID
   */
  toBinId?: number;
}


// 库位移动 API
export const StockBinMoveApi = {
  // 查询库位移动分页
  getStockBinMovePage: async (data: any) => {
    return await request.post({ url: `/wms/stock-bin-move/page`, data })
  },

  // 查询库位移动详情
  getStockBinMove: async (id: number) => {
    return await request.get({ url: `/wms/stock-bin-move/get?id=` + id })
  },

  // 新增库位移动
  createStockBinMove: async (data: StockBinMoveVO) => {
    return await request.post({ url: `/wms/stock-bin-move/create`, data })
  },
}
