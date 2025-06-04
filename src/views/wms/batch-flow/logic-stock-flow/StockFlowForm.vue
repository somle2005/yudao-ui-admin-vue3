<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="库存类型" prop="stockType">
        <el-select v-model="formData.stockType" placeholder="请选择库存类型">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="库存ID，分别指向三张库存表的ID" prop="stockId">
        <el-input v-model="formData.stockId" placeholder="请输入库存ID，分别指向三张库存表的ID" />
      </el-form-item>
      <el-form-item label="流水发生的原因" prop="reason">
        <el-input v-model="formData.reason" placeholder="请输入流水发生的原因" />
      </el-form-item>
      <el-form-item label="流水触发的单据ID" prop="reasonBillId">
        <el-input v-model="formData.reasonBillId" placeholder="请输入流水触发的单据ID" />
      </el-form-item>
      <el-form-item label="流水触发的单据下对应的明细ID" prop="reasonItemId">
        <el-input v-model="formData.reasonItemId" placeholder="请输入流水触发的单据下对应的明细ID" />
      </el-form-item>
      <el-form-item label="前一个流水ID" prop="prevFlowId">
        <el-input v-model="formData.prevFlowId" placeholder="请输入前一个流水ID" />
      </el-form-item>
      <el-form-item label="变更量" prop="deltaQuantity">
        <el-input v-model="formData.deltaQuantity" placeholder="请输入变更量" />
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
      <el-form-item label="流水发生的时间" prop="flowTime">
        <el-date-picker
          v-model="formData.flowTime"
          type="date"
          value-format="x"
          placeholder="选择流水发生的时间"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { StockFlowApi, StockFlowVO } from '@/api/wms/stock-flow'

/** 库存流水 表单 */
defineOptions({ name: 'StockFlowForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  stockType: undefined,
  stockId: undefined,
  reason: undefined,
  reasonBillId: undefined,
  reasonItemId: undefined,
  prevFlowId: undefined,
  deltaQuantity: undefined,
  purchasePlanQuantity: undefined,
  purchaseTransitQuantity: undefined,
  returnTransitQuantity: undefined,
  pendingShelvingQuantity: undefined,
  availableQuantity: undefined,
  sellableQuantity: undefined,
  pendingOutboundQuantity: undefined,
  defectiveQuantity: undefined,
  flowTime: undefined,
})
const formRules = reactive({
  stockType: [{ required: true, message: '库存类型不能为空', trigger: 'change' }],
  stockId: [{ required: true, message: '库存ID，分别指向三张库存表的ID不能为空', trigger: 'blur' }],
  reason: [{ required: true, message: '流水发生的原因不能为空', trigger: 'blur' }],
  prevFlowId: [{ required: true, message: '前一个流水ID不能为空', trigger: 'blur' }],
  deltaQuantity: [{ required: true, message: '变更量不能为空', trigger: 'blur' }],
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
      formData.value = await StockFlowApi.getStockFlow(id)
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
    const data = formData.value as unknown as StockFlowVO
    if (formType.value === 'create') {
      await StockFlowApi.createStockFlow(data)
      message.success(t('common.createSuccess'))
    } else {
      await StockFlowApi.updateStockFlow(data)
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
    stockType: undefined,
    stockId: undefined,
    reason: undefined,
    reasonBillId: undefined,
    reasonItemId: undefined,
    prevFlowId: undefined,
    deltaQuantity: undefined,
    purchasePlanQuantity: undefined,
    purchaseTransitQuantity: undefined,
    returnTransitQuantity: undefined,
    pendingShelvingQuantity: undefined,
    availableQuantity: undefined,
    sellableQuantity: undefined,
    pendingOutboundQuantity: undefined,
    defectiveQuantity: undefined,
    flowTime: undefined,
  }
  formRef.value?.resetFields()
}
</script>