import request from '@/config/axios'

// Erp财务主体 VO
export interface FinanceSubjectVO {
  name: string // 主体名称
  contact: string // 联系人
  mobile: string // 手机号码
  telephone: string // 联系电话
  email: string // 电子邮箱
  fax: string // 传真
  deliveryAddress: string // 送达地址
  companyAddress: string // 公司地址
  remark: string // 备注
  status: boolean // 开启状态 (0-关闭, 1-开启)
  taxNo: string // 纳税人识别号
  bankName: string // 开户行
  bankAccount: string // 开户账号
  bankAddress: string // 开户地址
}

// Erp财务主体 API
export const FinanceSubjectApi = {
  // 查询Erp财务主体分页
  getFinanceSubjectPage: async (params: any) => {
    return await request.get({ url: `/erp/finance-subject/page`, params })
  },

  // 查询Erp财务主体详情
  getFinanceSubject: async (id: number) => {
    return await request.get({ url: `/erp/finance-subject/get?id=` + id })
  },

  // 新增Erp财务主体
  createFinanceSubject: async (data: FinanceSubjectVO) => {
    return await request.post({ url: `/erp/finance-subject/create`, data })
  },

  // 修改Erp财务主体
  updateFinanceSubject: async (data: FinanceSubjectVO) => {
    return await request.put({ url: `/erp/finance-subject/update`, data })
  },

  // 删除Erp财务主体
  deleteFinanceSubject: async (id: number) => {
    return await request.delete({ url: `/erp/finance-subject/delete?id=` + id })
  },

  // 导出Erp财务主体 Excel
  exportFinanceSubject: async (params) => {
    return await request.download({ url: `/erp/finance-subject/export-excel`, params })
  },
}