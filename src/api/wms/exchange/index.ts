import request from '@/config/axios'

// 换货单 VO
export interface ExchangeVO {
  id: number // 主键
  code: string // 单据号
  type: number // 类型
  warehouseId: number // 调出仓库ID
  auditStatus: string // 状态
  remark: string // 特别说明
}

// 换货单 API
export const ExchangeApi = {
  // 查询换货单分页
  getExchangePage: async (data: any) => {
    return await request.post({ url: `/wms/exchange/page`, data })
  },

  // 查询换货单详情
  getExchange: async (id: number) => {
    return await request.get({ url: `/wms/exchange/get?id=` + id })
  },

  // 新增换货单
  createExchange: async (data: ExchangeVO) => {
    return await request.post({ url: `/wms/exchange/create`, data })
  },

  // 修改换货单
  updateExchange: async (data: ExchangeVO) => {
    return await request.put({ url: `/wms/exchange/update`, data })
  },

  // 删除换货单
  deleteExchange: async (id: number) => {
    return await request.delete({ url: `/wms/exchange/delete?id=` + id })
  },

  // 导出换货单 Excel
  exportExchange: async (params) => {
    return await request.download({ url: `/wms/exchange/export-excel`, params })
  },

  // 入库单提交审核
  submitExchangeAudit: async (data: { billId: number }[]) => {
    return await request.put({
      url: `/wms/exchange/submit`,
      data
    })
  },

  // 同意审核入库单 billType-statusType不用关心
  agreeExchangeAuditStatus: async (data: { billId: number; comment?: string }) => {
    return await request.put({
      url: `/wms/exchange/agree`,
      data
    })
  },
  // 不同意审核入库单
  rejectExchangeAuditStatus: async (data: { billId: number; comment?: string }) => {
    return await request.put({
      url: `/wms/exchange/reject`,
      data
    })
  }
}
