<template>
  <el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px">
    <el-row>
      <el-col :span="12">
        <el-form-item label="层板承重（kg）" prop="shelfLoadCapacity">
          <el-input-number
              v-model="formData.shelfLoadCapacity"
              controls-position="right"
              :min="0.01"
              :precision="2"/>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="层板数量" prop="shelvesCount">
          <el-input-number
              v-model="formData.shelvesCount"
              controls-position="right"
              :min="1"
              :precision="0"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="宽度最大值" prop="widthMax">
          <el-input-number
              v-model="formData.widthMax"
              controls-position="right"
              :min="0.01"
              :precision="2"/>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="宽度最小值" prop="widthMin">
          <el-input-number
              v-model="formData.widthMin"
              controls-position="right"
              :min="0.01"
              :precision="2"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="长度最大值" prop="lengthMax">
          <el-input-number
              v-model="formData.lengthMax"
              controls-position="right"
              :min="0.01"
              :precision="2"/>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="长度最小值" prop="lengthMin">
          <el-input-number
              v-model="formData.lengthMin"
              controls-position="right"
              :min="0.01"
              :precision="2"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="电视调节方式" prop="tvAdjustmentMethod">
          <el-input v-model="formData.tvAdjustmentMethod" placeholder="请输入内容" type="textarea" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="层板调节方式" prop="shelfAdjustmentMethod">
          <el-input v-model="formData.shelfAdjustmentMethod" placeholder="请输入内容" type="textarea" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="设计说明" prop="description">
          <el-input v-model="formData.description" placeholder="请输入内容" type="textarea" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script lang="ts" setup>/** ERP 电视机架产品 表单 */

import {ElForm} from "element-plus";

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
const props = defineProps<{
  datas: any;
}>();
onMounted(()=> {
  // 使用 Object.entries 和 filter 进行拷贝，并提供默认值
  formData.value = Object.fromEntries(
      Object.entries(formData.value).map(([key, defaultValue]) => {
        return [key, key in props.datas ? props.datas[key] : defaultValue];
      })
  );
})
const formData = ref({
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
const formRef = ref<InstanceType<typeof ElForm>>(); // 表单 Ref

/** 提交表单 */
const validateForm = async () => {
  // 校验表单
  await formRef.value.validate()
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
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
defineExpose({ formData, validateForm, resetForm });
</script>
