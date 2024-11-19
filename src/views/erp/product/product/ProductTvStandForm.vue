<template>
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="层板承重" prop="shelfLoadCapacity">
        <el-input v-model="formData.shelfLoadCapacity" placeholder="请输入层板承重" />
      </el-form-item>
      <el-form-item label="层板数量" prop="shelvesCount">
        <el-input v-model="formData.shelvesCount" placeholder="请输入层板数量" />
      </el-form-item>
      <el-form-item label="电视调节方式" prop="tvAdjustmentMethod">
        <el-input v-model="formData.tvAdjustmentMethod" placeholder="请输入电视调节方式" />
      </el-form-item>
      <el-form-item label="层板调节方式" prop="shelfAdjustmentMethod">
        <el-input v-model="formData.shelfAdjustmentMethod" placeholder="请输入层板调节方式" />
      </el-form-item>
      <el-form-item label="设计说明" prop="description">
        <el-input v-model="formData.description" placeholder="请输入设计说明" />
      </el-form-item>
      <el-form-item label="宽度最大值" prop="widthMax">
        <el-input v-model="formData.widthMax" placeholder="请输入宽度最大值" />
      </el-form-item>
      <el-form-item label="宽度最小值" prop="widthMin">
        <el-input v-model="formData.widthMin" placeholder="请输入宽度最小值" />
      </el-form-item>
      <el-form-item label="长度最大值" prop="lengthMax">
        <el-input v-model="formData.lengthMax" placeholder="请输入长度最大值" />
      </el-form-item>
      <el-form-item label="长度最小值" prop="lengthMin">
        <el-input v-model="formData.lengthMin" placeholder="请输入长度最小值" />
      </el-form-item>
    </el-form>
</template>
<script setup lang="ts">

/** ERP 电视机架产品 表单 */
defineOptions({ name: 'ProductTvStandForm' })


const message = useMessage() // 消息弹窗
const formData = ref({
  id: undefined,
  productId: undefined,
  shelfLoadCapacity: undefined,
  shelvesCount: undefined,
  tvAdjustmentMethod: undefined,
  shelfAdjustmentMethod: undefined,
  description: undefined,
  widthMax: undefined,
  widthMin: undefined,
  lengthMax: undefined,
  lengthMin: undefined,
})
const formRules = reactive({
  productId: [{ required: true, message: '产品主表id不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    productId: undefined,
    shelfLoadCapacity: undefined,
    shelvesCount: undefined,
    tvAdjustmentMethod: undefined,
    shelfAdjustmentMethod: undefined,
    description: undefined,
    widthMax: undefined,
    widthMin: undefined,
    lengthMax: undefined,
    lengthMin: undefined,
  }
  formRef.value?.resetFields()
}
</script>
