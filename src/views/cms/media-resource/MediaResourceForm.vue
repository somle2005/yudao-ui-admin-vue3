<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <SmForm
      class="-mb-15px"
      ref="formRef"
      isCol
      label-width="150px"
      v-model="formData"
      v-loading="formLoading"
      :options="requestFormOptions"
      :getModelValue="getFormData"
    >
      <template #fileUrl="{ model, scope }">
        <UploadMedia
          :disabled="scope?.attrs?.disabled"
          :is-show-tip="false"
          v-model="model.fileUrl"
          :limit="1"
          @update:model-value="(val) => (formData.storagePath = [val])"
        />
      </template>
    </SmForm>
    <template #footer>
      <el-button @click="submitFormDB" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { MediaResourceApi, MediaResourceVO } from '@/api/cms/media/resource'
import { addProperty } from '@/components/SmForm/src/utils'
import { createDBFn } from '@/utils/decorate'
import { getIntDictOptions } from '@/utils/dict'

/** 文件 表单 */
defineOptions({ name: 'MediaResourceForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const initForm = () => {
  return {
    id: undefined,
    appCode: undefined,
    moduleCode: undefined,
    title: undefined,
    description: undefined,
    storagePath: [] as any[],
    mediaType: undefined,
    fileUrl: ''
  }
}
const formData = ref(initForm())
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await MediaResourceApi.getMediaResource(id)
      formData.value.fileUrl = formData.value.storagePath[0]
      formRef.value.initForm()
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as MediaResourceVO
    if (formType.value === 'create') {
      await MediaResourceApi.createMediaResource(data)
      message.success(t('common.createSuccess'))
    } else if (formType.value === 'update') {
      await MediaResourceApi.updateMediaResource(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}
const submitFormDB = createDBFn(submitForm)

/** 重置表单 */
const resetForm = () => {
  formData.value = initForm()
  formRef.value?.resetFields()
}

const requestFormOptions: any = ref([])
const createRequestFormOptions = () => {
  const list = [
    {
      requiredFlag: true,
      type: 'input',
      label: '资源标题',
      prop: 'title',
      placeholder: '请输入资源标题',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      requiredFlag: true,
      type: 'select',
      placeholder: '请选择应用编码',
      prop: 'appCode',
      label: '应用编码',
      attrs: {
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: getIntDictOptions(DICT_TYPE.CMS_APP_CODE)
    },
    {
      requiredFlag: true,
      type: 'select',
      placeholder: '请选择模块编码',
      prop: 'moduleCode',
      label: '模块编码',
      attrs: {
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: getIntDictOptions(DICT_TYPE.CMS_MODULE_CODE)
    },
    {
      requiredFlag: true,
      type: 'select',
      placeholder: '请选择资源类型',
      prop: 'mediaType',
      label: '资源类型',
      attrs: {
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: getIntDictOptions(DICT_TYPE.CMS_MEDIA_TYPE)
    },
    {
      type: 'input',
      label: '资源描述',
      prop: 'description',
      placeholder: '请输入资源描述',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },

    {
      requiredFlag: true,
      colConfig: { span: 24 },
      prop: 'fileUrl',
      label: '资源',
      slot: 'fileUrl'
    }

    // storagePath  requiredFlag: true,
  ]

  addProperty(list)
  return list
}
requestFormOptions.value = createRequestFormOptions()

const getFormData = () => {
  return formData.value
}
</script>
