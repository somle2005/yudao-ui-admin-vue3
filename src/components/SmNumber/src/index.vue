<template>
  <el-input-number v-model="bindVal" :controls="false" class="!w-100%" :min="0" v-bind="$attrs" />
</template>
<script setup lang="ts">
import { cloneDeep } from 'lodash-es'

defineOptions({ name: 'SmNumber' })

const props = defineProps({
  modelValue: {
    type: Number,
    default: undefined
  },
  // 支持将配置参数带入-因为有部分keyMap已经存在props所以无法通过v-bind带入
  attrs: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const emits = defineEmits(['update:modelValue'])

const bindVal = ref()

const emitModelValue = (val) => {
  emits('update:modelValue', val)
}

watch(
  () => props.modelValue,
  (val) => {
    bindVal.value = cloneDeep(val)
  },
  { deep: true, immediate: true }
)

watch(
  () => bindVal.value,
  (val) => {
    emitModelValue(val)
  },
  { deep: true, immediate: true }
)

watch(
  () => props.attrs,
  (val) => {
    if (Object.keys(val).length > 0) {
      // const data = val?.data
      // if (data) {
      //   selectList.value = data.value
      // }
    }
  },
  { deep: true, immediate: true }
)

onMounted(() => {})
onUnmounted(() => {})
defineExpose({})
</script>
<style lang="scss" scoped></style>
