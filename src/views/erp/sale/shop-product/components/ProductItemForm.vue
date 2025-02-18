<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    v-loading="formLoading"
    label-width="0px"
    :inline-message="true"
  >
    <el-table :data="formData" class="-mt-10px" height="400px">
      <!-- <el-table-column label="序号" type="index" align="center" width="60" /> -->

      <el-table-column align="center" label="图片" min-width="60">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.primaryImageUrl`" class="mb-0px!">
            <el-image :src="row.primaryImageUrl" class="w-64px h-64px" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column align="center" label="SKU（编码）" min-width="120">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.barCode`" class="mb-0px!">
            <div class="text"> {{ row.barCode }}</div>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column align="center" label="产品名称" min-width="120">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.name`" class="mb-0px!">
            <div class="text"> {{ row.name }}</div>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column align="center" label="数量" :rules="formRules.quantity" min-width="100">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.quantity`" class="mb-0px!">
            <el-input-number
              v-model="row.quantity"
              placeholder="请输入数量"
              controls-position="right"
              :min="1"
              class="!w-100%"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="60">
        <template #default="{ $index }">
          <el-button @click="handleDelete($index)" link>—</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
  <!-- <el-row justify="center" class="mt-3">
    <el-button @click="handleAdd" round>+ 添加产品</el-button>
  </el-row> -->
</template>
<script setup lang="ts">
import { ElForm } from 'element-plus'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  }
})
const formLoading = ref(false) // 表单的加载中
const formData = ref<any[]>([])
const formRules = reactive({
  quantity: [{ required: true, message: '数量不能为空', trigger: 'blur' }]
})
const formRef = ref<InstanceType<typeof ElForm>>() // 表单 Ref
/** 初始化设置入库项 */
watch(
  () => props.items,
  async (val) => {
    formData.value = val
  },
  { immediate: true }
)

/** 新增按钮操作 */
const handleAdd = () => {
  const row = {
    code: undefined,
    price: undefined
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
defineExpose({ validate })

/** 初始化 */
onMounted(async () => {})
</script>
<style lang="scss" scoped>
.text {
  width: 100%;
  text-align: center;
}
</style>