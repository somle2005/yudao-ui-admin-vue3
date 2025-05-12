import request from '@/config/axios'

// 库区 VO
export interface WarehouseZoneVO {
  id: number // 主键
  code: string // 代码
  name: string // 名称
  warehouseId: number // 归属的仓库ID
  stockType: number // 存货类型 ; WarehouseAreaStockType : 1-拣货 , 2-存储
  partitionType: number // 分区类型 ; WarehouseAreaPartitionType : 1-标准品 , 2-不良品
  status: number // 状态，WMS通用的对象有效状态 ; ValidStatus : 0-不可用 , 1-可用
  priority: number // 优先级
}

// 库区 API
export const WarehouseZoneApi = {
  // 查询库区分页
  getWarehouseZonePage: async (params: any) => {
    return await request.get({ url: `/wms/warehouse-zone/page`, params })
  },

  // 查询库区详情
  getWarehouseZone: async (id: number) => {
    return await request.get({ url: `/wms/warehouse-zone/get?id=` + id })
  },

  // 新增库区
  createWarehouseZone: async (data: WarehouseZoneVO) => {
    return await request.post({ url: `/wms/warehouse-zone/create`, data })
  },

  // 修改库区
  updateWarehouseZone: async (data: WarehouseZoneVO) => {
    return await request.put({ url: `/wms/warehouse-zone/update`, data })
  },

  // 删除库区
  deleteWarehouseZone: async (id: number) => {
    return await request.delete({ url: `/wms/warehouse-zone/delete?id=` + id })
  },

  // 导出库区 Excel
  exportWarehouseZone: async (params) => {
    return await request.download({ url: `/wms/warehouse-zone/export-excel`, params })
  },

  // 获得库区精简列表
  getWarehouseZoneSimpleList: async (params: any) => {
    return await request.get({ url: '/wms/warehouse-zone/simple-list', params })
  }
}
