import request from '@/config/axios'

// 入库单详情 VO
export interface InboundItemVO {
  id: number // 主键
  inboundId: number // 入库单ID
  productId: number // 标准产品ID
  productSku: string // 标准产品SKU
  planqty: number // 计划入库量
  actualqty: number // 实际入库量
  leftqty: number // 批次剩余库存，出库后的剩余库存量
  sourceItemId: number // 来源详情ID
}

export interface InboundPickupPendingVO {
  /**
   * 入库单编号
   */
  inboundNo?: string
  /**
   * 页码，从 1 开始
   */
  pageNo: number
  /**
   * 每页条数，最大值为 100
   */
  pageSize: number
}

export interface InboundItemActualQuantityVO {
  /**
   * 实际入库量
   */
  actualQty?: number;
  /**
   * 主键
   */
  id: number;
  /**
   * 入库单ID
   */
  inboundId?: number;
}


// 入库单详情 API
export const InboundItemApi = {
  // 查询入库单详情分页
  getInboundItemPage: async (params: any) => {
    return await request.get({ url: `/wms/inbound-item/page`, params })
  },

  // 查询入库单详情详情
  getInboundItem: async (id: number) => {
    return await request.get({ url: `/wms/inbound-item/get?id=` + id })
  },

  // 新增入库单详情
  createInboundItem: async (data: InboundItemVO) => {
    return await request.post({ url: `/wms/inbound-item/create`, data })
  },

  // 修改入库单详情
  updateInboundItem: async (data: InboundItemVO) => {
    return await request.put({ url: `/wms/inbound-item/update`, data })
  },

  // 删除入库单详情
  deleteInboundItem: async (id: number) => {
    return await request.delete({ url: `/wms/inbound-item/delete?id=` + id })
  },

  // 导出入库单详情 Excel
  exportInboundItem: async (params) => {
    return await request.download({ url: `/wms/inbound-item/export-excel`, params })
  },

  // 待上架的入库明细
  getPickupPendingPage: async (params: InboundPickupPendingVO) => {
    return await request.get({ url: `/wms/inbound-item/pickup-pending`, params })
  },
  // 设置实际入库量
  updateInboundItemActualQuantity: async (data: Array<InboundItemActualQuantityVO>) => {
    return await request.put({ url: `/wms/inbound-item/update-actual-quantity`, data })
  },
}
