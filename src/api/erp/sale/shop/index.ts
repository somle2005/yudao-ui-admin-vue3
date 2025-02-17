import request from '@/config/axios'

// ERP 平台店铺 VO
export interface ShopVO {
  /**
   * 平台账户
   */
  account: string
  /**
   * 店铺代码，唯一
   */
  code: string
  /**
   * 创建时间
   */
  createTime: number
  /**
   * ID
   */
  id: number
  /**
   * 店铺名称
   */
  name: string
  /**
   * 平台
   */
  platform: string
  /**
   * 备注
   */
  remark: null
  /**
   * 排序
   */
  sort: number
  /**
   * 状态，1开启，0关闭
   */
  status: number
  /**
   * 类型，0线上 1线下
   */
  type: number
  [property: string]: any
}

// ERP 平台店铺 API
export const ShopApi = {
  // 查询平台店铺分页
  getShopPage: async (params: any) => {
    return await request.get({ url: `/erp/shop/page`, params })
  },

  // 查询平台店铺详情
  getShop: async (id: number) => {
    return await request.get({ url: `/erp/shop/get?id=` + id })
  },

  // 新增平台店铺
  createShop: async (data: ShopVO) => {
    return await request.post({ url: `/erp/shop/create`, data })
  },

  // 修改平台店铺
  updateShop: async (data: ShopVO) => {
    return await request.put({ url: `/erp/shop/update`, data })
  },

  // 删除平台店铺
  deleteShop: async (id: number) => {
    return await request.delete({ url: `/erp/shop/delete?id=` + id })
  },

  // 导出平台店铺 Excel
  exportShop: async (params: any) => {
    return await request.download({ url: `/erp/sale-order/export-excel`, params })
  }
}
