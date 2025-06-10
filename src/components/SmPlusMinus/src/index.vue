<template>
  <div class="SmPlusMinus">
    <div class="green" v-if="type === typeList[0]">+{{ val }}</div>
    <div class="red" v-else-if="type === typeList[1]">-{{ val }}</div>
    <div v-else-if="type === typeList[2]">{{ val }}</div>
  </div>
</template>
<script setup lang="ts">
defineOptions({ name: 'SmPlusMinus' })

const props = defineProps({
  typeList: {
    type: Array,
    default: () => {
      return []
    }
  },
  val: {
    type: [Number, String],
    default: null
  },
  type: {
    type: [Number, String],
    default: null
  }
})

onMounted(() => {})
onUnmounted(() => {})
defineExpose({})
</script>
<style lang="scss" scoped>
.SmPlusMinus {
  display: contents;
}

.red {
  color: red;
}

.green {
  color: green;
}
</style>
