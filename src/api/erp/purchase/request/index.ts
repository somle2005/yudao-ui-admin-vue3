import request from '@/config/axios'

// ERP 采购订单 VO
export interface PurchaseRequestVO {
  id: number // 订单工单编号
  no: string // 采购订单号
  customerId: number // 客户编号
  requestTime: Date // 订单时间
  totalCount: number // 合计数量
  totalPrice: number // 合计金额，单位：元
  status: number // 状态
  remark: string // 备注
  outCount: number // 采购出库数量
  returnCount: number // 采购退货数量
}

// ERP 采购订单 API
export const PurchaseRequestApi = {
  // 查询采购订单分页
  getPurchaseRequestPage: async (params: any) => {
    return await request.get({ url: `/erp/purchase-request/page`, params })
  },

  // 查询采购订单详情
  getPurchaseRequest: async (id: number) => {
    return await request.get({ url: `/erp/purchase-request/get?id=` + id })
  },

  // 新增采购订单
  createPurchaseRequest: async (data: PurchaseRequestVO) => {
    return await request.post({ url: `/erp/purchase-request/create`, data })
  },

  // 修改采购订单
  updatePurchaseRequest: async (data: PurchaseRequestVO) => {
    return await request.put({ url: `/erp/purchase-request/update`, data })
  },

  // 更新采购订单的状态
  updatePurchaseRequestStatus: async (id: number, status: number) => {
    return await request.put({
      url: `/erp/purchase-request/update-status`,
      params: {
        id,
        status
      }
    })
  },

  // 删除采购订单
  deletePurchaseRequest: async (ids: number[]) => {
    return await request.delete({
      url: `/erp/purchase-request/delete`,
      params: {
        ids: ids.join(',')
      }
    })
  },

  // 导出采购订单 Excel
  exportPurchaseRequest: async (params: any) => {
    return await request.download({ url: `/erp/purchase-request/export-excel`, params })
  }
}
