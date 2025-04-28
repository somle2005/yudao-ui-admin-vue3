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
      <el-table-column label="序号" type="index" width="100" />
      <el-table-column label="产品编码" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.code`" :rules="formRules.code" class="mb-0px!">
            <el-input v-model="row.code" placeholder="请输入产品编码" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="产品id" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.productId`" :rules="formRules.productId" class="mb-0px!">
            <el-input v-model="row.productId" placeholder="请输入产品id" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="FBA条码" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.fbaBarCode`" :rules="formRules.fbaBarCode" class="mb-0px!">
            <el-input v-model="row.fbaBarCode" placeholder="请输入FBA条码" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="申请数量" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.qty`" :rules="formRules.qty" class="mb-0px!">
            <el-input v-model="row.qty" placeholder="请输入申请数量" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="包装长（cm）" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.packageLength`" :rules="formRules.packageLength" class="mb-0px!">
            <el-input v-model="row.packageLength" placeholder="请输入包装长（cm）" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="包装宽（cm）" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.packageWidth`" :rules="formRules.packageWidth" class="mb-0px!">
            <el-input v-model="row.packageWidth" placeholder="请输入包装宽（cm）" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="包装高（cm）" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.packageHeight`" :rules="formRules.packageHeight" class="mb-0px!">
            <el-input v-model="row.packageHeight" placeholder="请输入包装高（cm）" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="毛重（kg）" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.packageWeight`" :rules="formRules.packageWeight" class="mb-0px!">
            <el-input v-model="row.packageWeight" placeholder="请输入毛重（kg）" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="体积（m³）" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.volume`" :rules="formRules.volume" class="mb-0px!">
            <el-input v-model="row.volume" placeholder="请输入体积（m³）" />
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
    <el-button @click="handleAdd" round>+ 添加头程申请表明细</el-button>
  </el-row>
</template>
<script setup lang="ts">
import { FirstMileRequestApi } from '@/api/tms/first-mile-request'

const props = defineProps<{
  requestId: undefined // 所属申请单ID（主表的关联字段）
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref([])
const formRules = reactive({
  code: [{ required: true, message: '产品编码不能为空', trigger: 'blur' }],
  qty: [{ required: true, message: '申请数量不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.requestId,
  async (val) => {
    // 1. 重置表单
    formData.value = []
    // 2. val 非空，则加载数据
    if (!val) {
      return;
    }
    try {
      formLoading.value = true
      formData.value = await FirstMileRequestApi.getFirstMileRequestItemListByRequestId(val)
    } finally {
      formLoading.value = false
    }
  },
  { immediate: true }
)

/** 新增按钮操作 */
const handleAdd = () => {
  const row = {
    code: undefined,
    productId: undefined,
    fbaBarCode: undefined,
    qty: undefined,
    packageLength: undefined,
    packageWidth: undefined,
    packageHeight: undefined,
    packageWeight: undefined,
    volume: undefined,
  }
  row.requestId = props.requestId
  formData.value.push(row)
}

/** 删除按钮操作 */
const handleDelete = (index) => {
  formData.value.splice(index, 1)
}

/** 表单校验 */
const validate = () => {
  return formRef.value.validate()
}

/** 表单值 */
const getData = () => {
  return formData.value
}

defineExpose({ validate, getData })
</script>