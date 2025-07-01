<template>
  <div class="productInfo">
    <div v-for="item in list" :key="item.prop" class="productInfo-item">
      {{ item.label }}: {{ data[item.prop] }}
    </div>
  </div>
</template>
<script setup lang="ts">
const list = [
  { prop: 'code', label: '产品编码' },
  { prop: 'name', label: '产品名称' },
  { prop: 'englishName', label: '英文名' },
  { prop: 'material', label: '材料(中文)' },
  { prop: 'brand', label: '品牌' }
  // { prop: 'unitName', label: '单位名称' }
]

const props = defineProps({
  data: {
    // type: Array as PropType<PurchaseInItemVO[]>,
    type: Object,
    default: () => {
      return {}
    }
  }
})

/** 初始化设置入库项 */
watch(
  () => props.data,
  async (val) => {},
  { immediate: true, deep: true }
)

onMounted(() => {})
onUnmounted(() => {})
defineExpose({})
</script>
<style lang="scss" scoped></style>
