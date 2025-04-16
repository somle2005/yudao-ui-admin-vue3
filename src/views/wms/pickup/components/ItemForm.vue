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
      <!-- inboundId-inboundItemId-binId  -->

      <el-table border :data="formData" class="-mt-10px">
        <el-table-column label="序号" type="index" align="center" width="60" />

        <el-table-column label="产品编码" width="180">
          <template #default="{ row, $index }">
            <el-form-item
              :prop="`${$index}.productId`"
              :rules="formRules.productId"
              class="mb-0px!"
              :disabled="disabled"
            >
              <el-text>{{ row.productBarCode }}</el-text>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="库位" width="180">
          <template #default="{ row, $index }">
            <el-form-item
              :prop="`${$index}.binId`"
              :rules="formRules.binId"
              class="mb-0px!"
              :disabled="disabled"
            >
              <SmSelect v-model="row.binId" placeholder="请选择库位" :data="warehouseBinList" />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="拣货数量" width="120">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.qty`" :rules="formRules.qty" class="mb-0px!">
              <el-input-number
                v-model="row.qty"
                controls-position="right"
                :min="0"
                class="!w-100%"
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
    </el-form>
    <!-- <el-row justify="center" class="mt-3" v-if="!disabled">
      <el-button @click="handleAdd" round>+ 添加采购产品</el-button>
    </el-row> -->
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
import { getWarehouseBinList } from '@/commonData/wms'

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
  warehouseId: {
    type: Number,
    default: null
  }
})

const updateShow = computed(() => props.formType === 'update')

const formLoading = ref(false) // 表单的加载中
const formData: any = ref([])
const formRules = reactive({
  productId: [{ required: true, message: '产品编码不能为空', trigger: 'blur' }],
  binId: [{ required: true, message: '库位不能为空', trigger: 'blur' }],
  qty: [{ required: true, message: '拣货数量不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref
const warehouseBinList: any = ref([])
getWarehouseBinList(warehouseBinList, {})

watch(
  () => props.warehouseId,
  (val) => {
    // getWarehouseBinList(warehouseBinList, { warehouseId: val })
  }
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

/** 新增按钮操作 */
const handleAdd = () => {
  const row = {
    // id: undefined,
    // pickupId: undefined,
    productId: undefined,
    inboundId: undefined,
    inboundItemId: undefined,
    binId: undefined,
    qty: undefined
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
</script>
