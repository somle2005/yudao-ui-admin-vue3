<template>
  <Dialog width="1400" :title="dialogTitle" v-model="dialogVisible">
    <SmForm
      class="-mb-15px"
      ref="smFormRef"
      isCol
      label-width="150px"
      v-model="formData"
      v-loading="formLoading"
      :options="requestFormOptions"
      :getModelValue="getFormData"
    >
      <template #items>
        <el-tabs v-model="subTabsName" class="-mt-15px -mb-10px" style="width: 100%">
          <el-tab-pane label="申请产品清单" name="item">
            <ItemsForm ref="itemFormRef" :items="formData.items" :formType="formType" />
          </el-tab-pane>
        </el-tabs>
      </template>
      <template #fileUrl="{ model }">
        <UploadFile
          :is-show-tip="false"
          v-model="model.fileUrl"
          :limit="1"
        />
      </template>
    </SmForm>
    <div class="moreBtnList">
      <el-button @click="dialogVisible = false"> 取消</el-button>

      <el-button
        v-if="!auditType"
        type="primary"
        :disabled="formLoading"
        @click="submitFormDB(AUDIT_TYPE.agree)"
      >
        确定</el-button
      >

      <template v-if="auditType">
        <el-button type="danger" :disabled="formLoading" @click="submitFormDB(AUDIT_TYPE.reject)">
          不同意</el-button
        >
        <el-button type="primary" :disabled="formLoading" @click="submitFormDB(AUDIT_TYPE.agree)">
          同意</el-button
        >
      </template>
    </div>
  </Dialog>
</template>
<script setup lang="ts">
import { usePurchaseRequestForm } from './hooks'
import ItemsForm from './components/ItemsForm.vue'
import { createDBFn } from '@/utils/decorate'
import { AUDIT_TYPE } from '@/utils/constant'
import { computeDiscountPriceAndTotalPrice } from '@/utils/transformData'

const resetFormData = () => {
  // return reactive({
  //   requestTime: undefined,
  //   // applicant: undefined,
  //   // applicationDept: undefined,
  //   applicantId: undefined,
  //   applicationDeptId: undefined,
  //   supplierId: undefined,
  //   deliveryDelivery: '',
  //   items: [] as any
  //   // productId: undefined,
  //   // barCode: undefined
  // })
  return {
    requestTime: undefined,
    applicantId: undefined,
    applicationDeptId: undefined,
    supplierId: undefined,
    deliveryDelivery: '',
    items: [] as any
  }
}
// eslint-disable-next-line prefer-const
const formData = ref(resetFormData())





const getResetFormData = () => {
  formData.value = resetFormData()
}

const getFormData = () => {
  return formData.value
}

const emit = defineEmits(['success'])

let {
  dialogTitle,
  dialogVisible,
  openForm,
  requestFormOptions,
  smFormRef,
  submitForm,
  subTabsName,
  itemFormRef,
  formLoading,
  formType,
  auditBtnType,
  auditType
} = usePurchaseRequestForm({ getResetFormData, getFormData, emit })

const changeAuditBtnType = (type) => {
  auditBtnType.value = type
  submitForm()
}
const submitFormDB = createDBFn(changeAuditBtnType)




/** 计算 discountPrice、totalPrice 价格 */
watch(
  () => formData.value,
  (val) => {
    if (!val) {
      return
    }
    console.log('进入val了',val)
    // 编辑回显
    computeDiscountPriceAndTotalPrice(smFormRef, formData.value)
  },
  { deep: true }
)



onMounted(() => {})
onUnmounted(() => {})
defineExpose({ open: openForm }) // 提供 open 方法，用于打开弹窗
</script>
<style lang="scss" scoped>
.moreBtnList {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}
:global(.purchase-request-items .el-form-item__content) {
  margin-left: 0 !important;
}
</style>
