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
      <el-table-column label="原单类型;出运订单、调拨单" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.sourceType`" :rules="formRules.sourceType" class="mb-0px!">
            <el-radio-group v-model="row.sourceType">
                <el-radio value="1">请选择字典生成</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
      </el-table-column>
       <el-table-column label="费用类型（如运输费、关税）;字典" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.costType`" :rules="formRules.costType" class="mb-0px!">
            <el-radio-group v-model="row.costType">
                <el-radio value="1">请选择字典生成</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="金额" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.amount`" :rules="formRules.amount" class="mb-0px!">
            <el-input v-model="row.amount" placeholder="请输入金额" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="币种;名称（如 USD、CNY） 字典" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.currencyType`" :rules="formRules.currencyType" class="mb-0px!">
            <el-select v-model="row.currencyType" placeholder="请选择币种;名称（如 USD、CNY） 字典">
                <el-option label="请选择字典生成" value="" />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.remark`" :rules="formRules.remark" class="mb-0px!">
            <el-input v-model="row.remark" placeholder="请输入备注" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="乐观锁版本号" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.revision`" :rules="formRules.revision" class="mb-0px!">
            <el-input v-model="row.revision" placeholder="请输入乐观锁版本号" />
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
    <el-button @click="handleAdd" round>+ 添加出运订单费用明细</el-button>
  </el-row>
</template>
<script setup lang="ts">
import { FirstMileApi } from '@/api/tms/first-mile'

const props = defineProps<{
  sourceId: undefined // 原单ID;出运订单ID、调拨单ID（主表的关联字段）
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref([])
const formRules = reactive({
  sourceId: [{ required: true, message: '原单ID;出运订单ID、调拨单ID不能为空', trigger: 'blur' }],
  costType: [{ required: true, message: '费用类型（如运输费、关税）;字典不能为空', trigger: 'blur' }],
  amount: [{ required: true, message: '金额不能为空', trigger: 'blur' }],
  currencyType: [{ required: true, message: '币种;名称（如 USD、CNY） 字典不能为空', trigger: 'change' }],
})
const formRef = ref() // 表单 Ref

/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.sourceId,
  async (val) => {
    // 1. 重置表单
    formData.value = []
    // 2. val 非空，则加载数据
    if (!val) {
      return;
    }
    try {
      formLoading.value = true
      formData.value = await FirstMileApi.getFeeListBySourceId(val)
    } finally {
      formLoading.value = false
    }
  },
  { immediate: true }
)

/** 新增按钮操作 */
const handleAdd = () => {
  const row = {
    id: undefined,
    sourceType: undefined,
    sourceId: undefined,
    costType: undefined,
    amount: undefined,
    currencyType: undefined,
    remark: undefined,
    revision: undefined,
  }
  row.sourceId = props.sourceId
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