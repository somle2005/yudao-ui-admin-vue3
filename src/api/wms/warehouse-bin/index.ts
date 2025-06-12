import request from '@/config/axios'

// 库位 VO
export interface WarehouseBinVO {
  id: number // 主键
  code: string // 代码
  name: string // 名称
  warehouseId: number // 归属的仓库ID
  zoneId: number // 库区ID
  pickingOrder: number // 拣货顺序
  status: number // 状态，WMS通用的对象有效状态 ; ValidStatus : 0-不可用 , 1-可用
}

export interface WarehouseBinSimpleVO {
  /**
   * 代码
   */
  code?: string
  /**
   * 名称
   */
  name?: string
  /**
   * 归属的仓库ID
   */
  warehouseId?: number
  /**
   * 库区ID
   */
  zoneId?: number
}

// 库位 API
export const WarehouseBinApi = {
  // 查询库位分页
  getWarehouseBinPage: async (params: any) => {
    return await request.get({ url: `/wms/warehouse-bin/page`, params })
  },

  // 查询库位详情
  getWarehouseBin: async (id: number) => {
    return await request.get({ url: `/wms/warehouse-bin/get?id=` + id })
  },

  // 新增库位
  createWarehouseBin: async (data: WarehouseBinVO) => {
    return await request.post({ url: `/wms/warehouse-bin/create`, data })
  },

  // 修改库位
  updateWarehouseBin: async (data: WarehouseBinVO) => {
    return await request.put({ url: `/wms/warehouse-bin/update`, data })
  },

  // 删除库位
  deleteWarehouseBin: async (id: number) => {
    return await request.delete({ url: `/wms/warehouse-bin/delete?id=` + id })
  },

  // 导出库位 Excel
  exportWarehouseBin: async (params) => {
    return await request.download({ url: `/wms/warehouse-bin/export-excel`, params })
  },

  // 获得库位置精简列表
  getWarehouseBinSimpleList: async (params?: WarehouseBinSimpleVO) => {
    return await request.get({ url: '/wms/warehouse-bin/simple-list', params })
  },

  // 获得库位置精简列表
  getWarehouseBinExchangeSimpleList: async (params?: any) => {
    return await request.get({ url: '/wms/warehouse-bin/exchange/simple-list', params })
  }
}
