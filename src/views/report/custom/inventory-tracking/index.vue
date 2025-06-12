<template>
  <div class="finance-operate" :style="mapStyle">
    <iframe
      width="100%"
      height="100%"
      seamless
      frameBorder="0"
      scrolling="no"
      :src="toUrl('https://superset.somle.com:55015/superset/dashboard/b330f320-efe0-4f65-9da0-2f64d2237d75/?permalink_key=52LQkpqmJyr&hiddenDashboards=1')"
    >
    </iframe>
  </div>
</template>
<script setup lang="ts">
import { createMapStyle } from '../utils'
import { toUrl } from '@/views/report/custom/utils';

const mapStyle = createMapStyle('物流跟踪看板报表高度')
// https://superset.somle.com:55015/superset/dashboard/p/aRNBxpYByMl/?hiddenDashboards=1 
</script>

<style lang="scss" scoped></style>
