<template>
  <div style="display: contents">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      v-loading="formLoading"
      label-width="0px"
      :inline-message="true"
      :disabled="disabled"
    >
      <el-table border :data="formData" class="-mt-10px">
        <el-table-column label="序号" type="index" width="60" align="center" />

        <el-table-column label="币种" prop="currencyType" width="120">
          <template #default="{ row, $index }">
            <el-form-item
              :prop="`${$index}.currencyType`"
              :rules="formRules.currencyType"
              class="mb-0px!"
            >
              <SmSelect
                v-model="row.currencyType"
                placeholder="请选择币种"
                :data="getIntDictOptions(DICT_TYPE.CURRENCY_CODE)"
              />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="费用类型" width="100" align="center">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.costType`" :rules="formRules.costType" class="mb-0px!">
              <SmSelect
                v-model="row.costType"
                placeholder="请选择库存公司"
                :data="getIntDictOptions(DICT_TYPE.TMS_FEE_TYPE)"
              />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="金额" width="100" align="center">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.amount`" :rules="formRules.amount" class="mb-0px!">
              <SmNumber v-model="row.amount" />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="备注" width="150" align="center">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.remark`" class="mb-0px!">
              <el-input
                v-model.trim="row.remark"
                :disabled="disabled"
                type="textarea"
                placeholder="请输入备注"
              />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column v-if="!disabled" align="center" fixed="right" label="操作" width="60">
          <template #default="{ $index }">
            <el-button @click="handleDelete($index)" link> — </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-row justify="center">
        <el-button @click="handleAdd" round>+ 添加</el-button>
      </el-row>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import {
  erpCountInputFormatter,
  erpPriceInputFormatter,
  erpPriceMultiply,
  getSumValue
} from '@/utils'
import { cloneDeep } from 'lodash-es'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'

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
  },
  itemIdKey: {
    type: String,
    default: null
  }
})

const updateShow = computed(() => props.formType === 'update')

/**
 * 头程单新增 有上游单据号的  也就是说从申请单过来的不可编辑  智能系统赋值 无上游单据号非合并过来 可以编辑
 * 头程申请单合并 选中项无法修改
 * 新加项可以修改
 */

const getStoreDisabled = (item) => {
  if (item.upstreamCode) {
    return true
  }
  if (props.formType === 'merge' && item.id) {
    return true
  }
}

const formLoading = ref(false) // 表单的加载中
const formData: any = ref([])
const formRules = reactive({
  costType: [{ required: true, message: '费用类型不能为空', trigger: 'blur' }],
  amount: [{ required: true, message: '金额不能为空', trigger: 'blur' }],
  currencyType: [{ required: true, message: '币种不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

watch(
  () => props.itemIdKey,
  (val) => {}
)

/** 初始化设置入库项 */
watch(
  () => props.items,
  async (val) => {
    formData.value = val
  },
  { immediate: true, deep: true }
)

/** 监听合同产品变化，计算合同产品总价 */
watch(
  () => formData.value,
  (val) => {
    if (!val || val.length === 0) {
      return
    }
  },
  { deep: true }
)

/** 合计 */
const getSummaries = (param: SummaryMethodProps) => {
  const { columns, data } = param
  const sums: string[] = []
  columns.forEach((column, index: number) => {
    if (index === 0) {
      sums[index] = '合计'
      return
    }
    if (['qty', 'totalProductPrice', 'taxPrice', 'totalPrice'].includes(column.property)) {
      const sum = getSumValue(data.map((item) => Number(item[column.property])))
      sums[index] =
        column.property === 'qty' ? erpCountInputFormatter(sum) : erpPriceInputFormatter(sum)
    } else {
      sums[index] = ''
    }
  })

  return sums
}

/** 删除按钮操作 */
const handleDelete = (index: number) => {
  formData.value.splice(index, 1)
}

/** 添加按钮操作 */
const handleAddItem = (index: number) => {
  const row = cloneDeep(formData.value[index])
  // row[props.itemIdKey] = Math.random() + formData.value.length
  formData.value.splice(index, 0, row)
}

/** 新增按钮操作 */
const handleAdd = () => {
  const row = {
    id: undefined
  }
  formData.value.push(row)
}

/** 初始化 */
onMounted(async () => {
  // 默认添加一个
  if (formData.value.length === 0) {
    handleAdd()
  }
})

/** 表单校验 */
const validate = () => {
  return formRef.value.validate()
}
defineExpose({ validate, formData })
</script>

<style lang="scss" scoped>
.btnList {
  display: flex;
  // flex-direction: column;
  align-items: center;
  justify-content: center;
}
.btn-item {
  cursor: pointer;
}
</style>
