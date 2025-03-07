<template>
  <div class="finance-operate" :style="mapStyle">
    <iframe
      width="100%"
      height="100%"
      seamless
      frameBorder="0"
      scrolling="no"
      src="http://192.168.10.199:8088/superset/dashboard/p/nOoQl7xBlja/?hiddenDashboards=1"
    >
    </iframe>
  </div>
</template>
<script setup lang="ts">
import { createMapStyle } from '../utils'

const mapStyle = createMapStyle('亚马逊sd广告')
</script>

<style lang="scss" scoped></style>
