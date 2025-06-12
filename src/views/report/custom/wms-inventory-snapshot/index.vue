<template>
  <div class="finance-operate" :style="mapStyle">
    <iframe
      width="100%"
      height="100%"
      seamless
      frameBorder="0"
      scrolling="no"
      :src="toUrl('https://superset.somle.com:55015/superset/dashboard/704ea94e-6eb8-4394-846a-7f0e7d8bf6b2/?permalink_key=kXnBq5xBAOo&hiddenDashboards=1')"
    >
    </iframe>
  </div>
</template>
<script setup lang="ts">
import { createMapStyle } from '../utils'
import { toUrl } from '@/views/report/custom/utils';

const mapStyle = createMapStyle('财务进销存报表高度')
// https://superset.somle.com:55015/superset/dashboard/p/6yLBYznQgP9/?hiddenDashboards=1 
</script>

<style lang="scss" scoped></style>
