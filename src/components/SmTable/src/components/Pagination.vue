<template>
  <el-pagination
    v-show="total > 0"
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :background="true"
    :page-sizes="pageSizes"
    :pager-count="pagerCount"
    :total="total"
    :small="isSmall"
    class="float-right mb-15px mt-15px"
    layout="total, sizes, prev, pager, next, jumper"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>
<script lang="ts" setup>
import { computed, watchEffect } from 'vue'
import { useAppStore } from '@/store/modules/app'

defineOptions({ name: 'Pagination' })

// 此处解决了当全局size为small的时候分页组件样式太大的问题
const appStore = useAppStore()
const layoutCurrentSize = computed(() => appStore.currentSize)
const isSmall = ref<boolean>(layoutCurrentSize.value === 'small')
watchEffect(() => {
  isSmall.value = layoutCurrentSize.value === 'small'
})

// 分页透传进来
const props = defineProps({
  // 总条目数
  total: {
    required: true,
    type: Number
  },
  // 当前页数：pageNo
  currentPage: {
    type: Number,
    default: 1
  },
  // 每页显示条目个数：pageSize
  pageSize: {
    type: Number,
    default: 20
  },
  // 设置最大页码按钮数。 页码按钮的数量，当总页数超过该值时会折叠
  // 移动端页码按钮的数量端默认值 5
  pagerCount: {
    type: Number,
    default: document.body.clientWidth < 992 ? 5 : 7
  },
  // 显示分页数据多少条的选项
  pageSizes: {
    type: Array as PropType<Array<number>>,
    default: () => {
      return [10, 20, 30, 50, 100]
    }
  }
})

const emit = defineEmits(['update:currentPage', 'update:pageSize', 'pagination'])
const currentPage = computed({
  get() {
    return props.currentPage
  },
  set(val) {
    console.log('currentPage-props', val)
    // 触发 update:currentPage 事件，更新 pageSize 属性，从而更新 pageNo
    emit('update:currentPage', val)
  }
})
const pageSize = computed({
  get() {
    return props.pageSize
  },
  set(val) {
    // 触发 update:pageSize 事件，更新 pageSize 属性，从而更新 pageSize
    emit('update:pageSize', val)
  }
})
const handleSizeChange = (val) => {
  // 如果修改后超过最大页面，强制跳转到第 1 页
  if (currentPage.value * val > props.total) {
    currentPage.value = 1
  }
  // 触发 pagination 事件，重新加载列表
  emit('pagination', { currentPage: currentPage.value, pageSize: val })
}
const handleCurrentChange = (val) => {
  // 触发 pagination 事件，重新加载列表
  emit('pagination', { currentPage: val, pageSize: pageSize.value })
}
</script>
