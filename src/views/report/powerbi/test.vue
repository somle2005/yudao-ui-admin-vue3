<template>
  <div>
    <div class="controls">
      <label for="year-select">选择年份:</label>
      <select v-model="selectedYears" multiple style="width: 200px"></select>

      <label for="platform-select">选择平台:</label>
      <select v-model="selectedPlatforms" multiple style="width: 200px"></select>

      <label for="sku-select">选择SKU:</label>
      <select v-model="selectedSkus" multiple style="width: 200px"></select>

      <button @click="loadData">加载数据</button>
    </div>

    <div id="map"></div>

    <div class="controls">
      <button @click="toggleHeatmap">切换热图</button>
      <button @click="changeGradient">改变渐变</button>
      <button @click="changeOpacity">改变不透明度</button>
      <button @click="changeRadius">改变半径</button>
      <button @click="toggleMarkers">切换标记</button>
    </div>
  </div>
</template>

<script setup lang="ts">
onMounted(async () => {
  console.log(Date(),'test report mounting')
});

onUpdated(async () => {
  console.log(Date(),'test report updated')
});
</script>
