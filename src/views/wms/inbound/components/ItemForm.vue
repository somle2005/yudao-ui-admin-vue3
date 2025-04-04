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
      <!-- show-summary :summary-method="getSummaries" -->
      <!-- sourceItemId-来源详情ID  -->

      <el-table :data="formData" class="-mt-10px">
        <el-table-column label="序号" type="index" align="center" width="60" />

        <el-table-column label="SKU" width="180">
          <template #default="{ row, $index }">
            <el-form-item
              :prop="`${$index}.productId`"
              :rules="formRules.productId"
              class="mb-0px!"
              :disabled="disabled"
            >
              <SmSelect
                :disabled="disabled"
                v-model="row.productId"
                placeholder="请选择SKU"
                @change="
                  (val) =>
                    updateModelValue(val, row, productList, 'id', {
                      productName: 'name',
                      barCode: 'barCode',
                      productUnitName: 'unitName',
                      productUnitId: 'unitId'
                    })
                "
                :data="productList"
                :keyMap="{ label: 'barCode', value: 'id' }"
              />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="计划入库量" width="120">
          <template #default="{ row, $index }">
            <el-form-item
              :prop="`${$index}.planQuantity`"
              :rules="formRules.planQuantity"
              class="mb-0px!"
            >
              <el-input-number
                v-model="row.planQuantity"
                controls-position="right"
                :min="0"
                class="!w-100%"
              />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column v-if="updateShow" label="实际入库量" width="120">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.actualQuantity`" class="mb-0px!">
              <el-input-number
                v-model="row.actualQuantity"
                controls-position="right"
                :min="0"
                class="!w-100%"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column v-if="updateShow" label="批次剩余库存" width="120">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.leftQuantity`" class="mb-0px!">
              <el-text>{{ row.leftQuantity }}</el-text>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column align="center" fixed="right" label="操作" width="60">
          <template #default="{ $index }">
            <el-button :disabled="formData.length === 1" @click="handleDelete($index)" link>
              —
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <el-row justify="center" class="mt-3" v-if="!disabled">
      <el-button @click="handleAdd" round>+ 添加采购产品</el-button>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import { StockApi } from '@/api/erp/stock/stock'
import {
  erpCountInputFormatter,
  erpPriceInputFormatter,
  erpPriceMultiply,
  getSumValue
} from '@/utils'
import { getProductList } from '@/commonData'
import { updateModelValue } from '@/utils/high/index'

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

const updateShow = computed(() => props.formType === 'update')

const formLoading = ref(false) // 表单的加载中
const formData: any = ref([])
const formRules = reactive({
  productId: [{ required: true, message: 'SKU不能为空', trigger: 'blur' }],
  planQuantity: [{ required: true, message: '计划入库量不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref
const productList = getProductList() // 产品列表

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

/** 新增按钮操作 */
const handleAdd = () => {
  const row = {
    // id: undefined,
    // inboundId: undefined,
    productId: undefined,
    planQuantity: undefined,
    actualQuantity: undefined
    // leftQuantity: undefined,
    // sourceItemId:undefined,
  }
  formData.value.push(row)
}

/** 删除按钮操作 */
const handleDelete = (index: number) => {
  formData.value.splice(index, 1)
}

/** 加载库存 */
const setStockCount = async (row: any) => {
  if (!row.productId) {
    return
  }
  const qty = await StockApi.getStockCount(row.productId)
  row.stockCount = qty || 0
}

/** 表单校验 */
const validate = () => {
  return formRef.value.validate()
}
defineExpose({ validate, formData })

/** 初始化 */
onMounted(() => {
  // 默认添加一个
  if (formData.value.length === 0) {
    handleAdd()
  }
})
</script>
