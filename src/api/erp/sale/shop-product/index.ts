import request from '@/config/axios'


// ERP 店铺产品 VO
export interface ShopProductVO {
  /**
   * 店铺代码
   */
  code: string;
  /**
   * 创建时间
   */
  createTime: number;
  id: number;
  /**
   * 产品明细
   */
  items: ErpShopProductItemSaveReqVO[];
  /**
   * 店铺名称
   */
  name: string;
  /**
   * 备注
   */
  remark: null;
  /**
   * 店铺ID
   */
  shopId: number;
  /**
   * 状态，1开启，0关闭
   */
  status: number;
  /**
   * 产品页面URL
   */
  url: string;
  [property: string]: any;
}

export interface ErpShopProductItemSaveReqVO {
  /**
   * 创建时间
   */
  createTime: number;
  /**
   * ID
   */
  id: number;
  /**
   * 产品
   */
  product: ErpProductRespSimpleVO;
  /**
   * 产品ID
   */
  productId: number;
  /**
   * 备注
   */
  remark: string;
  /**
   * 店铺产品ID
   */
  shopProductId: null;
  [property: string]: any;
}

export interface ErpProductRespSimpleVO {
  barCode: string;
  brand: null;
  createTime: number;
  creator: string;
  deleted: boolean;
  id: number;
  material: string;
  name: string;
  unitName: string;
  updater: string;
  updateTime: number;
  [property: string]: any;
}


// ERP 店铺产品 API
export const ShopProductApi = {
  // 查询店铺产品分页
  getShopProductPage: async (params: any) => {
    return await request.get({ url: `/erp/shop-product/page`, params })
  },
  
  // 查询店铺产品详情
  getShopProduct: async (id: number) => {
    return await request.get({ url: `/erp/shop-product/get?id=` + id })
  },

  // 新增店铺产品
  createShopProduct: async (data: ShopProductVO) => {
    return await request.post({ url: `/erp/shop-product/create`, data })
  },

  // 修改店铺产品
  updateShopProduct: async (data: ShopProductVO) => {
    return await request.put({ url: `/erp/shop-product/update`, data })
  },

  // 删除店铺产品
  deleteShopProduct: async (id: number) => {
    return await request.delete({ url: `/erp/shop-product/delete?id=` + id })
  },

  // 查询店铺清单
  getShopProductList: async (params?: any) => {
    return await request.get({ url: `/erp/shop-product/list`, params })
  },
  // 导出店铺产品 Excel
  exportShopProduct: async (params: any) => {
    return await request.download({ url: `/erp/sale-order/export-excel`, params })
  }
}
