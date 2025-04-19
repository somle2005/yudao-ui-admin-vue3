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
      <el-form-item label="采购计划量" prop="purchasePlanQuantity">
        <el-input v-model="formData.purchasePlanQuantity" placeholder="请输入采购计划量" />
      </el-form-item>
      <el-form-item label="采购在途量" prop="purchaseTransitQuantity">
        <el-input v-model="formData.purchaseTransitQuantity" placeholder="请输入采购在途量" />
      </el-form-item>
      <el-form-item label="退件在途数量" prop="returnTransitQuantity">
        <el-input v-model="formData.returnTransitQuantity" placeholder="请输入退件在途数量" />
      </el-form-item>
      <el-form-item label="待上架数量" prop="pendingShelvingQuantity">
        <el-input v-model="formData.pendingShelvingQuantity" placeholder="请输入待上架数量" />
      </el-form-item>
      <el-form-item label="可用量，在库的良品数量" prop="availableQuantity">
        <el-input v-model="formData.availableQuantity" placeholder="请输入可用量，在库的良品数量" />
      </el-form-item>
      <el-form-item label="可售量，未被单据占用的良品数量" prop="sellableQuantity">
        <el-input v-model="formData.sellableQuantity" placeholder="请输入可售量，未被单据占用的良品数量" />
      </el-form-item>
      <el-form-item label="待出库量" prop="pendingOutboundQuantity">
        <el-input v-model="formData.pendingOutboundQuantity" placeholder="请输入待出库量" />
      </el-form-item>
      <el-form-item label="不良品数量" prop="defectiveQuantity">
        <el-input v-model="formData.defectiveQuantity" placeholder="请输入不良品数量" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { StockWarehouseApi, StockWarehouseVO } from '@/api/wms/stock-warehouse'

/** 仓库库存 表单 */
defineOptions({ name: 'StockWarehouseForm' })

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
  purchasePlanQuantity: undefined,
  purchaseTransitQuantity: undefined,
  returnTransitQuantity: undefined,
  pendingShelvingQuantity: undefined,
  availableQuantity: undefined,
  sellableQuantity: undefined,
  pendingOutboundQuantity: undefined,
  defectiveQuantity: undefined,
})
const formRules = reactive({
  warehouseId: [{ required: true, message: '仓库ID不能为空', trigger: 'blur' }],
  productId: [{ required: true, message: '产品ID不能为空', trigger: 'blur' }],
  productSku: [{ required: true, message: '产品SKU不能为空', trigger: 'blur' }],
  purchasePlanQuantity: [{ required: true, message: '采购计划量不能为空', trigger: 'blur' }],
  purchaseTransitQuantity: [{ required: true, message: '采购在途量不能为空', trigger: 'blur' }],
  returnTransitQuantity: [{ required: true, message: '退件在途数量不能为空', trigger: 'blur' }],
  pendingShelvingQuantity: [{ required: true, message: '待上架数量不能为空', trigger: 'blur' }],
  availableQuantity: [{ required: true, message: '可用量，在库的良品数量不能为空', trigger: 'blur' }],
  sellableQuantity: [{ required: true, message: '可售量，未被单据占用的良品数量不能为空', trigger: 'blur' }],
  pendingOutboundQuantity: [{ required: true, message: '待出库量不能为空', trigger: 'blur' }],
  defectiveQuantity: [{ required: true, message: '不良品数量不能为空', trigger: 'blur' }],
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
      formData.value = await StockWarehouseApi.getStockWarehouse(id)
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
    const data = formData.value as unknown as StockWarehouseVO
    if (formType.value === 'create') {
      await StockWarehouseApi.createStockWarehouse(data)
      message.success(t('common.createSuccess'))
    } else {
      await StockWarehouseApi.updateStockWarehouse(data)
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
    purchasePlanQuantity: undefined,
    purchaseTransitQuantity: undefined,
    returnTransitQuantity: undefined,
    pendingShelvingQuantity: undefined,
    availableQuantity: undefined,
    sellableQuantity: undefined,
    pendingOutboundQuantity: undefined,
    defectiveQuantity: undefined,
  }
  formRef.value?.resetFields()
}
</script>