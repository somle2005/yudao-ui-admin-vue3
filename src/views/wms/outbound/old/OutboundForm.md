<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="单据号" prop="no">
        <el-input v-model="formData.no" placeholder="请输入单据号" />
      </el-form-item>
      <el-form-item label="仓库ID" prop="warehouseId">
        <el-input v-model="formData.warehouseId" placeholder="请输入仓库ID" />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="formData.type" placeholder="请选择类型">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio value="1">请选择字典生成</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="审核状态" prop="auditStatus">
        <el-radio-group v-model="formData.auditStatus">
          <el-radio value="1">请选择字典生成</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="来源单据ID" prop="sourceBillId">
        <el-input v-model="formData.sourceBillId" placeholder="请输入来源单据ID" />
      </el-form-item>
      <el-form-item label="来源单据号" prop="sourceBillNo">
        <el-input v-model="formData.sourceBillNo" placeholder="请输入来源单据号" />
      </el-form-item>
      <el-form-item label="来源单据类型" prop="sourceBillType">
        <el-select v-model="formData.sourceBillType" placeholder="请选择来源单据类型">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="特别说明，创建方专用" prop="creatorComment">
        <el-input v-model="formData.creatorComment" placeholder="请输入特别说明，创建方专用" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { OutboundApi, OutboundVO } from '@/api/wms/outbound'

/** 出库单 表单 */
defineOptions({ name: 'OutboundForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  no: undefined,
  warehouseId: undefined,
  type: undefined,
  status: undefined,
  auditStatus: undefined,
  sourceBillId: undefined,
  sourceBillNo: undefined,
  sourceBillType: undefined,
  creatorComment: undefined,
})
const formRules = reactive({
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
      formData.value = await OutboundApi.getOutbound(id)
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
    const data = formData.value as unknown as OutboundVO
    if (formType.value === 'create') {
      await OutboundApi.createOutbound(data)
      message.success(t('common.createSuccess'))
    } else {
      await OutboundApi.updateOutbound(data)
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
    no: undefined,
    warehouseId: undefined,
    type: undefined,
    status: undefined,
    auditStatus: undefined,
    sourceBillId: undefined,
    sourceBillNo: undefined,
    sourceBillType: undefined,
    creatorComment: undefined,
  }
  formRef.value?.resetFields()
}
</script>