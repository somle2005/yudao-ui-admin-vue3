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

      <el-table-column label="产品编码" width="150" align="center">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.productId`" :rules="formRules.productId" class="mb-0px!">
            <SmSelect
              v-model="row.productId"
              placeholder="请选择产品编码"
              :data="productList"
              :keyMap="{ label: 'barCode', value: 'id' }"
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="数量" width="80">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.qty`" :rules="formRules.qty" class="mb-0px!">
            <SmNumber v-model="row.qty" />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="箱数" width="80" align="center">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.boxQty`" class="mb-0px!">
            <SmNumber v-model="row.boxQty" />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="库存公司" width="200" align="center">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.stockCompanyId`" class="mb-0px!">
            <SmSelect
              v-model="row.stockCompanyId"
              placeholder="请选择库存公司"
              :data="financeSubjectList"
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="备注" width="150" align="center">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.remark`" class="mb-0px!">
            <el-input v-model="row.remark" placeholder="请输入备注" />
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
    <el-button @click="handleAdd" round>+ 添加调拨单明细</el-button>
  </el-row>
</template>
<script setup lang="ts">
import { getFinanceSubjectList, getProductList } from '@/commonData'

const productList = getProductList()
const financeSubjectList = getFinanceSubjectList()

const props = defineProps({
  items: {
    // type: Array as PropType<PurchaseInItemVO[]>,
    type: Array,
    default: () => {
      return []
    }
  },
  disabled: {
    type: Boolean,
    default: false
  },
  formType: {
    type: String,
    default: ''
  }
})
const formLoading = ref(false) // 表单的加载中
const formData: any = ref([])
const formRules = reactive({
  productId: [{ required: true, message: '产品编码不能为空', trigger: 'blur' }],
  qty: [{ required: true, message: '数量不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 初始化数据 */
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
    productId: undefined,
    qty: undefined,
    boxQty: undefined,
    stockCompanyId: undefined,
    remark: undefined
  }
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
