import request from '@/config/axios'

// ERP采购申请单 VO
export interface PurchaseRequestVO {
  id: number // id
  serial: string // 单据编号
  num: number // 当日申请排序编号
  applicant: string // 申请人
  applicationDept: string // 申请部门
  date: Date // 单据日期
  applicationStatus: number // 审核状态(0:待审核，1:审核通过，2:审核未通过)
  offStatus: number // 关闭状态（0已关闭，1已开启）
  orderStatus: number // 订购状态（0部分订购，1全部订购）
  auditor: string // 审核者
  auditTime: Date // 审核时间
}

// ERP采购申请单 API
export const PurchaseRequestApi = {
  // 查询ERP采购申请单分页
  getPurchaseRequestPage: async (params: any) => {
    return await request.get({ url: `/erp/purchase-request/page`, params })
  },

  // 查询ERP采购申请单详情
  getPurchaseRequest: async (id: number) => {
    return await request.get({ url: `/erp/purchase-request/get?id=` + id })
  },

  // 新增ERP采购申请单
  createPurchaseRequest: async (data: PurchaseRequestVO) => {
    return await request.post({ url: `/erp/purchase-request/create`, data })
  },

  // 修改ERP采购申请单
  updatePurchaseRequest: async (data: PurchaseRequestVO) => {
    return await request.put({ url: `/erp/purchase-request/update`, data })
  },



  // 更新采购订单的状态
  updatePurchaseRequestStatus: async (id: number, status: number) => {
    return await request.put({
      url: `/erp/purchase-order/update-status`,
      params: {
        id,
        status
      }
    })
  },

  // 删除采购订单
  deletePurchaseRequest: async (ids: number[]) => {
    return await request.delete({
      url: `/erp/purchase-order/delete`,
      params: {
        ids: ids.join(',')
      }
    })
  },

  // 导出ERP采购申请单 Excel
  exportPurchaseRequest: async (params) => {
    return await request.download({ url: `/erp/purchase-request/export-excel`, params })
  }
}
