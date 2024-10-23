import request from '@/config/axios'

// ERP 海关规则 VO
export interface CustomRuleVO {
  id: number // 产品编号
  countryCode: string // 国家编码
  type: string // 类型
  supplierProductId: number // 供应商产品编号
  supplierProductCode: number // 供应商产品编号
  declaredTypeEn: string // 申报品名（英文）
  declaredType: string // 申报品名
  declaredValue: number // 申报金额
  declaredValueCurrencyCode: string // 申报金额币种
  taxRate: number // 税率
  hscode: string // hs编码
  logisticAttribute: string // 物流属性
}

// ERP 海关规则 API
export const CustomRuleApi = {
  // 查询ERP 海关规则分页
  getCustomRulePage: async (params: any) => {
    return await request.get({ url: `/erp/custom-rule/page`, params })
  },

  // 查询ERP 海关规则详情
  getCustomRule: async (id: number) => {
    return await request.get({ url: `/erp/custom-rule/get?id=` + id })
  },

  // 新增ERP 海关规则
  createCustomRule: async (data: CustomRuleVO) => {
    return await request.post({ url: `/erp/custom-rule/create`, data })
  },

  // 修改ERP 海关规则
  updateCustomRule: async (data: CustomRuleVO) => {
    return await request.put({ url: `/erp/custom-rule/update`, data })
  },

  // 删除ERP 海关规则
  deleteCustomRule: async (id: number) => {
    return await request.delete({ url: `/erp/custom-rule/delete?id=` + id })
  },

  // 导出ERP 海关规则 Excel
  exportCustomRule: async (params) => {
    return await request.download({ url: `/erp/custom-rule/export-excel`, params })
  }
}
