<template>
  <Dialog title="验货单" v-model="dialogVisible" width="1000">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      v-loading="formLoading"
      label-width="0px"
      :inline-message="true"
      :disabled="disabled"
    >
      <el-table :data="formData" class="-mt-10px">
        <el-table-column label="序号" type="index" align="center" width="60" />
        <el-table-column label="日期" min-width="150">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.inspectionDate`" class="mb-0px!">
              <el-date-picker
                v-model="row.inspectionDate"
                type="date"
                value-format="x"
                placeholder="请选择日期"
                class="!w-1/1"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="通过数量" fixed="right" min-width="120">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.inspectionPassCount`" class="mb-0px!">
              <el-input-number
                v-model="row.inspectionPassCount"
                placeholder="请输入通过数量"
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
      <el-button @click="handleAdd" round>+ 添加验收单</el-button>
    </el-row>
    <template #footer>
      <el-button @click="addJsonList" type="primary"> 确 定 </el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { ElForm } from 'element-plus'
import { useJsonList } from './hooks/useJsonList'

const props = defineProps({
  // items: {
  //   type: Array,
  //   default: () => []
  // },
  disabled: {
    type: Boolean,
    default: false
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
// watch(
//   () => props.items,
//   async (val) => {
//     formData.value = val
//   },
//   { immediate: true, deep: true }
// )

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

const { dialogVisible, open, addJsonList } = useJsonList(formData)

defineExpose({ validate, formData, open })

/** 初始化 */
onMounted(async () => {})
</script>
