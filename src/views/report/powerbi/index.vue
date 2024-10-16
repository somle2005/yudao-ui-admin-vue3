

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

    <PowerBIReportEmbed
      v-if="configReady"
      class="w-full h-[calc(100vh-var(--top-tool-height)-var(--tags-view-height)-var(--app-content-padding)-var(--app-content-padding)-2px)]"
      :embedConfig="embedConfig"
    />

<!--    <IFrame src = "https://app.powerbi.cn/reportEmbed?reportId=e5e3fbe6-bd1b-479a-b417-fac868bcbd4a&groupId=992affd7-1e95-4213-bb80-758a9d1dbe86&w=2&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLU1DLVNIQS1yZWRpcmVjdC5hbmFseXNpcy5jaGluYWNsb3VkYXBpLmNuIiwiZW1iZWRGZWF0dXJlcyI6eyJ1c2FnZU1ldHJpY3NWTmV4dCI6dHJ1ZX19" />-->

    <!-- <IFrame src="https://app.powerbi.cn/view?r=eyJrIjoiODBjZDA5NmUtYjM3Yy00MmYzLWI4MTctOGM2N2U4ZmZiZDQ3IiwidCI6IjllYzI5NDE2LTc3MmMtNDFlNC05ODk0LTlmNTM3YTRmYjQxMiJ9&filter=dim_main_info/site_name eq 'FITUEYES US'" /> -->
    <!-- <IFrame src="https://app.powerbi.cn/reportEmbed?reportId=1da2d9c2-11f2-4cd8-8a33-9eff31d8b614&autoAuth=true&ctid=9ec29416-772c-41e4-9894-9f537a4fb412&filter=dim_main_info/site_name eq 'FITUEYES US'" /> -->
    <!-- <IFrame src="https://app.powerbi.cn/view?r=eyJrIjoiOTQ3MWQyYTctNzQ1Ny00ZDA0LWE5YWUtZDRjYjA2MjI2ZGU0IiwidCI6IjllYzI5NDE2LTc3MmMtNDFlNC05ODk0LTlmNTM3YTRmYjQxMiJ9" /> -->
    <!-- <IFrame src="https://app.powerbi.cn/view?r=eyJrIjoiZGJkMWE4MTgtYTY3ZC00NWU2LWI5ODQtN2Q4YjExODNiY2Q2IiwidCI6IjllYzI5NDE2LTc3MmMtNDFlNC05ODk0LTlmNTM3YTRmYjQxMiJ9" /> -->





  </ContentWrap>
</template>




<script lang="ts" setup>
import { IBootstrapEmbedConfiguration } from 'embed'

defineOptions({ name: 'ShopifyBI' })
// import { getAccessToken } from '@/utils/auth'
// import IFrame from 'vue';
// import { DeptVO, getDept } from '@/api/system/dept';
import * as DeptApi from '@/api/system/dept'
import { PowerbiApi} from '@/api/report/powerbi';
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import { PowerBIReportEmbed} from 'powerbi-client-vue-js';

import { IReportEmbedConfiguration, IEmbedSettings} from 'powerbi-client';
// import { EventHandler } from '@/utils/utils';
import { models } from 'powerbi-client'; // Make sure to import any additional modules you need for config

const configReady = ref(false);

const queryParams = {
  groupId : "992affd7-1e95-4213-bb80-758a9d1dbe86",
  reportId : "e5e3fbe6-bd1b-479a-b417-fac868bcbd4a",
}


const filter: models.IBasicFilter = {
  target: { table: "stylesku", column: "stylesku" },
  operator: "In",
  values: ["F07F4061L"],
  $schema: '',
  filterType: models.FilterType.Basic
};

// // Define the embed configuration
// const embedConfig = ref<IReportEmbedConfiguration>({
//   id: undefined,
//   embedUrl: undefined,
//   accessToken: undefined,
//   type: 'report',
//   settings: {
//     // filterPaneEnabled:false,
//     // customLayout: {
//     //   pageSize: {
//     //     type:5
//     //   },
//     //   displayOption: 2,
//     //   // pagesLayout: 1,
//     //   // reportAlignment: 0;
//     // },
//     // layoutType: 0
//   },
//   filters: [filter],
//   tokenType: models.TokenType.Embed,
//   permissions: models.Permissions.All,
// });

const embedConfig = ref<IReportEmbedConfiguration>({
  type: 'report',
  settings: {
    // filterPaneEnabled:false,
    // customLayout: {
    //   pageSize: {
    //     type:5
    //   },
    //   displayOption: 2,
    //   // pagesLayout: 1,
    //   // reportAlignment: 0;
    // },
    // layoutType: 0
  },
  filters: [filter],
  tokenType: models.TokenType.Embed,
  permissions: models.Permissions.All,
  hostname: "https://app.powerbi.cn"
});




// const src = ref(import.meta.env.VITE_BASE_URL + '/jmreport/list?token=' + getAccessToken())

const frameRef = ref<HTMLIFrameElement | null>(null);
const deptName = ref('');

const getReport = async () => {
  try {
    const embedReport = await PowerbiApi.getEmbedReport(queryParams)
    console.log(embedReport.reportId)
    embedConfig.value.id = embedReport.reportId
    embedConfig.value.embedUrl = embedReport.embedUrl
    embedConfig.value.accessToken = embedReport.reportToken
    console.log(embedConfig.value)
    configReady.value = true
  } finally {
  }
}


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
  await getReport()


});

</script>
