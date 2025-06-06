import request from '@/config/axios'


export interface PurchaseReturnVO {
    /**
     * 结算账户编号
     */
    accountId?: number;
    /**
     * 退货单编号
     */
    code?: string;
    /**
     * 优惠率，百分比
     */
    discountPercent?: number;
    /**
     * 附件地址
     */
    fileUrl?: string;
    /**
     * 编号
     */
    id?: number;
    /**
     * 退货清单列表
     */
    items?: PurchaseReturnItemsVO[];
    /**
     * 其它金额，单位：元
     */
    otherPrice?: number;
    /**
     * 备注
     */
    remark?: string;
    /**
     * 退货时间
     */
    returnTime?: string;
    /**
     * 供应商id
     */
    supplierId?: number;
}

export interface PurchaseReturnItemsVO {
    /**
     * 含税单价
     */
    actTaxPrice?: number;
    /**
     * 价税合计
     */
    allAmount?: number;
    /**
     * 申请人id
     */
    applicantId?: number;
    /**
     * 部门id
     */
    applicationDeptId?: number;
    /**
     * 产品sku
     */
    productCode?: string;
    /**
     * 完工单，JSON 格式
     * 完工单json
     */
    completionJson?: string;
    /**
     * 箱率
     */
    containerRate?: string;
    /**
     * 币别编号
     */
    currencyId?: number;
    /**
     * 币别名称
     */
    currencyName?: string;
    /**
     * 产品报关品名
     */
    declaredType?: string;
    /**
     * 产品报关品名英文
     */
    declaredTypeEn?: string;
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
     * 验货单，JSON 格式
     * 验货单json
     */
    inspectionJson?: string;
    /**
     * 应付款余额
     * 应付款余额(查询+修改)
     */
    payableBalance?: number;
    /**
     * 产品编号
     */
    productId?: number;
    /**
     * 产品名称
     */
    productName?: string;
    /**
     * 产品单价
     */
    productPrice?: number;
    /**
     * 产品单位ID
     */
    productUnitId?: number;
    /**
     * 产品单位名称
     */
    productUnitName?: string;
    /**
     * 采购申请单的申请项id
     */
    purchaseApplyItemId?: number;
    /**
     * 下单数量
     */
    qty?: number;
    /**
     * 参考单价
     */
    referenceUnitPrice?: number;
    /**
     * 商品行备注
     */
    remark?: string;
    /**
     * 单据来源描述
     */
    source?: string;
    /**
     * 增值税税率，百分比
     */
    taxPercent?: number;
    /**
     * 税额
     */
    taxPrice?: number;
    /**
     * 总完工单通过数量
     */
    totalCompletionPassCount?: number;
    /**
     * 总验货通过数量
     */
    totalInspectionPassCount?: number;
    /**
     * 版本号
     */
    version?: number;
    /**
     * 仓库编号
     */
    warehouseId?: number;
    /**
     * ========== 其他 ==========
     * x码
     */
    xcode?: string;
}

export interface PurchaseReturnAuditVO {
    /**
     * 退货单
     */
    ids: number[];
    /**
     * 通过与否
     * 审核通过/不通过
     */
    pass?: boolean;
    /**
     * 退款完成|退款撤销 布尔值
     */
    refund?: boolean;
    /**
     * 审核意见
     */
    auditAdvice?: string;
    /**
     * 审核/反审核
     */
    reviewed?: boolean;
}

// ERP 采购退货 API
export const PurchaseReturnApi = {
  // 查询采购退货分页
  getPurchaseReturnPage: async (data: any) => {
    return await request.post({ url: `/srm/purchase-return/page`, data })
  },

  // 查询采购退货详情
  getPurchaseReturn: async (id: number) => {
    return await request.get({ url: `/srm/purchase-return/get?id=` + id })
  },

  // 新增采购退货
  createPurchaseReturn: async (data: PurchaseReturnVO) => {
    return await request.post({ url: `/srm/purchase-return/create`, data })
  },

  // 修改采购退货
  updatePurchaseReturn: async (data: PurchaseReturnVO) => {
    return await request.put({ url: `/srm/purchase-return/update`, data })
  },

  // 更新采购退货的状态
  updatePurchaseReturnStatus: async (id: number, status: number) => {
    return await request.put({
      url: `/srm/purchase-return/update-status`,
      params: {
        id,
        status
      }
    })
  },

  // 删除采购退货
  deletePurchaseReturn: async (ids: number[]) => {
    return await request.delete({
      url: `/srm/purchase-return/delete`,
      params: {
        ids: ids.join(',')
      }
    })
  },

  // 导出采购退货 Excel
  exportPurchaseReturn: async (params: any) => {
    return await request.download({ url: `/srm/purchase-return/export-excel`, params })
  },

  // 审核/反审核采购退货
  updatePurchaseReturnAuditStatus: async (data: PurchaseReturnAuditVO) => {
    return await request.put({
      url: `srm/purchase-return/auditStatus`,
      data
    })
  },

  // 采购退货提交审核
  submitPurchaseReturnAudit: async (data: { ids: number[] }) => {
    return await request.put({
      url: `/srm/purchase-return/submitAudit`,
      data
    })
  },

  // 采购退货切换付款状态
  changePurchaseReturnPayStatus: async (data: { ids: number[]; refund: boolean }) => {
    return await request.put({
      url: `/srm/purchase-in/changePayStatus`,
      data
    })
  }
}
