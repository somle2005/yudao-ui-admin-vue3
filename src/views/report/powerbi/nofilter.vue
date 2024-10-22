<template>
  <PowerBIReportEmbed
    v-if="configReady"
    class="w-full h-[calc(100vh-var(--top-tool-height)-var(--tags-view-height)-var(--app-content-padding)-var(--app-content-padding)-2px)]"
    :embedConfig="embedConfig"
  />
</template>

<script lang="ts" setup>
defineOptions({ name: 'PowerBIReport' })
import { ref, onMounted, defineProps } from 'vue';
import * as DeptApi from '@/api/system/dept';
import { PowerbiApi } from '@/api/report/powerbi';
import { CACHE_KEY, useCache } from '@/hooks/web/useCache';
import { PowerBIReportEmbed } from 'powerbi-client-vue-js';
import { IReportEmbedConfiguration, models } from 'powerbi-client';

const props = defineProps<{
  groupId: string;
  reportId: string;
}>();

const configReady = ref(false);

const embedConfig = ref<IReportEmbedConfiguration>({
  type: 'report',
  settings: {
    filterPaneEnabled:false,
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
  tokenType: models.TokenType.Embed,
  permissions: models.Permissions.All,
  hostname: "https://app.powerbi.cn"
});

const deptName = ref('');

const getReport = async () => {
  try {
    const embedReport = await PowerbiApi.getEmbedReport({
      groupId: props.groupId,
      reportId: props.reportId
    });
    embedConfig.value.id = embedReport.reportId;
    embedConfig.value.embedUrl = embedReport.embedUrl;
    embedConfig.value.accessToken = embedReport.reportToken;
    configReady.value = true;
  } catch (error) {
    console.error("Error fetching report:", error);
  }
};

async function getUserDeptName(): Promise<string> {
  const { wsCache } = useCache();
  const id = wsCache.get(CACHE_KEY.USER).user.deptId;
  const dept = await DeptApi.getDept(id) as DeptApi.DeptVO;
  return dept.name;
}

onMounted(async () => {
  deptName.value = await getUserDeptName();
  await getReport();
});

</script>

<style scoped>
/* Add any component-specific styles here */
</style>
