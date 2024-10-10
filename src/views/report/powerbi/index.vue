<template>
  <!-- <doc-alert title="报表设计器" url="https://doc.iocoder.cn/report/" /> -->

  <ContentWrap :bodyStyle="{ padding: '0px' }" class="!mb-0">
    
    <a href="https://app.powerbi.cn/home" target="_blank">跳转到新窗口打开</a>
    <ElText>
      <br />账号: 
      <br />general@somleNB.partner.onmschina.cn
      <br />密码: 
      <br />Somle2023<br />
    </ElText>

    <IFrame ref="iframeComponent" src="https://app.powerbi.cn/reportEmbed?reportId=1da2d9c2-11f2-4cd8-8a33-9eff31d8b614&autoAuth=true&ctid=9ec29416-772c-41e4-9894-9f537a4fb412" />
    <IFrame src="https://app.powerbi.cn/reportEmbed?reportId=e3c7c618-0442-411c-bd61-11ca72a065a8&autoAuth=true&ctid=9ec29416-772c-41e4-9894-9f537a4fb412" />
    <!-- <iframe ref="frameRef" title="独立站流量" width="1140" height="541.25" src="https://app.powerbi.cn/reportEmbed?reportId=1da2d9c2-11f2-4cd8-8a33-9eff31d8b614&autoAuth=true&ctid=9ec29416-772c-41e4-9894-9f537a4fb412" frameborder="0" allowFullScreen="true"></iframe> -->



  </ContentWrap>
</template>


<script lang="ts" setup>
// import { getAccessToken } from '@/utils/auth'
// import IFrame from 'vue';

defineOptions({ name: 'ShopifyBI' })

// const src = 'http://127.0.0.1:3000'
// const src = 'https://app.powerbi.cn/home'
// const src = ref(import.meta.env.VITE_BASE_URL + '/jmreport/list?token=' + getAccessToken())

// const frameRef = ref<HTMLIFrameElement | null>(null);

// onMounted(() => {
//   console.log('Page is fully loaded');
//     // var iframe = frameRef
//   var iframe = document.getElementById('biFrame'); // 获取iframe元素
//   iframe.onload = function() {
//     console.log('Frame is loading');
//     var iframeDocument = iframe.contentDocument || iframe.contentWindow.document; // 获取iframe的文档对象

//     const buttons = iframeDocument.getElementsByClassName('bibutton primary pbi-fluent-button');
//     buttons[0].click();
    
//     // 填写用户名和密码
//     var usernameInput = iframeDocument.getElementById('i0116');
//     usernameInput.value = '您的用户名';
//     // var nextButton = iframeDocument.getElementById('idSIButton9');
//     // nextButton.click();
//     // var passwordInput = iframeDocument.getElementById('i0118');
//     // passwordInput.value = '您的密码';
//     // var nextButton = iframeDocument.getElementById('idSIButton9');
//     // nextButton.click();
    
//     // 执行登录操作
//   }
// });

// const iframeComponent = ref<InstanceType<typeof IFrame> | null>(null);

onMounted(() => {
  console.log('Page is fully loaded');// Access iframe through the ref

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