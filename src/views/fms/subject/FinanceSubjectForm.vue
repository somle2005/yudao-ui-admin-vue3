<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1000px">
    <SmForm
      class="-mb-15px"
      ref="formRef"
      isCol
      label-width="150px"
      v-loading="formLoading"
      :options="requestFormOptions"
      :getModelValue="getFormData"
    />

    <template #footer>
      <el-button @click="submitFormDB" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getBoolDictOptions, DICT_TYPE } from '@/utils/dict'
import { FinanceSubjectApi, FinanceSubjectVO } from '@/api/erp/finance/subject'
import { createDBFn } from '@/utils/decorate'

/** Erp财务主体 表单 */
defineOptions({ name: 'FinanceSubjectForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData: any = ref({})

const initFormData = () => {
  return {
    name: undefined,
    contact: undefined,
    mobile: undefined,
    telephone: undefined,
    email: undefined,
    fax: undefined,
    deliveryAddress: undefined,
    companyAddress: undefined,
    remark: undefined,
    status: undefined,
    taxNo: undefined,
    bankName: undefined,
    bankAccount: undefined,
    bankAddress: undefined
  }
}
formData.value = initFormData()

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
      formData.value = await FinanceSubjectApi.getFinanceSubject(id)
      Object.assign(formRef.value.getFormData(), formData.value)    
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
    const data = formData.value as unknown as FinanceSubjectVO
    if (formType.value === 'create') {
      await FinanceSubjectApi.createFinanceSubject(data)
      message.success(t('common.createSuccess'))
    } else {
      await FinanceSubjectApi.updateFinanceSubject(data)
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
  formData.value = initFormData()
  formRef.value?.resetFields()
}

const requestFormOptions = ref([])

const createFormOptions = () => {
  const list = [
    { prop: 'name', label: '主体名称', required: true },
    { prop: 'status', label: '开启状态', required: true }, //这个要特殊处理一下
    { prop: 'contact', label: '联系人' },
    { prop: 'mobile', label: '手机号码' },
    { prop: 'telephone', label: '联系电话' },
    { prop: 'email', label: '电子邮箱' },
    { prop: 'fax', label: '传真' },
    { prop: 'deliveryAddress', label: '送达地址' },
    { prop: 'companyAddress', label: '公司地址' },

    { prop: 'taxNo', label: '纳税人识别号', required: true },
    { prop: 'bankName', label: '开户行' },
    { prop: 'bankAccount', label: '开户账号' },
    { prop: 'bankAddress', label: '开户地址' },
    { prop: 'remark', label: '备注' }
  ]
  const arr: any = []
  list.forEach((item) => {
    const { prop, label, required } = item
    if (item.prop !== 'status') {
      const obj: any = {
        type: 'input',
        label,
        prop,
        placeholder: `请输入${label}`,
        attrs: {
          style: { width: '100%' },
          clearable: true
        }
      }
      if (required) {
        obj.rules = [
          {
            required: true,
            message: `请输入${label}`,
            trigger: 'blur'
          }
        ]
      }

      arr.push(obj)
    } else if (item.prop === 'status') {
      const obj = {
        type: 'select',
        placeholder: `请选择${label}`,
        prop,
        label,
        attrs: {
          filterable: true,
          clearable: true,
          style: {
            width: '100%'
          }
        },
        rules: [
          {
            required: true,
            message: '状态不能为空',
            trigger: 'blur'
          }
        ],
        children: getBoolDictOptions(DICT_TYPE.COMMON_BOOLEAN_STATUS)
      }
      arr.push(obj)
    }
  })
  return arr
}
requestFormOptions.value = createFormOptions()

const getFormData = () => {
  return formData
}
</script>
