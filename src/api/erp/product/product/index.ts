import request from '@/config/axios'

// ERP 产品 VO
export interface ProductVO {
  id: number // 产品编号
  name: string // 产品名称
  categoryId: number // 产品分类编号
  remark: string // 产品备注
  deptId: number // 部门id
  barCode: string // SKU（编码）
  unitId: number // 单位编号
  material: string // 材料（中文）
  status: boolean // 产品状态（1启用，0禁用）
  weight: number // 基础重量（kg）
  series: string // 系列
  model: string // 型号
  serial: number // 流水号
  productionNo: string // 生产编号
  width: number // 基础宽度（mm）
  length: number // 基础长度（mm）
  height: number // 基础高度（mm）
  imageUrl: string // 图片url
  guidePrice: string // 指导价，json格式
  patent: string // 专利
  poId: number // PO产品经理id
  idId: number // ID工业设计id
  rdId: number // RD研发工程师id
  meId: number // 维护工程师id
  color: string // 颜色
}

// ERP 产品 API
export const ProductApi = {
  // 查询ERP 产品分页
  getProductPage: async (params: any) => {
    return await request.get({ url: `/erp/product/page`, params })
  },

  // 查询ERP 产品详情
  getProduct: async (id: number) => {
    return await request.get({ url: `/erp/product/get?id=` + id })
  },

  // 新增ERP 产品
  createProduct: async (data: ProductVO) => {
    return await request.post({ url: `/erp/product/create`, data })
  },

  // 修改ERP 产品
  updateProduct: async (data: ProductVO) => {
    return await request.put({ url: `/erp/product/update`, data })
  },

  // 删除ERP 产品
  deleteProduct: async (id: number) => {
    return await request.delete({ url: `/erp/product/delete?id=` + id })
  },

  // 导出ERP 产品 Excel
  exportProduct: async (params) => {
    return await request.download({ url: `/erp/product/export-excel`, params })
  },
}
