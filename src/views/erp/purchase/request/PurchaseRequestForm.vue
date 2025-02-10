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
      <!-- <template #primaryImageUrl="{ scope, model }">
      <UploadImg v-model="model[scope.prop]" />
    </template> -->
      <!-- <template #action>
      <div class="moreBtnList">
        <el-button type="primary" @click="handleQuery"> 确定</el-button>
      </div>
    </template> -->

      <template #items="{ scope, model }">
        {{ console.log(scope, model, '打印scope-model') }}
        <el-tabs v-model="subTabsName" class="-mt-15px -mb-10px" style="width: 100%">
          <el-tab-pane label="申请产品清单" name="item">
            <ItemsForm ref="itemFormRef" :items="formData.items" :formType="formType" />
            <!-- <PurchaseRequestItemForm ref="itemFormRef" :items="formData.items" :disabled="disabled" /> -->
          </el-tab-pane>
        </el-tabs>
      </template>
    </SmForm>
    <div class="moreBtnList">
      <el-button @click="dialogVisible = false"> 取消</el-button>
      <el-button type="primary" :disabled="formLoading" @click="submitForm"> 确定</el-button>
    </div>
  </Dialog>
</template>
<script setup lang="ts">
import { usePurchaseRequestForm } from './hooks'
import ItemsForm from './components/ItemsForm.vue'

const resetFormData = () => {
  return reactive({
    requestTime: undefined,
    // applicant: undefined,
    // applicationDept: undefined,
    applicantId: undefined,
    applicationDeptId: undefined,
    supplierId: undefined,
    deliveryDelivery: '',
    items: [] as any
    // productId: undefined,
    // barCode: undefined
  })
}
// eslint-disable-next-line prefer-const
let formData = resetFormData()

const getResetFormData = () => {
  formData = resetFormData()
}

const getFormData = () => {
  return formData
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
  formType
} = usePurchaseRequestForm({ getResetFormData, getFormData, emit })

// usePurchaseRequestForm({ getResetFormData, getFormData, successCallback: getList })
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
