<template>
  <div class="finance-operate" :style="mapStyle">
    <iframe
      width="100%"
      height="100%"
      seamless
      frameBorder="0"
      scrolling="no"
      :src="toUrl('https://superset.somle.com:55015/superset/dashboard/p/0wYQZPlE5Og/?hiddenDashboards=1')"
    >
    </iframe>
  </div>
</template>
<script setup lang="ts">
import { createMapStyle } from '../utils'
import { toUrl } from '@/views/report/custom/utils';

const mapStyle = createMapStyle('亚马逊sp广告')
</script>

<style lang="scss" scoped></style>
