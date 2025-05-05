<template>
  <div class="contents">
    <Dialog v-model="dialogVisible" :title="title" width="50%">
      <el-upload
        ref="uploadRef"
        v-model:file="file"
        :auto-upload="false"
        :disabled="formLoading"
        :limit="1"
        :on-exceed="handleExceed"
        :on-change="handleChange"
        :on-remove="handleRemove"
        accept=".xlsx, .xls"
        action="none"
        drag
      >
        <!-- <template  #trigger 留着后期可能有UI交互变动> -->
        <template #trigger>
          <template v-if="!file">
            <Icon icon="ep:upload" />
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </template>

          <Icon v-if="file" icon="ep:document" />
        </template>

        <template v-if="!file" #tip>
          <div class="el-upload__tip text-center">
            <span>仅允许导入 xls、xlsx 格式文件。</span>
            <el-link
              :underline="false"
              style="font-size: 12px; vertical-align: baseline"
              type="primary"
              @click="importTemplate"
            >
              下载模板
            </el-link>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </template>
    </Dialog>
  </div>
</template>
<script lang="ts" setup>
import * as CustomerApi from '@/api/crm/customer'
import download from '@/utils/download'
import { UploadFile, UploadFiles } from 'element-plus'

defineOptions({ name: 'SmImportFile' })

const props = defineProps({
  // 是否显示分页
  title: {
    type: String,
    default: '导入文件'
  },
  templateObj: {
    type: Object,
    default: () => {
      return {
        url: CustomerApi.importCustomerTemplate,
        name: '客户导入模版.xls'
      }
    }
  },
  importUrlFn: {
    type: Function,
    default: () => {}
  }
})

const emits = defineEmits(['update:modelValue', 'success'])

const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中
const uploadRef = ref()
const fileList = ref<string | Blob[]>([]) // 文件列表
const file = ref<string | Blob>()

/** 打开弹窗 */
const open = async () => {
  dialogVisible.value = true
  await resetForm()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const submitForm = async () => {
  formLoading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file.value as Blob)
    await props.importUrlFn(formData)

    submitFormSuccess(formData)
    // const res = await CustomerApi.handleImport(formData)
    // submitFormSuccess(res)
  } catch {
    submitFormError()
  } finally {
    formLoading.value = false
  }
}

/** 文件上传成功 */
const submitFormSuccess = (formData) => {
  // if (response.code !== 0) {
  //   message.error(response.msg)
  //   formLoading.value = false
  //   return
  // }
  // // 拼接提示语
  // const data = response.data
  // let text = '上传成功数量：' + data.createCustomerNames.length + ';'
  // for (let customerName of data.createCustomerNames) {
  //   text += '< ' + customerName + ' >'
  // }
  // text += '更新成功数量：' + data.updateCustomerNames.length + ';'
  // for (const customerName of data.updateCustomerNames) {
  //   text += '< ' + customerName + ' >'
  // }
  // text += '更新失败数量：' + Object.keys(data.failureCustomerNames).length + ';'
  // for (const customerName in data.failureCustomerNames) {
  //   text += '< ' + customerName + ': ' + data.failureCustomerNames[customerName] + ' >'
  // }
  // message.alert(text)

  formLoading.value = false
  dialogVisible.value = false
  // 发送操作成功的事件
  emits('update:modelValue', formData)
  emits('success', formData)
}

/** 上传错误提示 */
const submitFormError = (): void => {
  message.error('上传失败，请您重新上传！')
  formLoading.value = false
}

/** 重置表单 */
const resetForm = async () => {
  // 重置上传状态和文件
  file.value = undefined
  await nextTick()
  uploadRef.value?.clearFiles()
}

/** 文件数超出提示 */
const handleExceed = (): void => {
  message.error('最多只能上传一个文件！')
}

const handleChange = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  file.value = uploadFile.raw
}

const handleRemove = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  file.value = undefined
}

/** 下载模板操作 */
const importTemplate = async () => {
  const { url, name } = props.templateObj
  const res = await url()
  download.excel(res, name)
  // const res = await CustomerApi.importCustomerTemplate()
  // download.excel(res, '客户导入模版.xls')
}
</script>
<style lang="scss" scoped>
.contents {
  display: contents;
}
</style>
