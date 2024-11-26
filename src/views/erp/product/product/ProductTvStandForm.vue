<template>
  <el-form ref="formRef" :model="details" :rules="formRules" label-width="100px">
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
    <!--      <el-form-item label="长度最小值" prop="lengthMin">-->
    <!--        <el-input :model-value="formData.lengthMin" @update:model-value="foo($event)" placeholder="请输入长度最小值"/>-->
    <!--      </el-form-item>-->
  </el-form>
</template>
<script setup lang="ts">

/** ERP 电视机架产品 表单 */
import { defineModel } from 'vue';
defineOptions({ name: 'ProductTvStandForm' })
// 声明事件
// const emit = defineEmits(['update:details'])
// const props = defineProps({
//   details: {
//     type: Object,
//     default: () => (ref({
//       id: undefined,
//       productId: undefined,
//       shelfLoadCapacity: undefined,
//       shelvesCount: undefined,
//       tvAdjustmentMethod: undefined,
//       shelfAdjustmentMethod: undefined,
//       description: undefined,
//       widthMax: undefined,
//       widthMin: undefined,
//       lengthMax: undefined,
//       lengthMin: undefined,
//     }))
//   }
// })
// const formData = computed({
//   get: () => props.details,
//   set: (val) => {
//     console.log("update")
//     emit('update:details', val)
//   }
// })
//
// function foo(val) {
//   console.log(val)
//   formData.lengthMin = val
// }

// defineModel(['details'])
// 接收props
// const props = withDefaults(
//   defineProps<{
//     details: {
//       id: undefined,
//       productId: undefined,
//       shelfLoadCapacity: undefined,
//       shelvesCount: undefined,
//       tvAdjustmentMethod: undefined,
//       shelfAdjustmentMethod: undefined,
//       description: undefined,
//       widthMax: undefined,
//       widthMin: undefined,
//       lengthMax: undefined,
//       lengthMin: undefined,
//     }
//   }>(),
//   {
//     tags: () => []
//   }
// )

// const details = defineModel({
//   prop: 'details', // The custom prop name
//   event: 'update:details', // The event name for updates
//   default: () => ref({
//       id: undefined,
//       productId: undefined,
//       shelfLoadCapacity: undefined,
//       shelvesCount: undefined,
//       tvAdjustmentMethod: undefined,
//       shelfAdjustmentMethod: undefined,
//       description: undefined,
//       widthMax: undefined,
//       widthMin: undefined,
//       lengthMax: undefined,
//       lengthMin: 1,
//   })
// });


// Watch for changes to 'name'
// watch(details, (newVal, oldVal) => {
//   console.log(newVal)
//   $emit('update:details', newVal)
// });


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

/** 提交表单 */
const validateForm = async () => {
  // 校验表单
  await formRef.value.validate()
}

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
defineExpose({ formData })
</script>
