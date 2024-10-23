

<template>
  <h2>{{userDeptId}}</h2>
  <PowerBIReportEmbed
    v-if="configReady"
    class="w-full h-[calc(100vh-var(--top-tool-height)-var(--tags-view-height)-var(--app-content-padding)-var(--app-content-padding)-2px)]"
    :embedConfig="embedConfig"
  />
</template>




<script lang="ts" setup>

defineOptions({ name: 'PowerBIReportFiltered' })
import { PowerbiApi} from '@/api/report/powerbi';
import { PowerBIReportEmbed} from 'powerbi-client-vue-js';
import { useUserStore } from '@/store/modules/user'

import { IReportEmbedConfiguration } from 'powerbi-client';
import { models } from 'powerbi-client';

const configReady = ref(false);
const userDeptId = useUserStore().getUser.deptId;

const queryParams = {
  groupId : "992affd7-1e95-4213-bb80-758a9d1dbe86",
  reportId : "e5e3fbe6-bd1b-479a-b417-fac868bcbd4a",
}


const filter: models.IBasicFilter = {
  target: { table: "system_dept", column: "id" },
  operator: "In",
  values: [userDeptId],
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


// const deptName = ref('');

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


onMounted(async () => {
  await getReport()
});

</script>
