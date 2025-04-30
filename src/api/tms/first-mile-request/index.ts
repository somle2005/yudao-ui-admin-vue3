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

  // 获得头程申请表明细列表
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

  // 头程申请表提交审核
  submitFirstMileRequestAudit: async (data: { ids: number[] }) => {
    return await request.post({ url: `/tms/first-mile-request/submit-audit`, data })
  }
}
