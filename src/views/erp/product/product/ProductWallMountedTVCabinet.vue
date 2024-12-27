<template>
  <el-form ref="formRef" :model="formData" :rules="formRules" label-width="180px">
    <el-row>
      <el-col :span="12">
        <el-form-item label="承重（kg）" prop="loadCapacity">
          <el-input-number v-model="formData.loadCapacity" controls-position="right" :min="1" />
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
}

defineOptions({ name: 'ProductWallMountedTVCabinet' })


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

})
const formData = ref<FormData>({
  productId: undefined,
  loadCapacity: undefined,

})
const formRules = reactive({
  productId: [{ required: true, message: '产品主表id不能为空', trigger: 'blur' }],
})
const formRef = ref<InstanceType<typeof ElForm>>() // 表单 Ref

/** 提交表单 */
const validateForm = async () => {
  // 校验表单
  await formRef.value?.validate()
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    productId: undefined,
    loadCapacity: undefined,
  }
  formRef.value?.resetFields()
}
defineExpose({ formData, validateForm, resetForm })
</script>
