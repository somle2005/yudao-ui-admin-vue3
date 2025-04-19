import request from '@/config/axios'

// 出库单详情 VO
export interface OutboundItemVO {
  id: number // 主键
  outboundId: number // 入库单ID
  productId: number // 标准产品ID
  productSku: string // 标准产品SKU
  expectedQty: number // 预期量
  actualQty: number // 实际量
  sourceItemId: number // 来源详情ID
}

export interface OutboundItemActualQtyVO {
  /**
   * 实际出库量
   */
  actualQuantity?: number
  /**
   * 出库库位ID
   */
  binId?: number
  /**
   * 主键
   */
  id: number
  /**
   * 入库单ID
   */
  outboundId?: number
  /**
   * 出库状态 ; OutboundStatus : 0-未出库 , 1-部分出库 , 2-已出库
   */
  outboundStatus?: number
  /**
   * 计划出库量
   */
  planQuantity?: number
  /**
   * 标准产品ID
   */
  productId: number
  /**
   * 来源详情ID
   */
  sourceItemId?: number
}

// 出库单详情 API
export const OutboundItemApi = {
  // 查询出库单详情分页
  getOutboundItemPage: async (params: any) => {
    return await request.get({ url: `/wms/outbound-item/page`, params })
  },

  // 查询出库单详情详情
  getOutboundItem: async (id: number) => {
    return await request.get({ url: `/wms/outbound-item/get?id=` + id })
  },

  // 新增出库单详情
  createOutboundItem: async (data: OutboundItemVO) => {
    return await request.post({ url: `/wms/outbound-item/create`, data })
  },

  // 修改出库单详情
  updateOutboundItem: async (data: OutboundItemVO) => {
    return await request.put({ url: `/wms/outbound-item/update`, data })
  },

  // 删除出库单详情
  deleteOutboundItem: async (id: number) => {
    return await request.delete({ url: `/wms/outbound-item/delete?id=` + id })
  },

  // 导出出库单详情 Excel
  exportOutboundItem: async (params) => {
    return await request.download({ url: `/wms/outbound-item/export-excel`, params })
  },
  // 设置实际出库量
  updateOutboundItemActualQty: async (data: Array<OutboundItemActualQtyVO>) => {
    return await request.put({ url: `/wms/outbound-item/update-actual-quantity`, data })
  }
}
