import request from '@/config/axios'

// 字段属性 VO
export interface FieldVO {
  id: number // 数据类型ID
  attribute: string // 属性名称
  key: string // 属性名对应键
  sort: number // 显示顺序
  require: boolean // 是否必须
  type: number // 数据类型
}

// 字段属性 API
export const FieldApi = {
  // 查询字段属性分页
  getFieldPage: async (params: any) => {
    return await request.get({ url: `/system/field/page`, params })
  },

  // 查询字段属性详情
  getField: async (id: number) => {
    return await request.get({ url: `/system/field/get?id=` + id })
  },

  // 新增字段属性
  createField: async (data: FieldVO) => {
    return await request.post({ url: `/system/field/create`, data })
  },

  // 修改字段属性
  updateField: async (data: FieldVO) => {
    return await request.put({ url: `/system/field/update`, data })
  },

  // 删除字段属性
  deleteField: async (id: number) => {
    return await request.delete({ url: `/system/field/delete?id=` + id })
  },

  // 导出字段属性 Excel
  exportField: async (params) => {
    return await request.download({ url: `/system/field/export-excel`, params })
  },
}
