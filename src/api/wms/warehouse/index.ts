import request from '@/config/axios'

// 仓库 VO
export interface WarehouseVO {
  id: number // 主键
  mode: number // 属性/模式 : 0-自营;1-三方;2-平台；
  code: string // 代码
  name: string // 名称
  externalStorageId: number // 外部存储ID
  externalStorageCode: string // 外部存储代码
  companyName: string // 公司名称
  country: string // 国家
  province: string // 省/州
  city: string // 市
  addressLine1: string // 详细地址1
  addressLine2: string // 详细地址2
  postcode: string // 邮编
  contactPerson: string // 联系人
  contactPhone: string // 联系的话
  isSync: number // 库存同步：0-关闭；1-开启；
}

// 仓库 API
export const WarehouseApi = {
  // 查询仓库分页
  getWarehousePage: async (data: any) => {
    return await request.post({ url: `/wms/warehouse/page`, data })
  },

  // 查询仓库详情
  getWarehouse: async (id: number) => {
    return await request.get({ url: `/wms/warehouse/get?id=` + id })
  },

  // 新增仓库
  createWarehouse: async (data: WarehouseVO) => {
    return await request.post({ url: `/wms/warehouse/create`, data })
  },

  // 修改仓库
  updateWarehouse: async (data: WarehouseVO) => {
    return await request.put({ url: `/wms/warehouse/update`, data })
  },

  // 删除仓库
  deleteWarehouse: async (id: number) => {
    return await request.delete({ url: `/wms/warehouse/delete?id=` + id })
  },

  // 导出仓库 Excel
  exportWarehouse: async (params) => {
    return await request.download({ url: `/wms/warehouse/export-excel`, params })
  },

  // 获取仓库精简信息列表
  getWarehouseSimpleList: async () => {
    return await request.get({ url: '/wms/warehouse/simple-list' })
  },

  // 获取仓库精简信息列表
  getWarehouseExchangeSimpleList: async (params: any) => {
    return await request.get({ url: '/wms/warehouse/exchange/simple-list', params })
  }
}
