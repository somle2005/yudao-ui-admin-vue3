import request from '@/config/axios'

// 头程单 VO
export interface FirstMileVO {
  code: string // 编码
  billTime: Date // 单据日期
  carrierId: string // 物流商ID
  settlementDate: Date // 结算日期
  balance: number // 应付款余额
  toWarehouseId: number // 目的仓ID
  ladingNo: string // 提单号
  cabinetType: number // 柜型（字典）
  packTime: Date // 装柜日期
  arrivePlanTime: Date // 预计到货日期
  deliveryEstimateTime: Date // 预计送仓时间
  deliveryActualTime: Date // 实际送仓时间
  totalVolume: number // 货柜体积（m³）
  totalWeight: number // 货柜毛重（kg）
  netWeight: number // 货柜净重（kg）
  totalValue: number // 货柜货值（按最近采购价）
  totalQty: number // 货柜件数
  remark: string // 备注
  outboundStatus: number // 发货状态
  outboundTime: Date // 出库时间
  inboundStatus: number // 入库状态
  inboundTime: Date // 入库时间
}

export interface FirstMileAuditVO {
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

export interface FirstMileStockListVO {
  /**
   * 产品部门对应关系列表
   */
  relations: FirstMileRelation[]
  /**
   * 仓库编号
   */
  warehouseId: number
}
export interface FirstMileRelation {
  /**
   * 部门编号
   */
  deptId: number
  /**
   * 产品编号
   */
  productId: number
}

// 头程单 API
export const FirstMileApi = {
  // 查询头程单分页
  getFirstMilePage: async (data: any) => {
    return await request.post({ url: `/tms/first-mile/page`, data })
  },

  // 查询头程单详情
  getFirstMile: async (id: number) => {
    return await request.get({ url: `/tms/first-mile/get?id=` + id })
  },

  // 新增头程单
  createFirstMile: async (data: FirstMileVO) => {
    return await request.post({ url: `/tms/first-mile/create`, data })
  },

  // 修改头程单
  updateFirstMile: async (data: FirstMileVO) => {
    return await request.put({ url: `/tms/first-mile/update`, data })
  },

  // 删除头程单
  deleteFirstMile: async (id: number) => {
    return await request.delete({ url: `/tms/first-mile/delete?id=` + id })
  },

  // 导出头程单 Excel
  exportFirstMile: async (params) => {
    return await request.download({ url: `/tms/first-mile/export-excel`, params })
  },

  // ==================== 子表（头程单明细） ====================

  // 获得头程单明细列表
  getFirstMileItemListByFirstMileId: async (firstMileId) => {
    return await request.get({
      url: `/tms/first-mile/first-mile-item/list-by-first-mile-id?firstMileId=` + firstMileId
    })
  },

  // ==================== 子表（出运订单费用明细） ====================

  // 获得出运订单费用明细列表
  getFeeListBySourceId: async (sourceId) => {
    return await request.get({ url: `/tms/first-mile/fee/list-by-source-id?sourceId=` + sourceId })
  },

  // 获取最新的单据编号
  getFirstMileLatestNo: async () => {
    return await request.get({ url: `/tms/first-mile/get-latest-no` })
  },

  // 头程申请单 提交审核
  submitFirstMileAudit: async (data: number[]) => {
    return await request.put({ url: `/tms/first-mile/submit-audit`, data })
  },

  // 头程申请单 审核/反审核
  auditFirstMileStatus: async (params: FirstMileAuditVO) => {
    return await request.put({ url: `/tms/first-mile-request/audit-status`, params })
  },

  // 批量查询产品库存信息 批量查询库存公司
  getFirstMileStockList: async (data: FirstMileStockListVO) => {
    return await request.post({ url: `/tms/first-mile/stock/list`, data })
  }
}
