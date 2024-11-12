<template>
  <IFrame
    class="w-full h-[calc(100vh-var(--top-tool-height)-var(--tags-view-height)-var(--app-content-padding)-var(--app-content-padding)-2px)]"
    :src="url"
  />
</template>

<script lang="ts" setup>
import DataVEmbed from '@/views/report/datav/realtime.vue'
  const url = "https://kerwin.org.cn/"
</script>
