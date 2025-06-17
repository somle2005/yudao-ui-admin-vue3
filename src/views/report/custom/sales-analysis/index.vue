<template>
  <div class="finance-operate" :style="mapStyle">
    <iframe
      width="100%"
      height="100%"
      seamless
      frameBorder="0"
      scrolling="no"
      :src="toUrl('https://superset.somle.com:55015/superset/dashboard/a1a7aee2-189c-45a4-b5ea-d8fd6bb83de7/?permalink_key=ojZmXPWmlVr&dept=CBD#CHART-explore-32-1&hiddenDashboards=1')"
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
