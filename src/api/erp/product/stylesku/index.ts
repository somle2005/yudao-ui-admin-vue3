import request from '@/config/axios'

// ERP 产品 VO
export interface StyleSkuVO {
  modelSku: string; // 模型 SKU
  styleCode: string; // 款号
  styleSku: string; // 款式 SKU
  nameZh: string; // 中文名称
  nameEn: string; // 英文名称
  imageUrlList?: string[]; // 图片 URL 列表

  // 研发属性
  weight: number; // 重量（kg）
  length: number; // 长度（m）
  width: number; // 宽度（m）
  height: number; // 高度（m）
  packageWeight: number; // 包装重量（kg）
  packageLength: number; // 包装长度（m）
  packageWidth: number; // 包装宽度（m）
  packageHeight: number; // 包装高度（m）
  materialZh: string; // 材质（中文）
  materialEn: string; // 材质（英文）
  researchDepartmentId: number; // 研发部门编号

  // 采购属性
  purchasePrice: number; // 采购价格，单位：元
  purchasePriceCurrencyCode: string; // 采购价格币种
  defaultSupplierCode: string; // 默认供应商代码

  // 销售属性
  saleStatus: number; // 销售状态
  saleDepartmentId: number; // 销售部门编号

  // 金蝶属性
  barcode: string; // 条形码

  synced?: boolean; // 是否同步
}

// ERP 产品 API
export const StyleSkuApi = {
  // 查询产品分页
  getProductPage: async (params: any) => {
    return await request.get({ url: `/erp/stylesku/get`, params })
  },

  // 查询产品精简列表
  getProductSimpleList: async () => {
    return await request.get({ url: `/erp/stylesku/simple-list` })
  },

  // 查询产品详情
  getProduct: async (id: number) => {
    return await request.get({ url: `/erp/stylesku/get?id=` + id })
  },

  // 新增产品
  createProduct: async (data: StyleSkuVO) => {
    return await request.post({ url: `/erp/stylesku/create`, data })
  },

  // 修改产品
  updateProduct: async (data: StyleSkuVO) => {
    return await request.put({ url: `/erp/stylesku/update`, data })
  },

  // 删除产品
  deleteProduct: async (id: number) => {
    return await request.delete({ url: `/erp/stylesku/delete?id=` + id })
  },

  // 导出产品 Excel
  exportProduct: async (params) => {
    return await request.download({ url: `/erp/stylesku/export-excel`, params })
  }
}
