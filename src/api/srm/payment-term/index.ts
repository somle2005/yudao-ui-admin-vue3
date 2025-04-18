import request from '@/config/axios'

// 付款条款 VO
export interface PaymentTermVO {
  id: number // 主键
  paymentTermZh: string // 人民币采购条款（中文）
  paymentTermZhForeign: string // 外币采购条款（中文）
  paymentTermEnForeign: string // 外币采购条款（英文）
  remark: string // 备注
}

// 付款条款 API
export const PaymentTermApi = {
  // 查询付款条款分页
  getPaymentTermPage: async (params: any) => {
    return await request.get({ url: `/srm/payment-term/page`, params })
  },

  // 查询付款条款精简列表
  getPaymentTermSimpleList: async () => {
    return await request.get({ url: `/srm/payment-term/simple-list` })
  },

  // 查询付款条款详情
  getPaymentTerm: async (id: number) => {
    return await request.get({ url: `/srm/payment-term/get?id=` + id })
  },

  // 新增付款条款
  createPaymentTerm: async (data: PaymentTermVO) => {
    return await request.post({ url: `/srm/payment-term/create`, data })
  },

  // 修改付款条款
  updatePaymentTerm: async (data: PaymentTermVO) => {
    return await request.put({ url: `/srm/payment-term/update`, data })
  },

  // 删除付款条款
  deletePaymentTerm: async (id: number) => {
    return await request.delete({ url: `/srm/payment-term/delete?id=` + id })
  },

  // 导出付款条款 Excel
  exportPaymentTerm: async (params) => {
    return await request.download({ url: `/srm/payment-term/export-excel`, params })
  }
}
