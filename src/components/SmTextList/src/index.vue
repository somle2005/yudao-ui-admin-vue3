<template>
  <div v-if="Object.keys(val).length" class="contents">
    <div class="common-text" v-for="item in textList" :key="item.prop">{{ dealText(item) }}</div>
  </div>
</template>
<script setup lang="ts">
import { PropType } from 'vue'

defineOptions({ name: 'SmTextList' })

interface TextListProp {
  name: string
  prop: string
  filter?: Function
  mixin?: Function
}

const props = defineProps({
  textList: {
    type: Array as PropType<TextListProp[]>,
    default: () => {
      return []
    }
  },
  val: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

watch(
  () => props.val,
  (val) => {},
  { immediate: true, deep: true }
)

// 普通统一是可以-但是一旦要加一下样式===扩展样式就会很复杂-颜色=== 过滤数据就会很麻烦

const dealText = (item) => {
  // 后续可能会扩展组合 mixin一般传入item外部进行处理-优先级比filter高
  const { mixin,filter, prop, name } = item
  const val = props.val
  let str = name + ':'

  // // mixn是闭包函数
  // if(mixin) {
  //   return str + mixin(val[prop])()
  // }

  if (filter) {
    return str + filter(val[prop])
  }
  return str + val[prop]
}

onMounted(() => {})
onUnmounted(() => {})
defineExpose({})
</script>
<style lang="scss" scoped>
.contents {
  display: contents;
}
</style>
