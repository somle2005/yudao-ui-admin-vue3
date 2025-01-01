<template>
  <el-form
    v-if="model"
    ref="form"
    :validate-on-rule-change="false"
    :model="model"
    :rules="rules"
    v-bind="$attrs"
    @submit.prevent
  >
    <template v-for="(item, index) in options" :key="index">
      <el-form-item
        v-if="!item.children || !item.children!.length"
        :prop="item.prop"
        :label="item.label"
      >
        <component
          v-if="showType(item)"
          :is="`el-${item.type}`"
          :placeholder="item.placeholder"
          v-model="model[item.prop!]"
          v-bind="item.attrs"
          v-on="item.events || {}"
          @keyup.enter="(e) => dealEvents(e, item, 'keyup.enter')"
        />
        <SmUpload
          v-else-if="item.type === 'upload'"
          :uploadItem="item"
          v-bind="item.uploadAttrs"
          @before-upload="beforeUpload"
          @on-success="onSuccess"
        />

        <slot v-if="item.slot" :name="item.slot" :model="model" :scope="item"></slot>

        <div v-else-if="item.type === 'editor'" id="editor"></div>
      </el-form-item>
      <el-form-item
        v-if="item.children && item.children.length"
        :prop="item.prop"
        :label="item.label"
      >
        <component
          v-bind="item.attrs"
          :is="`el-${item.type}`"
          v-model="model[item.prop!]"
          :placeholder="item.placeholder"
        >
          <component
            :is="`el-${child.type}`"
            v-for="(child, i) in item.children"
            :key="i"
            :label="child.label"
            :value="child.value"
          />
        </component>
      </el-form-item>
    </template>
    <el-form-item>
      <slot name="action" :form="form" :model="model"></slot>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { PropType, ref, onMounted, watch, nextTick } from 'vue'
import { FormInstance, FormOptions } from './types/types'
import { cloneDeep } from 'lodash-es'
import { UploadFile, UploadFiles, UploadRawFile } from 'element-plus'
// import E from "wangeditor"

const dealEvents = (e: any, item: any, type: string) => {
  const events = item.events && item.events[type]
  if (events) {
    events(e, item)
  }
}

const showType = (item: any) => {
  const typeList = ['upload', 'editor']
  return !typeList.includes(item.type) && !item.slot
}

const emits = defineEmits(['on-success', 'before-upload', 'update:modelValue'])

const props = defineProps({
  // 表单的配置项
  options: {
    type: Array as PropType<FormOptions[]>,
    required: true
  },
  // 用户自定义上传方法
  // httpRequest: {
  //   type: Function as PropType<UploadRequestHandler>
  // },
  /**
   * 只能拿到内部修改的值,但是无法通过此参数修改form组件的值
   * 修改form组件的值需要通过options或者getFormData纳到的值进行修改
   */
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const model = ref<any>(null)
const rules = ref<any>(null)
const form = ref<FormInstance | null>()

// 初始化表单
const initForm = () => {
  if (props.options && props.options.length) {
    let m: any = {}
    let r: any = {}
    props.options.map((item: FormOptions) => {
      m[item.prop!] = item.value
      r[item.prop!] = item.rules
      // initEditor(item)
    })
    model.value = cloneDeep(m)
    rules.value = cloneDeep(r)
  }
}
// const edit = ref()
// const initEditor = (item: any) => {
//   if (item.type === 'editor') {
//     // 初始化富文本
//     nextTick(() => {
//       if (document.getElementById('editor')) {
//         const editor = new E('#editor')
//         editor.config.placeholder = item.placeholder!
//         editor.create()
//         // 初始化富文本的内容
//         editor.txt.html(item.value)
//         editor.config.onchange = (newHtml: string) => {
//           model.value[item.prop!] = newHtml
//         }
//         edit.value = editor
//       }
//     })
//   }
// }

// const resetEditor = () => {
//   // 重置富文本编辑器的内容
//   // 获取到富文本的配置项
//   if (props.options && props.options.length) {
//     let editorItem = props.options.find((item) => item.type === 'editor')!
//     edit.value.txt.html(editorItem.value)
//   }
// }

// 重置表单
const resetFields = () => {
  // 重置element-plus的表单
  form.value!.resetFields()
  // resetEditor()
}
// 表单验证方法
const validate = () => {
  return form.value!.validate
}
// 获取表单数据
const getFormData = () => {
  return model.value
}

// 分发方法
defineExpose({
  resetFields,
  validate,
  getFormData
})

onMounted(() => {
  initForm()
})
// 监听父组件传递进来的options
watch(
  () => props.options,
  () => {
    initForm()
  },
  { deep: true }
)

watch(
  () => model.value,
  (val) => {
    /**
     * 外部传入的modelValue值 pageNo: 1,pageSize: 10,这类值是外部动态变化的
     * 不改动外部变化的值 取options里面所有的key值才进行修改变化
     */
    const modelVal = cloneDeep(val)
    const adaptVal = cloneDeep(props.modelValue)
    props.options.forEach((item) => {
      adaptVal[item.prop!] = modelVal[item.prop!]
    })
    emits('update:modelValue', adaptVal)
  },
  { deep: true }
)

const beforeUpload = (rawFile: UploadRawFile, clickItem: any) => {
  emits('before-upload', rawFile, clickItem)
}
const onSuccess = (
  response: any,
  uploadFile: UploadFile,
  uploadFiles: UploadFiles,
  clickItem: any
) => {
  // 上传图片成功 给表单上传项赋值
  let uploadItem = props.options.find(
    (item) => item.type === 'upload' && item.prop === clickItem.prop
  )!
  model.value[uploadItem.prop!] = { response, uploadFile, uploadFiles }
  emits('on-success', { response, uploadFile, uploadFiles, clickItem })
}
</script>

<style lang="scss" scoped></style>
