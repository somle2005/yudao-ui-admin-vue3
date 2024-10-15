<template>
  <!-- <doc-alert title="报表设计器" url="https://doc.iocoder.cn/report/" /> -->

  <ContentWrap :bodyStyle="{ padding: '0px' }" class="!mb-0">

    <PowerBIReportEmbed 
    :embedConfig="embedConfig"
    :phasedEmbedding="true"
  />
    
    <!-- <a href="https://app.powerbi.cn/home" target="_blank">跳转到新窗口打开</a>
    <ElText>
      <br />账号: 
      <br />general@somleNB.partner.onmschina.cn
      <br />密码: 
      <br />Somle2023<br />
    </ElText> -->
    <!-- <ElText>
      {{ deptName }}
    </ElText> -->
    <div>{{ deptName }}</div>

    <!-- <IFrame src="https://app.powerbi.cn/view?r=eyJrIjoiODBjZDA5NmUtYjM3Yy00MmYzLWI4MTctOGM2N2U4ZmZiZDQ3IiwidCI6IjllYzI5NDE2LTc3MmMtNDFlNC05ODk0LTlmNTM3YTRmYjQxMiJ9&filter=dim_main_info/site_name eq 'FITUEYES US'" /> -->
    <!-- <IFrame src="https://app.powerbi.cn/reportEmbed?reportId=1da2d9c2-11f2-4cd8-8a33-9eff31d8b614&autoAuth=true&ctid=9ec29416-772c-41e4-9894-9f537a4fb412&filter=dim_main_info/site_name eq 'FITUEYES US'" /> -->
    <!-- <IFrame src="https://app.powerbi.cn/view?r=eyJrIjoiOTQ3MWQyYTctNzQ1Ny00ZDA0LWE5YWUtZDRjYjA2MjI2ZGU0IiwidCI6IjllYzI5NDE2LTc3MmMtNDFlNC05ODk0LTlmNTM3YTRmYjQxMiJ9" /> -->
    <!-- <IFrame src="https://app.powerbi.cn/view?r=eyJrIjoiZGJkMWE4MTgtYTY3ZC00NWU2LWI5ODQtN2Q4YjExODNiY2Q2IiwidCI6IjllYzI5NDE2LTc3MmMtNDFlNC05ODk0LTlmNTM3YTRmYjQxMiJ9" /> -->





  </ContentWrap>
</template>


<script lang="ts" setup>
defineOptions({ name: 'ShopifyBI' })
// import { getAccessToken } from '@/utils/auth'
// import IFrame from 'vue';
// import { DeptVO, getDept } from '@/api/system/dept';
import * as DeptApi from '@/api/system/dept'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import { PowerBIReportEmbed } from 'powerbi-client-vue-js';

import { IReportEmbedConfiguration } from 'powerbi-client';
// import { EventHandler } from '@/utils/utils';
import { models } from 'powerbi-client'; // Make sure to import any additional modules you need for config

const reportId = "https://app.powerbi.cn/reportEmbed?reportId=1da2d9c2-11f2-4cd8-8a33-9eff31d8b614&autoAuth=true&ctid=9ec29416-772c-41e4-9894-9f537a4fb412"
const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Inc5ZTlYdm5ZVzNSVmVMRUw5QkNUWnFDRl9wSSIsImtpZCI6Inc5ZTlYdm5ZVzNSVmVMRUw5QkNUWnFDRl9wSSJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLmNoaW5hY2xvdWRhcGkuY24vcG93ZXJiaS9hcGkiLCJpc3MiOiJodHRwczovL3N0cy5jaGluYWNsb3VkYXBpLmNuLzllYzI5NDE2LTc3MmMtNDFlNC05ODk0LTlmNTM3YTRmYjQxMi8iLCJpYXQiOjE3Mjg5ODE2MjMsIm5iZiI6MTcyODk4MTYyMywiZXhwIjoxNzI4OTg1NTIzLCJhY2N0IjowLCJhY3IiOiIxIiwiYWlvIjoiQVRRQXkvOE5BQUFBOWIwbnlGeUYwSEI4R09Sb0FRczVSVXhVdTNLVVpUNXo1T3ZqM1d3eHVtalVvMUhsM0M0L0RVRGl2d20wdkJsayIsImFtciI6WyJwd2QiXSwiYXBwaWQiOiI4YWQ4ZmRiNC0xN2JiLTQwOWEtYjI5Yy0wZDVmMmUxNjhiZTQiLCJhcHBpZGFjciI6IjEiLCJpZHR5cCI6InVzZXIiLCJpcGFkZHIiOiIyMjMuOTQuNTYuMjIiLCJuYW1lIjoi57Si6L-I55So5oi3Iiwib2lkIjoiN2E5NmFhNjYtZDUzNC00NTdjLWI1MTItMDcyNGMwYzUzMmVmIiwicHVpZCI6IjEwMDMzMjMwQzZBRTczNDciLCJyaCI6IjAuREFJQUZwVENuaXgzNUVHWWxKOVRlay0wRWdrQUFBQUFBQUFBd0FBQUFBQUFBQUFCQUJRLiIsInNjcCI6IlJlcG9ydC5SZWFkLkFsbCBXb3Jrc3BhY2UuUmVhZC5BbGwiLCJzdWIiOiJzU2l4SmwxNmF4UW80eC1fa3p5OWxMQnRSZkpibzgtdHktSndRZDAxQVVJIiwidGlkIjoiOWVjMjk0MTYtNzcyYy00MWU0LTk4OTQtOWY1MzdhNGZiNDEyIiwidW5pcXVlX25hbWUiOiJnZW5lcmFsQHNvbWxlTkIucGFydG5lci5vbm1zY2hpbmEuY24iLCJ1cG4iOiJnZW5lcmFsQHNvbWxlTkIucGFydG5lci5vbm1zY2hpbmEuY24iLCJ1dGkiOiJPUERDcmQ5NzNFQ0NlcHVYMFBGY0FBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX2lkcmVsIjoiMSA2In0.bQsGxZgw8Q86rRz5n1JAfe5nXM4TnAUN84XZTDYIrdoJbYb3JwKc1ShO1Vq8jA6QdRN2HooHpi7_SjgcAlmnK4GLkIELYagoMmprn8qAct7tQIH4kHUd4uw0oNFhJcFKyX5szJgUd-7Lmn3_V00f454fNk-4_6dISQGQ8lmG1nexiZR10m8RtyBRazKOGmWB8dnXvA3P5dySEQmOiFecM8kgTfpSd1jWhqc0a_W17EHSyKtZxZRWMo2_vj2_JXwyS26ZgD9ojvhTclE-U_oT1En9-dM0GUCTiN9HYsRFOqNdLPHgqm3JxcqItYgsfi2-IFhqDMpcMCLDsBmgjTtz6A"


// Define the embed configuration
const embedConfig = ref<IReportEmbedConfiguration>({
  type: 'report',
  id: reportId,
  embedUrl: "https://app.powerbi.cn/reportEmbed?reportId=" + reportId,
  accessToken: accessToken,
  tokenType: models.TokenType.Aad,
  // tokenType: models.TokenType.Embed,
  permissions: models.Permissions.All,
});

// // Set up the event handlers
// const eventHandlers = ref<Map<string, EventHandler>>(new Map([
//   ['loaded', (event) => { console.log('Report loaded:', event); }],
//   ['error', (event) => { console.error('Report error:', event); }],
// ]));

// // Event handler for the `report-obj` emitted event
// const handleReportObject = (report: any) => {
//   console.log('Received Report Object:', report);
// };



// // Define your configurations
// const embedConfig = {
//   type: "report",
//   id: reportId,
//   embedUrl: "https://app.powerbi.cn/reportEmbed?reportId=" + reportId,
//   accessToken: accessToken,
//   tokenType: models.TokenType.Embed,
//   settings: {
//     panes: {
//       filters: {
//         expanded: false,
//         visible: false
//       }
//     },
//     background: models.BackgroundType.Transparent,
//   }
// };

// const cssClassName = "reportClass";
// const phasedEmbedding = false;

// const eventHandlers = new Map([
//   ['loaded', () => console.log('Report loaded')],
//   ['rendered', () => console.log('Report rendered')],
//   ['error', (event) => console.log(event.detail)]
// ]);





// const src = ref(import.meta.env.VITE_BASE_URL + '/jmreport/list?token=' + getAccessToken())

const frameRef = ref<HTMLIFrameElement | null>(null);
const deptName = ref('');


async function getUserDeptName(): Promise<string> {
  const { wsCache } = useCache()
  // 获取用户拥有的角色
  const id = wsCache.get(CACHE_KEY.USER).user.deptId
  const dept = await DeptApi.getDept(id) as DeptApi.DeptVO
  return dept.name
}
// const iframeComponent = ref<InstanceType<typeof IFrame> | null>(null);

onMounted(async () => {
  console.log('Page is fully loaded')// Access iframe through the ref
  // const deptName = ref(getUserDeptName())
  deptName.value = await getUserDeptName();


  // if (iframeComponent.value?.frameRef) {
  //   // Access the iframe element directly
  //   console.log(iframeComponent.value.frameRef)
  //   // Perform actions on the iframe, e.g., change attributes or call methods
  //   iframeComponent.value.frameRef.src = 'https://another-example.com'
  // }

  // iframe.onload = () => {
  //   console.log('Frame is loading');
  //   const iframeDocument = iframe.contentDocument || iframe.contentWindow.document; // Access the iframe's document
    
  //   // Click the button inside the iframe
  //   const buttons = iframeDocument.getElementsByClassName('bibutton primary pbi-fluent-button');
  //   if (buttons.length > 0) {
  //     buttons[0].click();
  //   }

  //   // Fill in the username
  //   const usernameInput = iframeDocument.getElementById('i0116');
  //   if (usernameInput) {
  //     usernameInput.value = '您的用户名';
  //   }

  //   // Optionally, proceed to password input and login (uncomment if needed)
  //   // const nextButton = iframeDocument.getElementById('idSIButton9');
  //   // if (nextButton) nextButton.click();
  //   // const passwordInput = iframeDocument.getElementById('i0118');
  //   // if (passwordInput) passwordInput.value = '您的密码';
  //   // if (nextButton) nextButton.click();
  // };
});

</script>