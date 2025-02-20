<template>
  <!-- <div class="heatmap" :style="{width: '100%',height: '1000px'}"> -->
  <div class="heatmap" :style="mapStyle">
    <iframe
      width="100%"
      height="100%"
      seamless
      frameBorder="0"
      scrolling="no"
      src="http://192.168.10.199:8088/superset/dashboard/p/MznB30DQOkV?hiddenDashboards=1"
    >
    </iframe>

    <!-- "http://192.168.10.199:8088/superset/dashboard/p/MznB30DQOkV/" -->
    <!-- src="http://192.168.10.199:8088/superset/explore/p/vo9Rba4pAq0/?standalone=1&height=400" -->
  </div>
</template>
<script setup lang="ts">
import { createMapStyle } from './utils'

const mapStyle = createMapStyle('热力图高度')
</script>
<style lang="scss" scoped></style>
