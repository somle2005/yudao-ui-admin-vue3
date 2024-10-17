

<template>

  <ContentWrap :bodyStyle="{ padding: '0px' }" class="!mb-0">

    <div>{{ deptName }}</div>

    <PowerBIReportEmbed
      v-if="configReady"
      class="w-full h-[calc(100vh-var(--top-tool-height)-var(--tags-view-height)-var(--app-content-padding)-var(--app-content-padding)-2px)]"
      :embedConfig="embedConfig"
    />

  </ContentWrap>
</template>




<script lang="ts" setup>

defineOptions({ name: 'ShopifyBI' })
import * as DeptApi from '@/api/system/dept'
import { PowerbiApi} from '@/api/report/powerbi';
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import { PowerBIReportEmbed} from 'powerbi-client-vue-js';

import { IReportEmbedConfiguration } from 'powerbi-client';
import { models } from 'powerbi-client';

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
  deptName.value = await getUserDeptName();
  await getReport()


});

</script>
