<template>
  <el-form ref="formRef" :model="formData" :rules="formRules" label-width="180px">
    <el-row>
      <el-col :span="12">
        <el-form-item label="承重（kg）" prop="loadCapacity">
          <el-input-number v-model="formData.loadCapacity" controls-position="right" :min="1" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="收纳管理" prop="storageManagement">
          <el-row>
            <el-col :span="6">
              <el-checkbox v-model="storageManagementShow">是否具备</el-checkbox>
            </el-col>
            <el-col :span="18" v-if="storageManagementShow" style="padding-left: 20px">
              <el-form-item label-width="0" prop="storageManagement">
                <el-input
                  v-model="formData.storageManagement"
                  type="textarea"
                  :rows="1"
                  placeholder="请输入功能描述"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="调节脚垫" prop="adjustableFootPad">
          <el-row>
            <el-col :span="6">
              <el-checkbox v-model="adjustableFootPadShow">是否具备</el-checkbox>
            </el-col>
            <el-col :span="18" v-if="adjustableFootPadShow" style="padding-left: 20px">
              <el-form-item label-width="0" prop="adjustableFootPad">
                <el-input
                  v-model="formData.adjustableFootPad"
                  type="textarea"
                  :rows="1"
                  placeholder="请输入功能描述"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script lang="ts" setup>
/** ERP 电视机架产品 表单 */

import { ElForm } from 'element-plus'

// 定义 formData 的类型接口
interface FormData {
  productId?: number | undefined;
  loadCapacity?: number | undefined;
  storageManagement?: string | undefined; // 修改为仅允许字符串
  adjustableFootPad?: string | undefined;

}

defineOptions({ name: 'ProductDesktopStorageRack' })


// 分离复选框的状态
const storageManagementShow = ref(false)
const adjustableFootPadShow = ref(false)
const props = defineProps<{
  datas: Partial<FormData>;
}>()
onMounted(() => {
  // 使用 Object.entries 和 filter 进行拷贝，并提供默认值
  formData.value = Object.fromEntries(
    Object.entries(formData.value).map(([key, defaultValue]) => {
      return [key, key in props.datas ? props.datas[key] : defaultValue]
    })
  )
  if (formData.value.storageManagement !== undefined && formData.value.storageManagement.trim() !== '') {
    storageManagementShow.value = true
  }
  if (formData.value.adjustableFootPad !== undefined && formData.value.adjustableFootPad.trim() !== '') {
    adjustableFootPadShow.value = true
  }


})
const formData = ref<FormData>({
  productId: undefined,
  loadCapacity: undefined,
  storageManagement: undefined,
  adjustableFootPad: undefined,

})
const formRules = reactive({
  productId: [{ required: true, message: '产品主表id不能为空', trigger: 'blur' }],
})
const formRef = ref<InstanceType<typeof ElForm>>() // 表单 Ref

/** 提交表单 */
const validateForm = async () => {
  if (storageManagementShow.value === false) {
    formData.value.storageManagement = ''
  }
  if (adjustableFootPadShow.value === false) {
    formData.value.adjustableFootPad = ''
  }
  // 校验表单
  await formRef.value?.validate()
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    productId: undefined,
    loadCapacity: undefined,
    storageManagement: undefined,
    adjustableFootPad: undefined,
  }
  formRef.value?.resetFields()
}
defineExpose({ formData, validateForm, resetForm })
</script>
