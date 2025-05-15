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
    />

    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { PortInfoApi, PortInfoVO } from '@/api/tms/port-info'
import { getBoolDictOptions, getIntDictOptions } from '@/utils/dict'

/** TMS港口信息 表单 */
defineOptions({ name: 'PortInfoForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const initFormData = () => {
  return {
    code: undefined,
    name: undefined,
    nameEn: undefined,
    countryCode: undefined,
    countryName: undefined,
    cityName: undefined,
    cityNameEn: undefined,
    remark: undefined,
    status: true
  }
}
const formData = ref(initFormData())

const formRef = ref() // 表单 Ref

const createRequestFormOptions = () => {
  const list = [
    {
      type: 'input',
      label: '港口编码',
      prop: 'code',
      placeholder: '请输入港口编码',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'input',
      label: '港口中文名',
      prop: 'name',
      placeholder: '请输入港口中文名',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'input',
      label: '港口英文名',
      prop: 'nameEn',
      placeholder: '请输入港口英文名',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'select',
      label: '国家代码',
      prop: 'countryCode',
      placeholder: '请选择国家代码',
      attrs: {
        style: { width: '100%' },
        filterable: true,
        clearable: true
      },
      children: getIntDictOptions(DICT_TYPE.COUNTRY_CODE)
    },
    {
      type: 'input',
      label: '城市中文名',
      prop: 'cityName',
      placeholder: '请输入城市中文名',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'input',
      label: '城市英文名',
      prop: 'cityNameEn',
      placeholder: '请输入城市英文名',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'input',
      label: '备注',
      prop: 'remark',
      placeholder: '请输入备注',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'select',
      label: '状态',
      prop: 'status',
      placeholder: '请选择状态',
      attrs: {
        style: { width: '100%' },
        filterable: true,
        clearable: true
      },
      children: getBoolDictOptions(DICT_TYPE.COMMON_BOOLEAN_STATUS)
    }
  ]

  return list
}

const requestFormOptions: any = ref(createRequestFormOptions())
const getFormData = () => {
  return formData.value
}

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
      formData.value = await PortInfoApi.getPortInfo(id)
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
    const data = formData.value as unknown as PortInfoVO
    if (formType.value === 'create') {
      await PortInfoApi.createPortInfo(data)
      message.success(t('common.createSuccess'))
    } else if (formType.value === 'update') {
      await PortInfoApi.updatePortInfo(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = initFormData()
  formRef.value?.resetFields()
}
</script>
