<template>
  <div class="finance-operate" :style="mapStyle">
    <iframe
      width="100%"
      height="100%"
      seamless
      frameBorder="0"
      scrolling="no"
      :src="toUrl('https://superset.somle.com:55015/superset/dashboard/6963dbab-cf78-44e6-b58b-c8e7350676bf/?permalink_key=4DXQWD3mPzo&hiddenDashboards=1')"
    >
    </iframe>
  </div>
</template>
<script setup lang="ts">
import { createMapStyle } from '../utils'
import { toUrl } from '@/views/report/custom/utils';

const mapStyle = createMapStyle('亚马逊sd广告')
// https://superset.somle.com:55015/superset/dashboard/p/nOoQl7xBlja/?hiddenDashboards=1 
</script>

<style lang="scss" scoped></style>
