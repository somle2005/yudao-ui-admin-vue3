<template>
  <div class="finance-operate" :style="mapStyle">
    <iframe
      width="100%"
      height="100%"
      seamless
      frameBorder="0"
      scrolling="no"
      :src="toUrl('https://superset.somle.com:55015/superset/dashboard/eb8c59bd-1f48-4e0f-828b-02cff6f1cf2e/?permalink_key=rJMQzpeELW2&hiddenDashboards=1')"
    >
    </iframe>
  </div>
</template>
<script setup lang="ts">
import { createMapStyle } from '../utils'
import { toUrl } from '@/views/report/custom/utils';

const mapStyle = createMapStyle('财务经营报表高度')
// https://superset.somle.com:55015/superset/dashboard/p/xw1EMzRB6jN/?hiddenDashboards=1 
</script>

<style lang="scss" scoped></style>
