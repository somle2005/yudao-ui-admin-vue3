import request from '@/config/axios'

// 海关管理中，与海关分类-产品。中间联系表。 VO
export interface CustomProductVO {
  productId: number // 产品id
  customCategoryId: number // 海关分类id
}

// 海关管理中，与海关分类-产品。中间联系表。 API
export const CustomProductApi = {
  // 查询海关管理中，与海关分类-产品。中间联系表。分页
  getCustomProductPage: async (params: any) => {
    return await request.get({ url: `/tms/custom-product/page`, params })
  },

  // 查询海关管理中，与海关分类-产品 精简列表
  getCustomProductSimpleList: async () => {
    return await request.get({ url: `/tms/custom-product/simple-list` })
  },

  // 查询海关管理中，与海关分类-产品。中间联系表。详情
  getCustomProduct: async (id: number) => {
    return await request.get({ url: `/tms/custom-product/get?id=` + id })
  },

  // 新增海关管理中，与海关分类-产品。中间联系表。
  createCustomProduct: async (data: CustomProductVO) => {
    return await request.post({ url: `/tms/custom-product/create`, data })
  },

  // 修改海关管理中，与海关分类-产品。中间联系表。
  updateCustomProduct: async (data: CustomProductVO) => {
    return await request.put({ url: `/tms/custom-product/update`, data })
  },

  // 删除海关管理中，与海关分类-产品。中间联系表。
  deleteCustomProduct: async (id: number) => {
    return await request.delete({ url: `/tms/custom-product/delete?id=` + id })
  },

  // 导出海关管理中，与海关分类-产品。中间联系表。 Excel
  exportCustomProduct: async (params) => {
    return await request.download({ url: `/tms/custom-product/export-excel`, params })
  }
}
