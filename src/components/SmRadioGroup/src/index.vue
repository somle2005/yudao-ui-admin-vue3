<template>
  <!-- @keyup.enter="handleQuery"    class="!w-240px" -->
  <!-- <el-select v-model="bindVal" clearable filterable :placeholder="placeholder" v-bind="$attrs">
    <el-option
      v-for="item in selectList"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select> -->
  <el-radio-group v-model="bindVal" v-bind="$attrs">
    <el-radio v-for="item in list" :key="item.radioNanme" :label="item.label" v-bind="item.attrs">
      {{ item.radioNanme }}
    </el-radio>
  </el-radio-group>
</template>
<script setup lang="ts">
import { notEmpty } from '@/utils/judge'
import { cloneDeep } from 'lodash-es'

/** 搜索下拉框-解决v-model初始值绑定不触发函数的问题 */
defineOptions({ name: 'SmRadioGroup' })

const props = defineProps({
  // label-value映射map
  keyMap: {
    type: Object,
    default: () => {
      return { label: 'label', value: 'value' }
    }
  },
  data: {
    type: Array,
    default: () => {
      return []
    }
  },
  modelValue: {
    type: [String, Number, Array],
    default: ''
  },
  placeholder: {
    type: String,
    default: '请输入'
  },
  // 是否需要模糊字段头部添加
  isAppendSearch: {
    type: Boolean,
    default: false
  },
  // 回显使用搜索初始化
  idKey: {
    type: String,
    default: 'id'
  }

  // // 是否在加载中
  // loading: {
  //   type: Boolean,
  //   default: false
  // },
})

const emits = defineEmits(['update:modelValue'])

const bindVal = ref()
const list: any = ref([])

const emitModelValue = (val) => {
  if (notEmpty(bindVal.value) && props?.data?.length) {
    emits('update:modelValue', val)
  }
}

watch(
  () => props.modelValue,
  (val) => {
    bindVal.value = cloneDeep(val)
  },
  { deep: true, immediate: true }
)

/**
 * bindVal和data列表值都存在才有触发的必要-两者初始化都存在的时候才触发一次
 * 详情接口和列表接口拿到数据 不一定知道谁先后
 * 如果后期各值变化要做独立-可以加一个flag标记
 */

watch(
  () => bindVal.value,
  (val) => {
    emitModelValue(val)
  },
  { deep: true, immediate: true }
)

watch(
  () => props.data,
  (val) => {
    if (val?.length) {
      // selectList.value = cloneDeep(val).map((item: any) => {
      //   const { label, value } = props.keyMap
      //   item.label = item[label]
      //   item.value = item[value]
      //   return item
      // })
      list.value = cloneDeep(val)
    } else {
      list.value = []
    }
    emitModelValue(bindVal.value)
  },
  { deep: true, immediate: true }
)

onMounted(() => {})
onUnmounted(() => {})
defineExpose({})
</script>
<style lang="scss" scoped></style>
