import request from '@/config/axios'

// ERP 海关规则 VO
// export interface CustomRuleVO {
//   id?: number // 产品编号
//   countryCode: string // 国家编码
//   // type: string // 类型
//   supplierProductId: number // 供应商产品编号
//   supplierProductCode: number // 供应商产品编号
//   declaredTypeEn: string // 申报品名（英文）
//   declaredType: string // 申报品名
//   declaredValue: number // 申报金额
//   declaredValueCurrencyCode: string // 申报金额币种
//   taxRate: number // 税率
//   hscode: string // hs编码
//   logisticAttribute: string // 物流属性
//   fbaBarCode?: string // FBA条码
// }


export interface CustomRuleVO {
  /**
   * 国家编码
   */
  countryCode: number;
  /**
   * 申报品名
   */
  declaredType?: string;
  /**
   * 申报品名（英文）
   */
  declaredTypeEn: string;
  /**
   * 申报金额
   */
  declaredValue: number;
  /**
   * 申报金额币种
   */
  declaredValueCurrencyCode: number;
  /**
   * 条形码
   */
  fbaBarCode?: string;
  /**
   * hs编码
   */
  hscode?: string;
  /**
   * 海关规则id
   */
  id?: number;
  /**
   * 物流属性
   */
  logisticAttribute?: number;
  /**
   * 产品id
   */
  productId: number;
  /**
   * 税率
   */
  taxRate?: number;
}

export interface CustomRuleDTO {
  /**
   * SKU（编码）
   */
  barCode?: string;
  /**
   * 品牌
   */
  brand?: string;
  /**
   * 产品分类编号
   */
  categoryId?: number;
  /**
   * 颜色
   */
  color?: string;
  /**
   * 创建时间
   */
  createTime?: string[];
  /**
   * 部门id
   */
  deptId?: number;
  /**
   * 基础高度（mm）
   */
  height?: number;
  /**
   * ID工业设计id
   */
  industrialDesignerId?: number;
  /**
   * 基础长度（mm）
   */
  length?: number;
  /**
   * 维护工程师id
   */
  maintenanceEngineerId?: number;
  /**
   * 材料（中文）
   */
  material?: string;
  /**
   * 型号
   */
  model?: string;
  /**
   * 产品名称
   */
  name?: string;
  /**
   * 页码，从 1 开始
   */
  pageNo: number;
  /**
   * 每页条数，最大值为 100
   */
  pageSize: number;
  /**
   * 生产编号
   */
  productionNo?: string;
  /**
   * PO产品经理id
   */
  productOwnerId?: number;
  /**
   * 备注
   */
  remark?: string;
  /**
   * RD研发工程师id
   */
  researchDeveloperId?: number;
  /**
   * 流水号
   */
  serial?: number;
  /**
   * 系列
   */
  series?: string;
  /**
   * 产品状态（1启用，0禁用）
   */
  status?: boolean;
  /**
   * 单位编号
   */
  unitId?: number;
  /**
   * 基础重量（kg）
   */
  weight?: number;
  /**
   * 基础宽度（mm）
   */
  width?: number;
}


// ERP 海关规则 API
export const CustomRuleApi = {
  // 查询ERP 海关规则分页
  getCustomRulePage: async (params: CustomRuleDTO) => {
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
