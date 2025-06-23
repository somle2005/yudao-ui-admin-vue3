<template>
  <div class="finance-operate" :style="mapStyle">
    <iframe
      width="100%"
      height="100%"
      seamless
      frameBorder="0"
      scrolling="no"
      :src="toUrl('https://superset.somle.com:55015/superset/dashboard/69a8b52e-9b3b-42e0-a5a8-b0517ba1fc94/?permalink_key=nOoQlaYmlja&hiddenDashboards=1')"
    >
    </iframe>
  </div>
</template>
<script setup lang="ts">
import { createMapStyle } from '../utils'
import { toUrl } from '@/views/report/custom/utils';

const mapStyle = createMapStyle('销售看板报表高度')
// https://superset.somle.com:55015/superset/dashboard/p/aRNBxpYByMl/?hiddenDashboards=1
</script>

<style lang="scss" scoped></style>
