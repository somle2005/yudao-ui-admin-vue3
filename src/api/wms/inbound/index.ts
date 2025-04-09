import request from '@/config/axios'

// 入库单 VO
export interface InboundVO {
  id: number // 主键
  no: string // 单据号
  type: number // 入库单类型
  warehouseId: number // 仓库ID
  status: string // 状态
  sourceBillId: number // 来源单据ID
  sourceBillNo: string // 来源单据号
  sourceBillType: number // 来源单据类型
  referNo: string // 参考号
  traceNo: string // 跟踪号
  shippingMethod: number // 运输方式，1-海运；2-火车；3-空运；4、集卡
  planArrivalTime: Date // 预计到货时间
  actualArrivalTime: Date // 实际到货时间
  creatorComment: string // 特别说明，创建方专用
  initAge: number // 初始库龄
  itemList: any[] // 详情清单
}

// 入库单 API
export const InboundApi = {
  // 查询入库单分页
  getInboundPage: async (params: any) => {
    return await request.get({ url: `/wms/inbound/page`, params })
  },

  // 查询入库单详情
  getInbound: async (id: number) => {
    return await request.get({ url: `/wms/inbound/get?id=` + id })
  },

  // 新增入库单
  createInbound: async (data: InboundVO) => {
    return await request.post({ url: `/wms/inbound/create`, data })
  },

  // 修改入库单
  updateInbound: async (data: InboundVO) => {
    return await request.put({ url: `/wms/inbound/update`, data })
  },

  // 删除入库单
  deleteInbound: async (id: number) => {
    return await request.delete({ url: `/wms/inbound/delete?id=` + id })
  },

  // 导出入库单 Excel
  exportInbound: async (params) => {
    return await request.download({ url: `/wms/inbound/export-excel`, params })
  },

  // 入库单提交审核
  submitInboundAudit: async (data: { billId: number }) => {
    return await request.put({
      url: `/wms/inbound/submit`,
      data
    })
  },

  // 同意审核入库单
  agreeInboundAuditStatus: async (data: { billId: number; comment?: string }) => {
    return await request.put({
      url: `/wms/inbound/agree`,
      data
    })
  },
  // 不同意审核入库单
  rejectInboundAuditStatus: async (data: { billId: number; comment?: string }) => {
    return await request.put({
      url: `/wms/inbound/reject`,
      data
    })
  },

  // 强制完成入库单
  forceFinishInbound: async (data: { billId: number; comment?: string }) => {
    return await request.put({
      url: `/wms/inbound/force-finish`,
      data
    })
  },
  // 作废入库单
  abandonInbound: async (data: { billId: number; comment?: string }) => {
    return await request.put({
      url: `/wms/inbound/abandon`,
      data
    })
  }
}
