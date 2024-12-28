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
        <el-form-item label="高度调节" prop="heightAdjustment">
          <el-row>
            <el-col :span="6">
              <el-checkbox v-model="heightAdjustmentShow">是否具备</el-checkbox>
            </el-col>
            <el-col :span="18" v-if="heightAdjustmentShow" style="padding-left: 20px">
              <el-form-item label-width="0" prop="heightAdjustment">
                <el-input
                  v-model="formData.heightAdjustment"
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
        <el-form-item label="电缆管理" prop="cableManagement">
          <el-row>
            <el-col :span="6">
              <el-checkbox v-model="cableManagementShow">是否具备</el-checkbox>
            </el-col>
            <el-col :span="18" v-if="cableManagementShow" style="padding-left: 20px">
              <el-form-item label-width="0" prop="cableManagement">
                <el-input
                  v-model="formData.cableManagement"
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
    <el-row>
      <el-col :span="24">
        <el-form-item label="适配尺寸" prop="adaptiveSize">
          <el-input v-model="formData.adaptiveSize" placeholder="请输入适配尺寸" type="textarea" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="兼容方式" prop="compatibilityMode">
          <el-input v-model="formData.compatibilityMode" placeholder="请输入兼容方式" type="textarea" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="其他" prop="otherFeatures">
          <el-input v-model="formData.otherFeatures" placeholder="请输入内容" type="textarea" />
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
  adaptiveSize?: string | undefined;
  compatibilityMode?: string | undefined;
  heightAdjustment?: string | undefined; // 修改为仅允许字符串
  adjustableFootPad?: string | undefined; // 修改为仅允许字符串
  cableManagement?: string | undefined; // 修改为仅允许字符串
  otherFeatures?: string | undefined;

}

defineOptions({ name: 'ProductSpeakerStand' })


// 分离复选框的状态
const heightAdjustmentShow = ref(false)
const cableManagementShow = ref(false)
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
  // 检查 tvRotation 是否为空

  if (formData.value.heightAdjustment !== undefined && formData.value.heightAdjustment !== '') {
    heightAdjustmentShow.value = true
  }
  if (formData.value.cableManagement !== undefined && formData.value.cableManagement !== '') {
    cableManagementShow.value = true
  }
  if (formData.value.adjustableFootPad !== undefined && formData.value.adjustableFootPad !== '') {
    adjustableFootPadShow.value = true
  }


})
const formData = ref<FormData>({
  productId: undefined,
  loadCapacity: undefined,
  adaptiveSize: undefined,
  compatibilityMode: undefined,
  heightAdjustment: undefined,
  adjustableFootPad: undefined,
  cableManagement: undefined,
  otherFeatures: undefined,

})
const formRules = reactive({
  productId: [{ required: true, message: '产品主表id不能为空', trigger: 'blur' }],
})
const formRef = ref<InstanceType<typeof ElForm>>() // 表单 Ref

/** 提交表单 */
const validateForm = async () => {
  //判断所有复选框是否被选择，没选择清空响应的内容
  if (heightAdjustmentShow.value === false) {
    formData.value.heightAdjustment = ''
  }
  if (cableManagementShow.value === false) {
    formData.value.cableManagement = ''
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
    adaptiveSize: undefined,
    compatibilityMode: undefined,
    heightAdjustment: undefined,
    adjustableFootPad: undefined,
    cableManagement: undefined,
    otherFeatures: undefined,
  }
  formRef.value?.resetFields()
}
defineExpose({ formData, validateForm, resetForm })
</script>
