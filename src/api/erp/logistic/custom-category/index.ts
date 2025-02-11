import request from '@/config/axios'

// // 海关品类 VO
// export interface CustomRuleCategoryVO {
//   revision: number // 乐观锁
//   id: number // 编号
//   material: number // 材质-字典
//   declaredType: string // 报关品名
//   declaredTypeEn: string // 英文品名
//   combinedValue: string // 材质对应string+报关品名
// }

// 海关品类 VO
export interface CustomRuleCategoryVO {
  /**
   * 海关品类子表列表
   */
  customRuleCategoryItems?: ErpCustomRuleCategoryItemSaveReqVO[];
  /**
   * 报关品名
   */
  declaredType?: string;
  /**
   * 英文品名
   */
  declaredTypeEn?: string;
  /**
   * 编号
   */
  id?: number;
  /**
   * 材质-字典
   */
  material?: number;
  [property: string]: any;
}
export interface ErpCustomRuleCategoryItemSaveReqVO {
  /**
   * 分类表id
   */
  categoryId: number;
  /**
   * 国家-字典
   */
  countryCode: number;
  /**
   * HS编码
   */
  hsCode: string;
  /**
   * 编号
   */
  id?: number;
  /**
   * 税率
   */
  taxRate: number;
  [property: string]: any;
}


// 海关品类 API
export const CustomRuleCategoryApi = {
  // 查询海关品类分页
  getCustomRuleCategoryPage: async (params: any) => {
    return await request.get({ url: `/erp/custom-category/page`, params })
  },

  // 查询海关品类详情
  getCustomRuleCategory: async (id: number) => {
    return await request.get({ url: `/erp/custom-category/get?id=` + id })
  },

  // 新增海关品类
  createCustomRuleCategory: async (data: CustomRuleCategoryVO) => {
    return await request.post({ url: `/erp/custom-category/create`, data })
  },

  // 修改海关品类
  updateCustomRuleCategory: async (data: CustomRuleCategoryVO) => {
    return await request.put({ url: `/erp/custom-category/update`, data })
  },

  // 删除海关品类
  deleteCustomRuleCategory: async (id: number) => {
    return await request.delete({ url: `/erp/custom-category/delete?id=` + id })
  },

  // 导出海关品类 Excel
  exportCustomRuleCategory: async (params) => {
    return await request.download({ url: `/erp/custom-category/export-excel`, params })
  },

// ==================== 子表（海关品类子表） ====================

  // 获得海关品类子表列表
  getCustomRuleCategoryItemListByCategoryId: async (categoryId) => {
    return await request.get({ url: `/erp/custom-category/custom-category-item/list-by-category-id?categoryId=` + categoryId })
  },

  // 获得海关分类组合值精简列表
  getCustomRuleCategorySimpleList: async () => {
    return await request.get({ url: `/erp/custom-category/simple-list` })
  },
}
