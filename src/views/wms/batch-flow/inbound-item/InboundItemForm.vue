<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="入库单ID" prop="inboundId">
        <el-input v-model="formData.inboundId" placeholder="请输入入库单ID" />
      </el-form-item>
      <el-form-item label="标准产品ID" prop="productId">
        <el-input v-model="formData.productId" placeholder="请输入标准产品ID" />
      </el-form-item>
      <el-form-item label="标准产品SKU" prop="productSku">
        <el-input v-model="formData.productSku" placeholder="请输入标准产品SKU" />
      </el-form-item>
      <el-form-item label="计划入库量" prop="planQty">
        <el-input v-model="formData.planQty" placeholder="请输入计划入库量" />
      </el-form-item>
      <el-form-item label="实际入库量" prop="actual Qty">
        <el-input v-model="formData.actualQty" placeholder="请输入实际入库量" />
      </el-form-item>
      <el-form-item label="批次剩余库存，出库后的剩余库存量" prop="leftQty">
        <el-input v-model="formData.leftQty" placeholder="请输入批次剩余库存，出库后的剩余库存量" />
      </el-form-item>
      <el-form-item label="来源详情ID" prop="sourceItemId">
        <el-input v-model="formData.sourceItemId" placeholder="请输入来源详情ID" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { InboundItemApi, InboundItemVO } from '@/api/wms/inbound-item'

/** 入库单详情 表单 */
defineOptions({ name: 'InboundItemForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  inboundId: undefined,
  productId: undefined,
  productSku: undefined,
  planQty: undefined,
  actualQty: undefined,
  leftQty: undefined,
  sourceItemId: undefined,
})
const formRules = reactive({
  inboundId: [{ required: true, message: '入库单ID不能为空', trigger: 'blur' }],
  productId: [{ required: true, message: '标准产品ID不能为空', trigger: 'blur' }],
  productSku: [{ required: true, message: '标准产品SKU不能为空', trigger: 'blur' }],
  planQty: [{ required: true, message: '计划入库量不能为空', trigger: 'blur' }],
  actualQty: [{ required: true, message: '实际入库量不能为空', trigger: 'blur' }],
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
      formData.value = await InboundItemApi.getInboundItem(id)
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
    const data = formData.value as unknown as InboundItemVO
    if (formType.value === 'create') {
      await InboundItemApi.createInboundItem(data)
      message.success(t('common.createSuccess'))
    } else {
      await InboundItemApi.updateInboundItem(data)
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
    inboundId: undefined,
    productId: undefined,
    productSku: undefined,
    planQty: undefined,
    actualQty: undefined,
    leftQty: undefined,
    sourceItemId: undefined,
  }
  formRef.value?.resetFields()
}
</script>