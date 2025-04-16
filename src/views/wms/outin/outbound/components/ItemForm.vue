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
      <!-- outboundId-入库单ID sourceItemId-来源详情ID  -->

      <el-table border :data="formData" class="-mt-10px">
        <el-table-column label="序号" type="index" align="center" width="60" />

        <el-table-column label="产品编码" width="180">
          <template #default="{ row, $index }">
            <el-form-item
              :prop="`${$index}.productId`"
              :rules="formRules.productId"
              class="mb-0px!"
            >
              <el-text>{{ row.productBarCode }}</el-text>
            </el-form-item>
          </template>
        </el-table-column>

        <!-- 计划出库量 -->
        <el-table-column label="数量" width="120">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.planQty`" class="mb-0px!">
              <el-input-number
                v-model="row.planQty"
                controls-position="right"
                :min="0"
                class="!w-100%"
              />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="库位" width="120">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.binName`" class="mb-0px!">
              <el-text>{{ row.binName }}</el-text>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="备注" width="120">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.remark`" class="mb-0px!">
              <el-input
                :disabled="disabled"
                v-model="row.remark"
                placeholder="请输入备注"
                type="textarea"
              />
            </el-form-item>
          </template>
        </el-table-column>

        <!-- <el-table-column label="实际出库量" width="120">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.actualQty`" class="mb-0px!">
              <el-input-number
                v-model="row.actualQty"
                controls-position="right"
                :min="1"
                class="!w-100%"
              />
            </el-form-item>
          </template>
        </el-table-column> -->

        <el-table-column align="center" fixed="right" label="操作" width="60">
          <template #default="{ $index }">
            <el-button @click="handleDelete($index)" link> — </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
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
// import { WarehouseApi, WarehouseVO } from '@/api/erp/stock/warehouse'
import { getDeptTree, getProductList, getUserList, getWarehouseList } from '@/commonData'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
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

const formLoading = ref(false) // 表单的加载中
const formData: any = ref([])
const formRules = reactive({
  productId: [{ required: true, message: '产品编码不能为空', trigger: 'blur' }],
  planQty: [{ required: true, message: '数量不能为空', trigger: 'blur' }]
})
const formRef = ref([]) // 表单 Ref
const productList = getProductList() // 产品列表
const warehouseList = getWarehouseList()

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

/** 处理产品变更 */
const onChangeProduct = (productId, row) => {
  const product = productList.value.find((item) => item.id === productId)
  if (product) {
    row.productName = product.name
    row.productUnitName = product.unitName
    row.productUnitId = product.unitId
    row.model = product.model
    // row.productPrice = row.price 含税单价和税率计算得出
  }
  // 加载库存
  // setStockCount(row)
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
