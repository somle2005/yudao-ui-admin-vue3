import request from '@/config/axios'

// 文件 VO
export interface MediaResourceVO {
  id: number // 编号
  appCode: string // 应用编码
  moduleCode: string // 模块编码
  title: string // 资源标题
  description: string // 资源描述
  storagePath: string // 存储路径
  mediaType: number // 资源类型1图片2视频3音频4文档
}

// 文件 API
export const MediaResourceApi = {
  // 查询文件分页
  getMediaResourcePage: async (data: any) => {
    return await request.post({ url: `/cms/media-resource/page`, data })
  },

  // 查询文件详情
  getMediaResource: async (id: number) => {
    return await request.get({ url: `/cms/media-resource/get?id=` + id })
  },

  // 新增文件
  createMediaResource: async (data: MediaResourceVO) => {
    return await request.post({ url: `/cms/media-resource/create`, data })
  },

  // 修改文件
  updateMediaResource: async (data: MediaResourceVO) => {
    return await request.put({ url: `/cms/media-resource/update`, data })
  },

  // 删除文件
  deleteMediaResource: async (id: number) => {
    return await request.delete({ url: `/cms/media-resource/delete?id=` + id })
  },

  // 导出文件 Excel
  exportMediaResource: async (params) => {
    return await request.download({ url: `/cms/media-resource/export-excel`, params })
  },
}
