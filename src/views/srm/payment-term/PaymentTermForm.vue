<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="150px"
      v-loading="formLoading"
    >
      <el-form-item label="人民币采购条款" prop="paymentTermCn">
        <el-input
          type="textarea"
          v-model="formData.paymentTermCn"
          placeholder="请输入人民币采购条款"
        />
      </el-form-item>
      <el-form-item label="外币采购条款(中文)" prop="paymentTermCnForeign">
        <el-input
          type="textarea"
          v-model="formData.paymentTermCnForeign"
          placeholder="请输入外币采购条款(中文)"
        />
      </el-form-item>
      <el-form-item label="外币采购条款(英文)" prop="paymentTermEnForeign">
        <el-input
          type="textarea"
          v-model="formData.paymentTermEnForeign"
          placeholder="请输入外币采购条款(英文)"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="formData.remark" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { PaymentTermApi, PaymentTermVO } from '@/api/srm/payment-term'

/** 付款条款 表单 */
defineOptions({ name: 'PaymentTermForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  paymentTermCn: undefined,
  paymentTermCnForeign: undefined,
  paymentTermEnForeign: undefined,
  remark: undefined
})
const formRules = reactive({
  paymentTermCn: [{ required: true, message: '人民币采购条款不能为空', trigger: 'blur' }]
})
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
      formData.value = await PaymentTermApi.getPaymentTerm(id)
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
    const data = formData.value as unknown as PaymentTermVO
    if (formType.value === 'create') {
      await PaymentTermApi.createPaymentTerm(data)
      message.success(t('common.createSuccess'))
    } else {
      await PaymentTermApi.updatePaymentTerm(data)
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
  formData.value = {
    id: undefined,
    paymentTermCn: undefined,
    paymentTermCnForeign: undefined,
    paymentTermEnForeign: undefined,
    remark: undefined
  }
  formRef.value?.resetFields()
}
</script>
