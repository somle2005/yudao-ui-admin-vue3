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
      <template #items>
        <!-- v-if="formData.type && formData.warehouseId" -->
        <el-tabs v-model="subTabsName" class="-mt-15px -mb-10px" style="width: 100%">
          <el-tab-pane label="换货清单" name="itemForm">
            <ItemForm
              ref="itemFormRef"
              :items="formData.itemList"
              :formType="formType"
              :disabled="itemsFormdisabled"
            />
          </el-tab-pane>
        </el-tabs>
      </template>
    </SmForm>

    <template #footer>
      <el-button v-if="!auditType" @click="submitFormDB" type="primary" :disabled="formLoading"
        >确 定</el-button
      >
      <template v-if="auditType">
        <el-button type="danger" :disabled="formLoading" @click="submitFormDB(AUDIT_TYPE.reject)">
          不同意</el-button
        >

        <el-button type="primary" :disabled="formLoading" @click="submitFormDB(AUDIT_TYPE.agree)">
          同意入库</el-button
        >
      </template>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { ExchangeApi, ExchangeVO } from '@/api/wms/exchange'
import ItemForm from './components/ItemForm.vue'
import { useForm } from './hooks/useForm'
import { AUDIT_TYPE } from '@/utils/constant'
import { createDBFn } from '@/utils/decorate'
import { InfoKeyOpenFormData } from './hooks/injectKeys'

/** 换货单 表单 */
defineOptions({ name: 'ExchangeForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const initFormData = () => {
  return {
    id: undefined,
    code: undefined,
    type: undefined,
    warehouseId: undefined,
    auditStatus: undefined,
    remark: undefined,
    itemList: [],
    tips: '仓库和类型选择后才能出现换货清单,联动带出源库位'
  }
}
const formData = ref(initFormData())
const formRef = ref() // 表单 Ref

provide(InfoKeyOpenFormData, formData)

const {
  changeExchangeWarehouseList,
  getFormData,
  requestFormOptions,
  operateForm,
  initDialogData,
  itemFormRef,
  subTabsName,
  itemsFormdisabled,
  auditType
} = useForm(formType, formData, formRef)

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  operateForm(type)
  initDialogData()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await ExchangeApi.getExchange(id)
      changeExchangeWarehouseList(formData.value.type)
      formRef.value.initForm()
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async (type?: string) => {
  // 校验表单
  await formRef.value.validate()
  // 校验子表单
  await itemFormRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ExchangeVO as any
    if (formType.value === 'create') {
      await ExchangeApi.createExchange(data)
      message.success(t('common.createSuccess'))
    } else if (formType.value === 'update') {
      await ExchangeApi.updateExchange(data)
      message.success(t('common.updateSuccess'))
    } else if (formType.value === 'audit') {
      if (type === AUDIT_TYPE.agree) {
        await ExchangeApi.agreeExchangeAuditStatus({ billId: data.id, comment: data.comment })
      } else if (type === AUDIT_TYPE.reject) {
        await ExchangeApi.rejectExchangeAuditStatus({ billId: data.id, comment: data.comment })
      }
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
</script>
