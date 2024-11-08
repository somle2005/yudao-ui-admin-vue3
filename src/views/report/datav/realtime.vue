<template>
  <IFrame
    class="w-full h-[calc(100vh-var(--top-tool-height)-var(--tags-view-height)-var(--app-content-padding)-var(--app-content-padding)-2px)]"
    :src="url"
  />
</template>

<script lang="ts" setup>
defineOptions({ name: 'DataVEmbed' })
import { PowerbiApi } from '@/api/report/powerbi';
import { PowerBIReportEmbed } from 'powerbi-client-vue-js';

import { IReportEmbedConfiguration, models } from 'powerbi-client';

const props = defineProps<{
  src: string;
}>();

const url = ref(false);


onMounted(async () => {
  url.value = props.src
});

</script>
