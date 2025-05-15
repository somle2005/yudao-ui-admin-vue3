import request from '@/config/axios'

// TMS港口信息 VO
export interface PortInfoVO {
  code: string // 港口编码
  name: string // 港口中文名
  nameEn: string // 港口英文名
  countryCode: number // 国家代码(字典)
  countryName: string // 国家描述
  cityName: string // 城市中文名
  cityNameEn: string // 城市英文名
  remark: string // 备注
  status: boolean // 启用/禁用状态
}

// TMS港口信息 API
export const PortInfoApi = {
  // 查询TMS港口信息分页
  getPortInfoPage: async (params: any) => {
    return await request.get({ url: `/tms/port-info/page`, params })
  },

  // 查询TMS港口信息详情
  getPortInfo: async (id: number) => {
    return await request.get({ url: `/tms/port-info/get?id=` + id })
  },

  // 新增TMS港口信息
  createPortInfo: async (data: PortInfoVO) => {
    return await request.post({ url: `/tms/port-info/create`, data })
  },

  // 修改TMS港口信息
  updatePortInfo: async (data: PortInfoVO) => {
    return await request.put({ url: `/tms/port-info/update`, data })
  },

  // 删除TMS港口信息
  deletePortInfo: async (id: number) => {
    return await request.delete({ url: `/tms/port-info/delete?id=` + id })
  },

  // 导出TMS港口信息 Excel
  exportPortInfo: async (params) => {
    return await request.download({ url: `/tms/port-info/export-excel`, params })
  },

  // TMS港口信息精简列表
  getPortInfoSimpleList: async (params?: any) => {
    return await request.get({ url: `/tms/port-info/simple-list`, params })
  }
}
