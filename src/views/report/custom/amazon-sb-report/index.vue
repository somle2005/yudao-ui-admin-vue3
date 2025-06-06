<template>
  <div class="finance-operate" :style="mapStyle">
    <iframe
      width="100%"
      height="100%"
      seamless
      frameBorder="0"
      scrolling="no"
      :src="toUrl('https://superset.somle.com:55015/superset/dashboard/2344b932-6403-439e-affe-e0ee1d2ff049/?permalink_key=jY2BLrjm0L8&hiddenDashboards=1')"
    >
    </iframe>
  </div>
</template>
<script setup lang="ts">
import { createMapStyle } from '../utils'
import { toUrl } from '@/views/report/custom/utils';

const mapStyle = createMapStyle('亚马逊sb广告')
// https://superset.somle.com:55015/superset/dashboard/p/xrnm2b1mqON/?hiddenDashboards=1 
</script>

<style lang="scss" scoped></style>
