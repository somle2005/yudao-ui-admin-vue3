<template>
  <!-- <doc-alert title="报表设计器" url="https://doc.iocoder.cn/report/" /> -->

  <ContentWrap :bodyStyle="{ padding: '0px' }" class="!mb-0">
    
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

    <IFrame src="https://app.powerbi.cn/view?r=eyJrIjoiODBjZDA5NmUtYjM3Yy00MmYzLWI4MTctOGM2N2U4ZmZiZDQ3IiwidCI6IjllYzI5NDE2LTc3MmMtNDFlNC05ODk0LTlmNTM3YTRmYjQxMiJ9&filter=dim_main_info/site_name eq 'FITUEYES US'" />
    <IFrame src="https://app.powerbi.cn/reportEmbed?reportId=1da2d9c2-11f2-4cd8-8a33-9eff31d8b614&autoAuth=true&ctid=9ec29416-772c-41e4-9894-9f537a4fb412&filter=dim_main_info/site_name eq 'FITUEYES US'" />
    <!-- <IFrame src="https://app.powerbi.cn/view?r=eyJrIjoiOTQ3MWQyYTctNzQ1Ny00ZDA0LWE5YWUtZDRjYjA2MjI2ZGU0IiwidCI6IjllYzI5NDE2LTc3MmMtNDFlNC05ODk0LTlmNTM3YTRmYjQxMiJ9" /> -->
    <IFrame src="https://app.powerbi.cn/view?r=eyJrIjoiZGJkMWE4MTgtYTY3ZC00NWU2LWI5ODQtN2Q4YjExODNiY2Q2IiwidCI6IjllYzI5NDE2LTc3MmMtNDFlNC05ODk0LTlmNTM3YTRmYjQxMiJ9" />





  </ContentWrap>
</template>


<script lang="ts" setup>
// import { getAccessToken } from '@/utils/auth'
// import IFrame from 'vue';
// import { DeptVO, getDept } from '@/api/system/dept';
import * as DeptApi from '@/api/system/dept'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'



defineOptions({ name: 'ShopifyBI' })

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