import request from '@/config/axios'

// 头程申请单 VO
export interface FirstMileRequestVO {
  id: number // 主键ID
  code: string // 单据编号
  requestUserId: number // 申请人ID
  requestDeptId: number // 申请部门ID
  toWarehouseId: number // 目的仓ID
  totalWeight: number // 总重量（kg）
  totalVolume: number // 总体积（m³）
  items: any[] // 头程申请表明细列表
}

export interface FirstMileRequestAuditVO {
  /**
   * 通过与否
   * 审核通过/不通过
   */
  pass: boolean
  /**
   * 头程申请单ID集合
   */
  requestId: number
  /**
   * 审核意见
   */
  reviewComment?: string
  /**
   * 审核/反审核
   * 审核通过/审核撤销
   */
  reviewed: boolean
}

export interface FirstMileRequestProductStockVO {
  /**
   * 产品部门对应关系列表
   */
  relations: FirstMileRequestRelation[]
}
export interface FirstMileRequestRelation {
  /**
   * 部门编号
   */
  deptId: number
  /**
   * 产品编号
   */
  productId: number
  warehouseId: number
}

// 头程申请单 API
export const FirstMileRequestApi = {
  // 查询头程申请单分页
  getFirstMileRequestPage: async (data: any) => {
    return await request.post({ url: `/tms/first-mile-request/page`, data })
  },

  // 查询头程申请单详情
  getFirstMileRequest: async (id: number) => {
    return await request.get({ url: `/tms/first-mile-request/get?id=` + id })
  },

  // 新增头程申请单
  createFirstMileRequest: async (data: FirstMileRequestVO) => {
    return await request.post({ url: `/tms/first-mile-request/create`, data })
  },

  // 修改头程申请单
  updateFirstMileRequest: async (data: FirstMileRequestVO) => {
    return await request.put({ url: `/tms/first-mile-request/update`, data })
  },

  // 删除头程申请单
  deleteFirstMileRequest: async (id: number) => {
    return await request.delete({ url: `/tms/first-mile-request/delete?id=` + id })
  },

  // 导出头程申请单 Excel
  exportFirstMileRequest: async (params) => {
    return await request.download({ url: `/tms/first-mile-request/export-excel`, params })
  },

  // ==================== 子表（头程申请表明细） ====================

  // 获得头程申请单 明细列表
  getFirstMileRequestItemListByRequestId: async (requestId) => {
    return await request.get({
      url:
        `/tms/first-mile-request/first-mile-request-item/list-by-request-id?requestId=` + requestId
    })
  },

  // 获取最新的单据编号
  getFirstMileRequestLatestNo: async () => {
    return await request.get({ url: `/tms/first-mile-request/get-latest-no` })
  },

  // 头程申请单 提交审核
  submitFirstMileRequestAudit: async (data: { ids: number[] }) => {
    return await request.put({ url: `/tms/first-mile-request/submit-audit`, data })
  },

  // 头程申请单 启用/禁用申请单子项
  updateFirstMileRequestItemStatus: async (data: { itemIds: number[]; enable: boolean }) => {
    return await request.put({ url: `/tms/first-mile-request/update-item-status`, data })
  },

  // 头程申请单 审核/反审核
  auditFirstMileRequestStatus: async (params: FirstMileRequestAuditVO) => {
    return await request.put({ url: `/tms/first-mile-request/audit-status`, params })
  },
  // 头程申请单 合并头程申请单
  mergeFirstMileRequest: async (data: any) => {
    return await request.post({ url: `/tms/first-mile-request/merge`, data })
  },

  // 获取产品可用库存 权限字符 tms:first-mile-request:query 逻辑库存-采购在途数量 purchase_transit_qty
  getFirstMileRequestProductStock: async (data: FirstMileRequestProductStockVO) => {
    console.log('进来了多少次')
    const copyData = JSON.parse(JSON.stringify(data)) as any
    copyData.relations.forEach((item) => {
      item.availableQty = 100 
      item.purchaseTransitQty = 200 
    })
    const bodyData = {
      productStocks: copyData.relations
    }
    return await Promise.resolve(bodyData)
    // return await request.post({ url: `/tms/first-mile-request/get-product-stock`, data })
  }
}
