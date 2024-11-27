<template>
  <IFrame
    style="width: 90%; height: 100vh"
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
