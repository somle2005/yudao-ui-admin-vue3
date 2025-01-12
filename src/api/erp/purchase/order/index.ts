import request from '@/config/axios'

// ERP 采购订单 VO
// export interface PurchaseOrderVO {
//   id: number // 订单工单编号
//   no: string // 采购订单号
//   customerId: number // 客户编号
//   orderTime: Date // 订单时间
//   totalCount: number // 合计数量
//   totalPrice: number // 合计金额，单位：元
//   status: number // 状态
//   remark: string // 备注
//   outCount: number // 采购出库数量
//   returnCount: number // 采购退货数量
// }
/**
 * ErpPurchaseOrderSaveReqVO
 */

// ERP 采购订单 VO - PurchaseOrderV
export interface PurchaseOrderVO {
  /**
   * 结算账户编号
   */
  accountId?: number;
  /**
   * 部门编号
   */
  departmentId?: number;
  /**
   * 定金金额，单位：元
   */
  depositPrice?: number;
  /**
   * 附件地址
   */
  fileUrl?: string;
  /**
   * 编号
   */
  id?: number;
  /**
   * 订单清单列表
   */
  items?: Item[];
  /**
   * 单据日期
   */
  noTime?: string;
  /**
   * 采购时间
   */
  orderTime: string;
  /**
   * 采购主体编号
   */
  purchaseEntityId?: number;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 结算日期
   */
  settlementDate?: string;
  /**
   * 供应商编号
   */
  supplierId: number;
  [property: string]: any;
}

export interface Item {
  /**
   * 含税单价
   */
  actTaxPrice?: number;
  /**
   * 箱率
   */
  containerRate?: string;
  /**
   * 产品数量
   */
  count: number;
  /**
   * 交货日期
   */
  deliveryTime?: string;
  /**
   * 优惠率，百分比
   */
  discountPercent?: number;
  /**
   * 订单项编号
   */
  id?: number;
  /**
   * 采购入库数量
   */
  inCount?: number;
  /**
   * 产品编号
   */
  productId: number;
  /**
   * 产品单价
   */
  productPrice?: number;
  /**
   * 产品单位
   */
  productUnitId: number;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 供应商产品编号
   */
  supplierProductId: string;
  /**
   * 增值税税率，百分比
   */
  taxPercent?: number;
  /**
   * ========== 仓库相关 ==========
   * 仓库编号
   */
  warehouseId?: string;
  /**
   * ========== 其他 ==========
   * x码
   */
  xCode?: string;
  [property: string]: any;
}

// ERP 采购订单 API
export const PurchaseOrderApi = {
  // 查询采购订单分页
  getPurchaseOrderPage: async (params: any) => {
    return await request.get({ url: `/erp/purchase-order/page`, params })
  },

  // 查询采购订单详情
  getPurchaseOrder: async (id: number) => {
    return await request.get({ url: `/erp/purchase-order/get?id=` + id })
  },

  // 新增采购订单
  createPurchaseOrder: async (data: PurchaseOrderVO) => {
    return await request.post({ url: `/erp/purchase-order/create`, data })
  },

  // 修改采购订单
  updatePurchaseOrder: async (data: PurchaseOrderVO) => {
    return await request.put({ url: `/erp/purchase-order/update`, data })
  },

  // 更新采购订单的状态
  updatePurchaseOrderStatus: async (id: number, status: number) => {
    return await request.put({
      url: `/erp/purchase-order/update-status`,
      params: {
        id,
        status
      }
    })
  },

  // 删除采购订单
  deletePurchaseOrder: async (ids: number[]) => {
    return await request.delete({
      url: `/erp/purchase-order/delete`,
      params: {
        ids: ids.join(',')
      }
    })
  },

  // 导出采购订单 Excel
  exportPurchaseOrder: async (params: any) => {
    return await request.download({ url: `/erp/purchase-order/export-excel`, params })
  }
}
