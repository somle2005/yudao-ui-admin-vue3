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
      <el-table-column label="国家" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item
            :prop="`${$index}.countryCode`"
            :rules="formRules.countryCode"
            class="mb-0px!"
          >
            <el-select
              v-model="row.countryCode"
              placeholder="请选择国家"
              clearable
              class="!w-240px"
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.COUNTRY_CODE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="HS编码" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.hsCode`" :rules="formRules.hsCode" class="mb-0px!">
            <el-input v-model="row.hsCode" placeholder="请输入HS编码" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="税率" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.taxRate`" :rules="formRules.taxRate" class="mb-0px!">
            <el-input-number
              v-model="row.taxRate"
              controls-position="right"
              :min="0"
              :precision="2"
              class="!w-100%"
              placeholder="请输入税率"
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
    <el-button @click="handleAdd" round>+ 添加海关品类子表</el-button>
  </el-row>
</template>
<script setup lang="ts">
import { CustomRuleCategoryApi } from '@/api/erp/logistic/custom-category'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

const props = defineProps({
  // 分类表id（主表的关联字段）
  categoryId: {
    type: Number,
    default: null
  }
})
const formLoading = ref(false) // 表单的加载中
const formData: any = ref([])
const formRules = reactive({
  categoryId: [{ required: true, message: '分类表id不能为空', trigger: 'blur' }],
  countryCode: [{ required: true, message: '国家-字典不能为空', trigger: 'blur' }],
  hsCode: [{ required: true, message: 'HS编码不能为空', trigger: 'blur' }],
  taxRate: [{ required: true, message: '税率不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.categoryId,
  async (val) => {
    // 1. 重置表单
    formData.value = []
    // 2. val 非空，则加载数据
    if (!val) {
      return
    }
    try {
      formLoading.value = true
      formData.value = await CustomRuleCategoryApi.getCustomRuleCategoryItemListByCategoryId(val)
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
    categoryId: undefined,
    countryCode: undefined,
    hsCode: undefined,
    taxRate: undefined
  }
  row.categoryId = props.categoryId
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

/** 初始化 */
onMounted(() => {
  // 默认添加一个
  if (formData.value.length === 0) {
    handleAdd()
  }
})
</script>
