<template>
  <div class="storeList"> 
    <div class="search">
      搜索栏
    </div>
    <div class="platform-list">

      <div class="item">
        shopify店铺
      </div>
      <div class="item">
        shopify店铺
      </div>
      <div class="item">
        shopify店铺
      </div>

    </div>

  </div>
</template>
<script setup lang="ts">
onMounted(() => {})
onUnmounted(() => {})
defineExpose({})
</script>
<style lang="scss" scoped>
.storeList {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 200px;
  background: white;
  .search {
    height: 30px;
    padding: 0 10px;
    box-sizing: border-box;
  }
  .platform-list {
    padding: 0 10px;
    overflow: auto;
    box-sizing: border-box;
  }
  .item {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
  }
}


</style>
