<template>
  <!-- <doc-alert title="报表设计器" url="https://doc.iocoder.cn/report/" /> -->

  <ContentWrap :bodyStyle="{ padding: '0px' }" class="!mb-0">
    
    <a href="https://app.powerbi.cn/home" target="_blank">跳转到新窗口打开</a>
    <ElText>
      <br />账号: 
      <br />general@somleNB.partner.onmschina.cn
      <br />密码: 
      <br />Somle2023
    </ElText>

    <IFrame :src="src" />


  </ContentWrap>
</template>
<script lang="ts" setup>
// import { getAccessToken } from '@/utils/auth'

defineOptions({ name: 'PowerBI' })

// const src = 'http://127.0.0.1:3000'
const src = 'https://app.powerbi.cn/home'
// const src = ref(import.meta.env.VITE_BASE_URL + '/jmreport/list?token=' + getAccessToken())
</script>