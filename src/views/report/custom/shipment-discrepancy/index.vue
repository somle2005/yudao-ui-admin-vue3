<template>
  <div class="finance-operate" :style="mapStyle">
    <iframe
      width="100%"
      height="100%"
      seamless
      frameBorder="0"
      scrolling="no"
      :src="toUrl('https://superset.somle.com:55015/superset/dashboard/e79bb374-6776-428c-9e69-ad126fa5175b/?permalink_key=ZrWmPNvB92y&hiddenDashboards=1')"
    >
    </iframe>
  </div>
</template>
<script setup lang="ts">
import { createMapStyle } from '../utils'
import { toUrl } from '@/views/report/custom/utils';

const mapStyle = createMapStyle('物流发货看板报表高度')
// https://superset.somle.com:55015/superset/dashboard/p/aRNBxpYByMl/?hiddenDashboards=1 
</script>

<style lang="scss" scoped></style>
