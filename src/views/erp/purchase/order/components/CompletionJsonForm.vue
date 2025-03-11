<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    v-loading="formLoading"
    label-width="0px"
    :inline-message="true"
  >
    <el-table :data="formData" class="-mt-10px">
      <el-table-column label="序号" type="index" align="center" width="60" />
      <el-table-column label="日期" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.dateTime`" class="mb-0px!">
            <el-date-picker
              v-model="row.dateTime"
              type="date"
              value-format="x"
              placeholder="请选择日期"
              class="!w-1/1"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="完工数量" fixed="right" min-width="120">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.finishCount`" class="mb-0px!">
            <el-input-number
              v-model="row.finishCount"
              placeholder="请输入完工数量"
              controls-position="right"
              :min="0"
              :precision="0"
              class="!w-100%"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="60">
        <template #default="{ $index }">
          <el-button @click="handleDelete($index)" link>—</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
  <el-row justify="center" class="mt-3">
    <el-button @click="handleAdd" round>+ 添加完工单</el-button>
  </el-row>
</template>
<script setup lang="ts">
import { ElForm } from 'element-plus'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  }
})
const formLoading = ref(false) // 表单的加载中
const formData = ref<any[]>([])
const formRules = reactive({
  // code: [{ required: true, message: '请选择国别代码', trigger: 'change' }],
  // price: [{ required: true, message: '指导价不能为空', trigger: 'blur' }]
})
const formRef = ref<InstanceType<typeof ElForm>>() // 表单 Ref
/** 初始化设置入库项 */
watch(
  () => props.items,
  async (val) => {
    formData.value = val
  },
  { immediate: true, deep: true }
)

/** 新增按钮操作 */
const handleAdd = () => {
  const row = {
    inspectionDate: undefined,
    inspectionPassCount: undefined
  }
  formData.value.push(row)
}

/** 删除按钮操作 */
const handleDelete = (index: number) => {
  formData.value.splice(index, 1)
}

/** 表单校验 */
const validate = () => {
  return formRef.value?.validate()
}
defineExpose({ validate, formData })

/** 初始化 */
onMounted(async () => {})
</script>
