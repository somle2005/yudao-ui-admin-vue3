import request from '@/config/axios'

// ERP 海关规则 VO
export interface PowerbiReportVO {
  groupId: string
  reportId: string
  embedUrl: string
  reportToken: string
}

// power bi api
export const PowerbiApi = {
  // 获取entra id access_token
  getEmbedReport: async (params: any) => {
    const json = JSON.stringify({
      accessLevel: 'View',
      identities: [
        {
          username: 'john@contoso.com',
          roles: ['role2'],
          datasets: ['cca9ee13-c3d8-4066-b6d4-2e9c8bf05feb']
        }
      ]
    })
    const response = await request.get({
      url: `/microsoft/getEmbedReport`,
      params,
      headers: { 'data-raw': json }
    })
    console.log('API Response:', response) // Log the response
    return response
  }
}
