import request from '@/config/axios'

// 字段属性 VO
export interface DataTypeVO {
  id: number // 数据类型ID
  attribute: string // 属性名称
  key: string // 属性名对应键
  sort: number // 显示顺序
  require: boolean // 是否必须
  type: number // 数据类型
}

// 字段属性 API
export const DataTypeApi = {
  // 查询字段属性分页
  getDataTypePage: async (params: any) => {
    return await request.get({ url: `/system/data-type/page`, params })
  },

  // 查询字段属性详情
  getDataType: async (id: number) => {
    return await request.get({ url: `/system/data-type/get?id=` + id })
  },

  // 新增字段属性
  createDataType: async (data: DataTypeVO) => {
    return await request.post({ url: `/system/data-type/create`, data })
  },

  // 修改字段属性
  updateDataType: async (data: DataTypeVO) => {
    return await request.put({ url: `/system/data-type/update`, data })
  },

  // 删除字段属性
  deleteDataType: async (id: number) => {
    return await request.delete({ url: `/system/data-type/delete?id=` + id })
  },

  // 导出字段属性 Excel
  exportDataType: async (params) => {
    return await request.download({ url: `/system/data-type/export-excel`, params })
  },
}