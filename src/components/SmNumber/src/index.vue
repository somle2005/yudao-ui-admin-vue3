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

onMounted(() => {})
onUnmounted(() => {})
defineExpose({})
</script>
<style lang="scss" scoped></style>
