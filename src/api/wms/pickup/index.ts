import request from '@/config/axios'

// 拣货单 VO
export interface PickupVO {
  id: number // 主键
  no: string // 单据号
  warehouseId: number // 仓库ID
  itemList: any[] // 详情清单
}

// 拣货单 API
export const PickupApi = {
  // 查询拣货单分页
  getPickupPage: async (data: any) => {
    return await request.post({ url: `/wms/pickup/page`, data })
  },

  // 查询拣货单详情
  getPickup: async (id: number) => {
    return await request.get({ url: `/wms/pickup/get?id=` + id })
  },

  // 新增拣货单
  createPickup: async (data: PickupVO) => {
    return await request.post({ url: `/wms/pickup/create`, data })
  },

  // 修改拣货单
  updatePickup: async (data: PickupVO) => {
    return await request.put({ url: `/wms/pickup/update`, data })
  },

  // 删除拣货单
  deletePickup: async (id: number) => {
    return await request.delete({ url: `/wms/pickup/delete?id=` + id })
  },

  // 导出拣货单 Excel
  exportPickup: async (params) => {
    return await request.download({ url: `/wms/pickup/export-excel`, params })
  },
}
