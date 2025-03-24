import request from '@/config/axios'

export interface PurchaseOrderItemVO {
  /**
   * 含税单价
   */
  actTaxPrice?: number
  /**
   * 箱率
   */
  containerRate?: string
  /**
   * 下单数量
   */
  count?: number
  /**
   * 币别id(财务管理-币别维护)
   */
  currencyId?: number
  /**
   * 交货日期
   */
  deliveryTime?: string
  /**
   * 优惠率，百分比
   */
  discountPercent?: number
  /**
   * 采购申请单的申请项id
   */
  erpPurchaseRequestItemId?: number
  /**
   * 采购申请单No
   */
  erpPurchaseRequestItemNo?: string
  /**
   * 订单项编号
   */
  id?: number
  /**
   * 采购入库数量
   */
  inCount?: number
  /**
   * 产品编号
   */
  productId?: number
  /**
   * 产品单价
   */
  productPrice?: number
  /**
   * 商品行备注
   */
  remark?: string
  /**
   * 增值税税率，百分比
   */
  taxPercent?: number
  /**
   * 税额
   */
  taxPrice?: number
  /**
   * 仓库编号
   */
  warehouseId?: number
  /**
   * ========== 其他 ==========
   * x码
   */
  xCode?: string
}

// ERP 采购订单 VO
export interface PurchaseOrderVO {
  id: number // 订单工单编号
  no: string // 采购订单号
  customerId: number // 客户编号
  orderTime: Date // 订单时间
  totalCount: number // 合计数量
  totalPrice: number // 合计金额，单位：元
  status: number // 状态
  remark: string // 备注
  outCount: number // 采购出库数量
  returnCount: number // 采购退货数量,
  items: PurchaseOrderItemVO[] // 采购订单明细
  reviewComment?: string // 审核意见
  inspectionJson?: string // 检验单
  completionJson?: string // 完工单
  totalInspectionPassCount?: number // 总检验通过数量
  supplierId?: number
  templateName?: string // 模板名称-生成采购合同才出现
}

interface PurchaseMergeVO {
  /**
   * 结算账户编号
   */
  accountId?: number
  /**
   * 收获地址
   */
  address?: string
  /**
   * 优惠率，百分比
   */
  discountPercent?: number
  /**
   * 附件地址
   */
  fileUrl?: string
  /**
   * 订单项ids
   */
  itemIds: number[]
  /**
   * 单据日期
   */
  noTime?: string
  /**
   * 其它金额，单位：元
   */
  otherPrice?: number
  /**
   * 入库备注
   */
  remark?: string
  /**
   * 结算日期
   */
  settlementDate?: string
  /**
   * 供应商编号
   */
  supplierId?: number
  // [property: string]: any;
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
  },

  // 审核/反审核采购订单
  updatePurchaseOrderAuditStatus: async (data: {
    reviewed: boolean
    pass: boolean
    orderIds: number[]
    reviewComment?: string
  }) => {
    return await request.post({
      url: `/erp/purchase-order/auditStatus`,
      data
    })
  },

  // 关闭/启用采购订单
  updatePurchaseOrderStatusEnable: async (data: { items: any[]; enable: boolean }) => {
    return await request.put({
      url: `/erp/purchase-order/enableStatus`,
      data
    })
  },

  // 采购单提交审核
  submitPurchaseOrderAudit: async (data: { orderIds: any[] }) => {
    return await request.post({
      url: `/erp/purchase-order/submitAudit`,
      data
    })
  },

  // 采购单合并入库
  mergePurchaseOrder: async (data: PurchaseMergeVO) => {
    return await request.post({
      url: `/erp/purchase-order/merge`,
      data
    })
  },

  // 查询采购合同模板
  getPurchaseOrderTemplateList: async () => {
    return await request.get({
      url: `/erp/purchase-order/getTemplateList`
    })
  },
  // 生成采购合同
  generatePurchaseOrderContract: async (data: { templateName: string; orderId: number }) => {
    return await request.post({
      url: `/erp/purchase-order/generateContract`,
      data
    })
  }
}
