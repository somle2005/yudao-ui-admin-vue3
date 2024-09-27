import request from '@/config/axios'

// ERP 供应商产品 VO
export interface SupplierProductVO {
  id: number // 供应商产品编号
  code: string // 供应商产品编码
  supplierId: number // 供应商编号
  productId: number // 产品编号
  packageHeight: number // 包装高度
  packageLength: number // 包装长度
  packageWeight: number // 包装重量
  packageWidth: number // 包装宽度
  purchasePrice: number // 采购价格
  purchasePriceCurrencyCode: string // 采购货币代码
}

// ERP 供应商产品 API
export const SupplierProductApi = {
  // 查询ERP 供应商产品分页
  getSupplierProductPage: async (params: any) => {
    return await request.get({ url: `/erp/supplier-product/page`, params })
  },

  // 查询ERP 供应商产品详情
  getSupplierProduct: async (id: number) => {
    return await request.get({ url: `/erp/supplier-product/get?id=` + id })
  },

  // 新增ERP 供应商产品
  createSupplierProduct: async (data: SupplierProductVO) => {
    return await request.post({ url: `/erp/supplier-product/create`, data })
  },

  // 修改ERP 供应商产品
  updateSupplierProduct: async (data: SupplierProductVO) => {
    return await request.put({ url: `/erp/supplier-product/update`, data })
  },

  // 删除ERP 供应商产品
  deleteSupplierProduct: async (id: number) => {
    return await request.delete({ url: `/erp/supplier-product/delete?id=` + id })
  },

  // 导出ERP 供应商产品 Excel
  exportSupplierProduct: async (params) => {
    return await request.download({ url: `/erp/supplier-product/export-excel`, params })
  }
}