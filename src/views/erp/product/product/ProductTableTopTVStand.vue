<template>
  <el-form ref="formRef" :model="formData" :rules="formRules" label-width="180px">
    <el-row>
      <el-col :span="12">
        <el-form-item label="VESA最小长度（mm）" prop="vesaLengthMin">
          <el-input-number v-model="formData.vesaLengthMin" controls-position="right" :min="1" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="VESA最大长度（mm）" prop="vesaLengthMax">
          <el-input-number v-model="formData.vesaLengthMax" controls-position="right" :min="1" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="VESA最小宽度（mm）" prop="vesaWidthMin">
          <el-input-number v-model="formData.vesaWidthMin" controls-position="right" :min="1" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="VESA最大宽度（mm）" prop="vesaWidthMax">
          <el-input-number v-model="formData.vesaWidthMax" controls-position="right" :min="1" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="承重（kg）" prop="loadCapacity">
          <el-input-number v-model="formData.loadCapacity" controls-position="right" :min="1" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="中心高度最小值（mm）" prop="centerHeightMin">
          <el-input-number v-model="formData.centerHeightMin" controls-position="right" :min="1" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="中心高度最大值（mm）" prop="centerHeightMax">
          <el-input-number v-model="formData.centerHeightMax" controls-position="right" :min="1" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="电视尺寸最小值（inch）" prop="tvSizeMin">
          <el-input-number v-model="formData.tvSizeMin" controls-position="right" :min="1" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="电视尺寸最大值（inch）" prop="tvSizeMax">
          <el-input-number v-model="formData.tvSizeMax" controls-position="right" :min="1" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="电视旋转" prop="tvRotation">
          <el-row>
            <el-col :span="6">
              <el-checkbox v-model="tvRotationShow">是否具备</el-checkbox>
            </el-col>
            <el-col :span="18" v-if="tvRotationShow" style="padding-left: 20px">
              <el-form-item label-width="0" prop="tvRotation">
                <el-input
                  v-model="formData.tvRotation"
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
        <el-form-item label="电视俯视" prop="tvTilt">
          <el-row>
            <el-col :span="6">
              <el-checkbox v-model="tvTiltShow">是否具备</el-checkbox>
            </el-col>
            <el-col :span="18" v-if="tvTiltShow" style="padding-left: 20px">
              <el-form-item label-width="0" prop="tvTilt">
                <el-input
                  v-model="formData.tvTilt"
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
        <el-form-item label="横竖屏旋转" prop="horizontalScreenRotation">
          <el-row>
            <el-col :span="6">
              <el-checkbox v-model="horizontalScreenRotationShow">是否具备</el-checkbox>
            </el-col>
            <el-col :span="18" v-if="horizontalScreenRotationShow" style="padding-left: 20px">
              <el-form-item label-width="0" prop="horizontalScreenRotation">
                <el-input
                  v-model="formData.horizontalScreenRotation"
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
  vesaWidthMin?: number | undefined;
  vesaWidthMax?: number | undefined;
  vesaLengthMax?: number | undefined;
  vesaLengthMin?: number | undefined;
  tvSizeMin?: number | undefined;
  tvSizeMax?: number | undefined;
  loadCapacity?: number | undefined;
  centerHeightMin?: number | undefined;
  centerHeightMax?: number | undefined;
  tvRotation?: string | undefined; // 修改为仅允许字符串
  tvTilt?: string | undefined; // 修改为仅允许字符串
  heightAdjustment?: string | undefined; // 修改为仅允许字符串
  horizontalScreenRotation?: string | undefined; // 修改为仅允许字符串
  cableManagement?: string | undefined; // 修改为仅允许字符串
  storageManagement?: string | undefined; // 修改为仅允许字符串
  adjustableFootPad?: string | undefined; // 修改为仅允许字符串
  otherFeatures?: string | undefined;
}

defineOptions({ name: 'ProductTableTopTVStand' })


// 分离复选框的状态
const tvRotationShow = ref(false)
const tvTiltShow = ref(false)
const heightAdjustmentShow = ref(false)
const horizontalScreenRotationShow = ref(false)
const cableManagementShow = ref(false)
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
  // 检查 tvRotation 是否为空
  if (formData.value.tvRotation !== undefined && formData.value.tvRotation.trim() !== '') {
    tvRotationShow.value = true
  }
  if (formData.value.tvTilt !== undefined && formData.value.tvTilt.trim() !== '') {
    tvTiltShow.value = true
  }
  if (formData.value.heightAdjustment !== undefined && formData.value.heightAdjustment.trim() !== '') {
    heightAdjustmentShow.value = true
  }
  if (formData.value.horizontalScreenRotation !== undefined && formData.value.horizontalScreenRotation.trim() !== '') {
    horizontalScreenRotationShow.value = true
  }
  if (formData.value.cableManagement !== undefined && formData.value.cableManagement.trim() !== '') {
    cableManagementShow.value = true
  }
  if (formData.value.storageManagement !== undefined && formData.value.storageManagement.trim() !== '') {
    storageManagementShow.value = true
  }
  if (formData.value.adjustableFootPad !== undefined && formData.value.adjustableFootPad.trim() !== '') {
    adjustableFootPadShow.value = true
  }


})
const formData = ref<FormData>({
  productId: undefined,
  vesaWidthMin: undefined,
  vesaWidthMax: undefined,
  vesaLengthMax: undefined,
  vesaLengthMin: undefined,
  tvSizeMin: undefined,
  tvSizeMax: undefined,
  loadCapacity: undefined,
  centerHeightMin: undefined,
  centerHeightMax: undefined,
  tvRotation: undefined,
  tvTilt: undefined,
  heightAdjustment: undefined,
  horizontalScreenRotation: undefined,
  cableManagement: undefined,
  storageManagement: undefined,
  adjustableFootPad: undefined,
  otherFeatures: undefined,

})
const formRules = reactive({
  productId: [{ required: true, message: '产品主表id不能为空', trigger: 'blur' }],
  tvSizeMax: [{ required: true, message: '电视尺寸最小值', trigger: 'blur' }],
  tvSizeMin: [{ required: true, message: '电视尺寸最大值', trigger: 'blur' }]
})
const formRef = ref<InstanceType<typeof ElForm>>() // 表单 Ref

/** 提交表单 */
const validateForm = async () => {
  //判断所有复选框是否被选择，没选择清空响应的内容
  if (tvRotationShow.value === false) {
    formData.value.tvRotation = ''
  }
  if (tvTiltShow.value === false) {
    formData.value.tvTilt = ''
  }
  if (heightAdjustmentShow.value === false) {
    formData.value.heightAdjustment = ''
  }
  if (horizontalScreenRotationShow.value === false) {
    formData.value.horizontalScreenRotation = ''
  }
  if (cableManagementShow.value === false) {
    formData.value.cableManagement = ''
  }
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
    vesaWidthMin: undefined,
    vesaWidthMax: undefined,
    vesaLengthMax: undefined,
    vesaLengthMin: undefined,
    tvSizeMin: undefined,
    tvSizeMax: undefined,
    loadCapacity: undefined,
    centerHeightMin: undefined,
    centerHeightMax: undefined,
    tvRotation: undefined,
    tvTilt: undefined,
    heightAdjustment: undefined,
    horizontalScreenRotation: undefined,
    cableManagement: undefined,
    storageManagement: undefined,
    adjustableFootPad: undefined,
    otherFeatures: undefined
  }
  formRef.value?.resetFields()
}
defineExpose({ formData, validateForm, resetForm })
</script>
