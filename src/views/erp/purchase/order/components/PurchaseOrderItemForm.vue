<template>
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
    <el-table :data="formData" class="-mt-10px">
      <el-table-column label="序号" type="index" align="center" width="60" />
      <el-table-column label="产品编号" width="180">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.productId`" :rules="formRules.productId" class="mb-0px!">
            <el-select
              v-model="row.productId"
              clearable
              filterable
              @change="onChangeProduct($event, row)"
              placeholder="请选择产品编号"
              :disabled="disabled"
            >
              <el-option
                v-for="item in productList"
                :key="item.id"
                :label="item.barCode"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="产品名称" width="120">
        <template #default="{ row }">
          <el-text>{{ row.productName }}</el-text>
        </template>
      </el-table-column>

      <el-table-column label="申请单编号" width="200">
        <template #default="{ row }">
          <el-text>{{ row.erpPurchaseRequestItemNo }}</el-text>
        </template>
      </el-table-column>

      <el-table-column label="货币" prop="currencyId" width="120">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.currencyId`" class="mb-0px!">
            <el-form-item :prop="`${$index}.currencyId`" class="mb-0px!">
              <el-select
                v-model="row.currencyId"
                placeholder="请选择货币"
                clearable
                filterable
                style="width: 100px"
              >
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.CURRENCY_CODE)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="仓库" width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.warehouseId`" class="mb-0px!">
            <el-select
              :disabled="disabled"
              v-model="row.warehouseId"
              clearable
              filterable
              placeholder="请选择仓库"
            >
              <el-option
                v-for="item in warehouseList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="采购入库数量" width="120">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.inCount`" class="mb-0px!">
            <el-input-number
              v-model="row.inCount"
              controls-position="right"
              :min="1"
              class="!w-100%"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="申请数量" width="120">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.applyCount`" class="mb-0px!">
            <el-input-number
              v-model="row.applyCount"
              controls-position="right"
              :min="1"
              class="!w-100%"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="含税单价" width="120">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.actTaxPrice`" class="mb-0px!">
            <el-input-number
              v-model="row.actTaxPrice"
              controls-position="right"
              :min="0.01"
              :precision="2"
              class="!w-100%"
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="税率%" width="115">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.taxPercent`" class="mb-0px!">
            <el-input-number
              v-model="row.taxPercent"
              controls-position="right"
              :min="0"
              :precision="2"
              class="!w-100%"
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="产品单价" width="200">
        <template #default="{ row }">
          <el-input disabled v-model="row.productPrice" :formatter="erpPriceInputFormatter" />
          <!-- <el-text>{{ row.productPrice }}</el-text> -->
        </template>
      </el-table-column>

      <el-table-column label="税额" prop="taxPrice" width="120">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.taxPrice`" class="mb-0px!">
            <el-form-item :prop="`${$index}.taxPrice`" class="mb-0px!">
              <el-input disabled v-model="row.taxPrice" :formatter="erpPriceInputFormatter" />
            </el-form-item>
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="优惠率%" width="120">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.discountPercent`" class="mb-0px!">
            <el-input-number
              v-model="row.discountPercent"
              controls-position="right"
              :min="0"
              :precision="2"
              class="!w-100%"
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="交货日期" width="180">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.deliveryTime`" class="mb-0px!">
            <el-date-picker
              v-model="row.deliveryTime"
              type="date"
              value-format="x"
              placeholder="选择交货日期"
              class="!w-100%"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="X码" width="120">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.xCode`" class="mb-0px!">
            <el-input v-model="row.xCode" class="!w-100%" />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="箱率" width="120">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.containerRate`" class="mb-0px!">
            <el-input v-model="row.containerRate" class="!w-100%" />
          </el-form-item>
        </template>
      </el-table-column>

      <!-- erpPurchaseRequestItemId 采购申请单，申请项编号 -->

      <!-- 
      <el-table-column label="税额合计" prop="totalPrice" min-width="100">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.totalPrice`" class="mb-0px!">
            <el-input disabled v-model="row.totalPrice" :formatter="erpPriceInputFormatter" />
          </el-form-item>
        </template>
      </el-table-column> -->

      <el-table-column label="商品行备注" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.remark`" class="mb-0px!">
            <el-input v-model="row.remark" type="textarea" placeholder="商品行备注" />
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
  <el-row justify="center" class="mt-3" v-if="!disabled">
    <el-button @click="handleAdd" round>+ 添加采购产品</el-button>
  </el-row>
</template>
<script setup lang="ts">
import { StockApi } from '@/api/erp/stock/stock'
import { getProductList, getWarehouseList } from '@/commonData'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import {
  erpCountInputFormatter,
  erpPriceInputFormatter,
  erpPriceMultiply,
  getSumValue
} from '@/utils'
import { cloneDeep } from 'lodash-es'
import { computeTaxPriceAndAllAmount } from '@/utils/transformData'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
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
  productId: [{ required: true, message: '产品不能为空', trigger: 'blur' }],
  // productPrice: [{ required: true, message: '产品单价不能为空', trigger: 'blur' }],
  actTaxPrice: [{ required: true, message: '含税单价不能为空', trigger: 'blur' }],
  count: [{ required: true, message: '产品数量不能为空', trigger: 'blur' }]
})
const formRef = ref([]) // 表单 Ref
const productList = getProductList() // 产品列表
const warehouseList = getWarehouseList()



/** 初始化设置入库项 */
watch(
  () => props.items,
  async (val) => {
    // formData.value = cloneDeep(val)
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
    const keyMap = {
      // allAmount: 'allAmount',
      // taxPrice: 'taxPrice',
      // taxPercent: 'taxPercent',
      // actTaxPrice: 'actTaxPrice',
      applyCount: 'applyCount'
    }

    computeTaxPriceAndAllAmount(val, keyMap)

    // // 循环处理
    // val.forEach((item) => {
    //   item.totalProductPrice = erpPriceMultiply(item.productPrice, item.count)
    //   item.taxPrice = erpPriceMultiply(item.totalProductPrice, item.taxPercent / 100.0)
    //   if (item.totalProductPrice != null) {
    //     item.totalPrice = item.totalProductPrice + (item.taxPrice || 0)
    //   } else {
    //     item.totalPrice = undefined
    //   }
    // })
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
    if (['count', 'totalProductPrice', 'taxPrice', 'totalPrice'].includes(column.property)) {
      const sum = getSumValue(data.map((item) => Number(item[column.property])))
      sums[index] =
        column.property === 'count' ? erpCountInputFormatter(sum) : erpPriceInputFormatter(sum)
    } else {
      sums[index] = ''
    }
  })

  return sums
}

/** 新增按钮操作 */
const handleAdd = () => {
  const row = {
    id: undefined,
    productId: undefined,
    productPrice: undefined,
    taxPercent: undefined,
    taxPrice: undefined,
    currencyId: undefined,
    actTaxPrice: undefined,
    applyCount: undefined,
    remark: undefined,
    inCount: undefined,
    discountPercent: undefined,
    warehouseId: undefined,
    deliveryTime: undefined,
    xCode: undefined,
    containerRate: undefined,
    erpPurchaseRequestItemId: undefined,
    erpPurchaseRequestItemNo: undefined
  }
  formData.value.push(row)
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
  }
  // 加载库存
  // setStockCount(row)
}

/** 加载库存 */
const setStockCount = async (row: any) => {
  if (!row.productId) {
    return
  }
  const count = await StockApi.getStockCount(row.productId)
  row.stockCount = count || 0
}

/** 表单校验 */
const validate = () => {
  return formRef.value.validate()
}
defineExpose({ validate,formData })

/** 初始化 */
onMounted(async () => {
  // 默认添加一个
  if (formData.value.length === 0) {
    handleAdd()
  }
})
</script>
