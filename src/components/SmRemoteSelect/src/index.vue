<template>
  <!-- @keyup.enter="handleQuery"    class="!w-240px" -->
  <el-select
    v-model="bindVal"
    clearable
    filterable
    :placeholder="placeholder"
    remote
    :remote-method="remoteMethodDB"
    v-bind="$attrs"
  >
    <el-option
      v-for="item in selectList"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>
<script setup lang="ts">
import { createDBFn } from '@/utils/decorate'
import { cloneDeep } from 'lodash-es'

/** 远程搜索下拉框 */
defineOptions({ name: 'SmRemoteSelect' })

/**
 * 防抖实现 头部数据追加自己当前搜索的-给一个开关按钮是否往头部进行追加
 * <sm-remote-select
          v-model="formData.productId"
          placeholder="请选择SKU"
          :api="ProductApi.getProductEfficientList"
          :keyMap="{value: 'id', label: 'productCode'}"
          searchKey="productCode"
          @keyup.enter="()=>console.log('enter')"
          class="!w-240px"
        />
  测试v-bind="item.attrs" 是否能够生效
    const obj = {
    componentType: 'sm-remote-select',
    prop: 'productId',
    attrs: {
    api:ProductApi.getProductSimpleList,
    keyMap:{value: 'id', label: 'productCode'},
     placeholder:"请选择SKU",
     clearable: false, // 能够生效
     class:"!w-240px",
    },
    events: {
      'keyup.enter': (e, item) => {
        handleQuery()
        console.log(e, '回车事件出发了', item)
      }
    }
  }
  }
  // 测试事件events可以生效 接口api可以监听调用  clearable class可以进行item.attrs进行透传生效 且每次打开弹窗都会初始化接口请求数据
 */

const props = defineProps({
  // 远程搜索API
  api: {
    type: Function,
    default: () => {},
    required: true
  },
  searchKey: {
    type: String,
    default: ''
  },
  // label-value映射map
  keyMap: {
    type: Object,
    default: () => {
      return { label: 'label', value: 'value' }
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
const selectList: any = ref([])

watch(
  () => props.api,
  (val) => {
    // if (val) {
    //   val()
    //     .then((res) => {
    //       const keyMap = props.keyMap
    //       const { label, value } = keyMap
    //       selectList.value = res.map((item) => {
    //         item.label = item[label]
    //         item.value = item[value]
    //         return item
    //       })
    //     })
    //     .catch((e) => {
    //       console.log(e, '数据加载报错')
    //     })
    // }
  },
  { deep: true, immediate: true }
)

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
    // 后端如果没有做existList 这里需要并发请求 确保id一定在回显数据里面
    const { api, idKey } = props
    // 初始化的时候回显加数据
    api({ [idKey]: val })
      .then((res) => {
        const keyMap = props.keyMap
        const { label, value } = keyMap
        const target = res[0]
        target.label = target[label]
        target.value = target[value]
        selectList.value.unshift(target)
      })
      .catch((e) => {
        console.log(e, '数据加载报错')
      })

    console.log('v-model联动外面的值', val)
    emits('update:modelValue', val)
  },
  { deep: true, immediate: true }
)

const appendSearch = (query) => {
  if (!props.isAppendSearch) return

  if (query) {
    const flag = selectList.value.some((item: any) => item.label === query)
    if (flag) return
    selectList.value.value.unshift({
      label: query,
      value: query
    })
  }
}

const remoteMethod = (query) => {
  const { api, searchKey } = props
  /**
   * { [idKey]: bindVal.value }
   * 看返回的数据里面有没有这条数据 如果没有就需要额外再调用一次接口进行数据请求。
   * existList: [{id:'xxx'}] 后面统一通过必有参数后端统一带回来一个接口 配合前端appendSearch 模糊搜索字段添加功能。
   */
  api({ [searchKey]: query })
    .then((res) => {
      const keyMap = props.keyMap
      const { label, value } = keyMap
      selectList.value = res.map((item) => {
        item.label = item[label]
        item.value = item[value]
        return item
      })

      appendSearch(query)
    })
    .catch((e) => {
      console.log(e, '数据加载报错')
    })
}

const remoteMethodDB = createDBFn(remoteMethod)

onMounted(() => {})
onUnmounted(() => {})
defineExpose({})
</script>
<style lang="scss" scoped></style>
