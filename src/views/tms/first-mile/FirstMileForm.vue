<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="编码" prop="code">
        <el-input v-model="formData.code" placeholder="请输入编码" />
      </el-form-item>
      <el-form-item label="单据日期" prop="billTime">
        <el-date-picker
          v-model="formData.billTime"
          type="date"
          value-format="x"
          placeholder="选择单据日期"
        />
      </el-form-item>
      <el-form-item label="物流商ID" prop="carrierId">
        <el-select v-model="formData.carrierId" placeholder="请选择物流商ID">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="结算日期" prop="settlementDate">
        <el-radio-group v-model="formData.settlementDate">
          <el-radio value="1">请选择字典生成</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="应付款余额" prop="balance">
        <el-input v-model="formData.balance" placeholder="请输入应付款余额" />
      </el-form-item>
      <el-form-item label="目的仓ID" prop="toWarehouseId">
        <el-select v-model="formData.toWarehouseId" placeholder="请选择目的仓ID">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="提单号" prop="ladingNo">
        <el-input v-model="formData.ladingNo" placeholder="请输入提单号" />
      </el-form-item>
      <el-form-item label="柜型（字典）" prop="cabinetType">
        <el-select v-model="formData.cabinetType" placeholder="请选择柜型（字典）">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="装柜日期" prop="packTime">
        <el-date-picker
          v-model="formData.packTime"
          type="date"
          value-format="x"
          placeholder="选择装柜日期"
        />
      </el-form-item>
      <el-form-item label="预计到货日期" prop="arrivePlanTime">
        <el-date-picker
          v-model="formData.arrivePlanTime"
          type="date"
          value-format="x"
          placeholder="选择预计到货日期"
        />
      </el-form-item>
      <el-form-item label="预计送仓时间" prop="deliveryEstimateTime">
        <el-date-picker
          v-model="formData.deliveryEstimateTime"
          type="date"
          value-format="x"
          placeholder="选择预计送仓时间"
        />
      </el-form-item>
      <el-form-item label="实际送仓时间" prop="deliveryActualTime">
        <el-date-picker
          v-model="formData.deliveryActualTime"
          type="date"
          value-format="x"
          placeholder="选择实际送仓时间"
        />
      </el-form-item>
      <el-form-item label="货柜体积（m³）" prop="totalVolume">
        <el-input v-model="formData.totalVolume" placeholder="请输入货柜体积（m³）" />
      </el-form-item>
      <el-form-item label="货柜毛重（kg）" prop="totalWeight">
        <el-input v-model="formData.totalWeight" placeholder="请输入货柜毛重（kg）" />
      </el-form-item>
      <el-form-item label="货柜净重（kg）" prop="netWeight">
        <el-input v-model="formData.netWeight" placeholder="请输入货柜净重（kg）" />
      </el-form-item>
      <el-form-item label="货柜货值（按最近采购价）" prop="totalValue">
        <el-input v-model="formData.totalValue" placeholder="请输入货柜货值（按最近采购价）" />
      </el-form-item>
      <el-form-item label="货柜件数" prop="totalQty">
        <el-input v-model="formData.totalQty" placeholder="请输入货柜件数" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="发货状态" prop="outboundStatus">
        <el-radio-group v-model="formData.outboundStatus">
          <el-radio value="1">请选择字典生成</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="出库时间" prop="outboundTime">
        <el-date-picker
          v-model="formData.outboundTime"
          type="date"
          value-format="x"
          placeholder="选择出库时间"
        />
      </el-form-item>
      <el-form-item label="入库状态" prop="inboundStatus">
        <el-radio-group v-model="formData.inboundStatus">
          <el-radio value="1">请选择字典生成</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="入库时间" prop="inboundTime">
        <el-date-picker
          v-model="formData.inboundTime"
          type="date"
          value-format="x"
          placeholder="选择入库时间"
        />
      </el-form-item>
    </el-form>
    <!-- 子表的表单 -->
    <el-tabs v-model="subTabsName">
      <el-tab-pane label="头程单明细" name="firstMileItem">
        <FirstMileItemForm ref="firstMileItemFormRef" :first-mile-id="formData.id" />
      </el-tab-pane>
      <el-tab-pane label="出运订单费用明细" name="fee">
        <FeeForm ref="feeFormRef" :source-id="formData.id" />
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { FirstMileApi, FirstMileVO } from '@/api/tms/first-mile'
import FirstMileItemForm from './components/FirstMileItemForm.vue'
import FeeForm from './components/FeeForm.vue'

/** 头程单 表单 */
defineOptions({ name: 'FirstMileForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  code: undefined,
  billTime: undefined,
  carrierId: undefined,
  settlementDate: undefined,
  balance: undefined,
  toWarehouseId: undefined,
  ladingNo: undefined,
  cabinetType: undefined,
  packTime: undefined,
  arrivePlanTime: undefined,
  deliveryEstimateTime: undefined,
  deliveryActualTime: undefined,
  totalVolume: undefined,
  totalWeight: undefined,
  netWeight: undefined,
  totalValue: undefined,
  totalQty: undefined,
  remark: undefined,
  outboundStatus: undefined,
  outboundTime: undefined,
  inboundStatus: undefined,
  inboundTime: undefined,
})
const formRules = reactive({
  code: [{ required: true, message: '编码不能为空', trigger: 'blur' }],
  toWarehouseId: [{ required: true, message: '目的仓ID不能为空', trigger: 'change' }],
  packTime: [{ required: true, message: '装柜日期不能为空', trigger: 'blur' }],
  arrivePlanTime: [{ required: true, message: '预计到货日期不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 子表的表单 */
const subTabsName = ref('firstMileItem')
const firstMileItemFormRef = ref()
const feeFormRef = ref()

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
      formData.value = await FirstMileApi.getFirstMile(id)
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
  // 校验子表单
  try {
    await firstMileItemFormRef.value.validate()
  } catch (e) {
    subTabsName.value = 'firstMileItem'
    return
  }
  try {
    await feeFormRef.value.validate()
  } catch (e) {
    subTabsName.value = 'fee'
    return
  }
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as FirstMileVO
    // 拼接子表的数据
    data.firstMileItems = firstMileItemFormRef.value.getData()
    data.fees = feeFormRef.value.getData()
    if (formType.value === 'create') {
      await FirstMileApi.createFirstMile(data)
      message.success(t('common.createSuccess'))
    } else {
      await FirstMileApi.updateFirstMile(data)
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
    code: undefined,
    billTime: undefined,
    carrierId: undefined,
    settlementDate: undefined,
    balance: undefined,
    toWarehouseId: undefined,
    ladingNo: undefined,
    cabinetType: undefined,
    packTime: undefined,
    arrivePlanTime: undefined,
    deliveryEstimateTime: undefined,
    deliveryActualTime: undefined,
    totalVolume: undefined,
    totalWeight: undefined,
    netWeight: undefined,
    totalValue: undefined,
    totalQty: undefined,
    remark: undefined,
    outboundStatus: undefined,
    outboundTime: undefined,
    inboundStatus: undefined,
    inboundTime: undefined,
  }
  formRef.value?.resetFields()
}
</script>