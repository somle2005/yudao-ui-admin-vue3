import request from '@/config/axios'

// ERP 海关规则 VO
export interface PowerbiReportVO {
  groupId : string,
  reportId : string,
  embedUrl : string,
  reportToken : string,
}

// power bi api
export const PowerbiApi = {
  // 获取entra id access_token
  getEmbedReport: async (params: any) => {
    const response = await request.get({ url: `/microsoft/getEmbedReport`, params });
    console.log("API Response:", response);  // Log the response
    return response;
  },
}
