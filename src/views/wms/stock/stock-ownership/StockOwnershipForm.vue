<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="仓库ID" prop="warehouseId">
        <el-input v-model="formData.warehouseId" placeholder="请输入仓库ID" />
      </el-form-item>
      <el-form-item label="产品ID" prop="productId">
        <el-input v-model="formData.productId" placeholder="请输入产品ID" />
      </el-form-item>
      <el-form-item label="产品SKU" prop="productSku">
        <el-input v-model="formData.productSku" placeholder="请输入产品SKU" />
      </el-form-item>
      <el-form-item label="库存主体ID" prop="inventorySubjectId">
        <el-input v-model="formData.inventorySubjectId" placeholder="请输入库存主体ID" />
      </el-form-item>
      <el-form-item label="库存归属ID" prop="inventoryOwnerId">
        <el-input v-model="formData.inventoryOwnerId" placeholder="请输入库存归属ID" />
      </el-form-item>
      <el-form-item label="可用库存" prop="availableQuantity">
        <el-input v-model="formData.availableQuantity" placeholder="请输入可用库存" />
      </el-form-item>
      <el-form-item label="待出库库存" prop="pendingOutboundQuantity">
        <el-input v-model="formData.pendingOutboundQuantity" placeholder="请输入待出库库存" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { StockOwnershipApi, StockOwnershipVO } from '@/api/wms/stock-ownership'

/** 所有者库存 表单 */
defineOptions({ name: 'StockOwnershipForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  warehouseId: undefined,
  productId: undefined,
  productSku: undefined,
  inventorySubjectId: undefined,
  inventoryOwnerId: undefined,
  availableQuantity: undefined,
  pendingOutboundQuantity: undefined,
})
const formRules = reactive({
  warehouseId: [{ required: true, message: '仓库ID不能为空', trigger: 'blur' }],
  inventorySubjectId: [{ required: true, message: '库存主体ID不能为空', trigger: 'blur' }],
  inventoryOwnerId: [{ required: true, message: '库存归属ID不能为空', trigger: 'blur' }],
  availableQuantity: [{ required: true, message: '可用库存不能为空', trigger: 'blur' }],
  pendingOutboundQuantity: [{ required: true, message: '待出库库存不能为空', trigger: 'blur' }],
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
      formData.value = await StockOwnershipApi.getStockOwnership(id)
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
    const data = formData.value as unknown as StockOwnershipVO
    if (formType.value === 'create') {
      await StockOwnershipApi.createStockOwnership(data)
      message.success(t('common.createSuccess'))
    } else {
      await StockOwnershipApi.updateStockOwnership(data)
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
    warehouseId: undefined,
    productId: undefined,
    productSku: undefined,
    inventorySubjectId: undefined,
    inventoryOwnerId: undefined,
    availableQuantity: undefined,
    pendingOutboundQuantity: undefined,
  }
  formRef.value?.resetFields()
}
</script>