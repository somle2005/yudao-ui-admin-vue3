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
      <el-table :data="formData" class="-mt-10px">
        <el-table-column label="序号" type="index" align="center" width="60" />
        <el-table-column v-if="formType !== 'create'" label="编号" min-width="120">
          <template #default="{ row }">
            <el-text>{{ row.id }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="产品编码" width="180">
          <template #default="{ row, $index }">
            <el-form-item
              :prop="`${$index}.productId`"
              :rules="formRules.productId"
              class="mb-0px!"
            >
              <el-text> {{ row.barCode }}</el-text>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="产品名称" width="180">
          <template #default="{ row }">
            <el-text>{{ row.productName }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="海关品名" width="180">
          <template #default="{ row }">
            <el-text>{{ row.declaredType }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="单位" min-width="60">
          <template #default="{ row }">
            <el-text>{{ row.productUnitName }}</el-text>
          </template>
        </el-table-column>

        <el-table-column label="入库项id" width="200">
          <template #default="{ row }">
            <el-text>{{ row.inItemId }}</el-text>
          </template>
        </el-table-column>
        <!-- 
        <el-table-column label="采购订单编号" width="200">
          <template #default="{ row }">
            <el-text>{{ row.orderNo }}</el-text>
          </template>
        </el-table-column> -->

        <el-table-column label="申请人" width="200">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.applicantId`" class="mb-0px!">
              <el-text>{{ row.applicantName }}</el-text>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="部门" width="200">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.applicationDeptId`" class="mb-0px!">
              <el-text>{{ row.applicationDeptName }}</el-text>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="币种" prop="currencyId" width="120">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.currencyId`" class="mb-0px!">
              <el-form-item
                :prop="`${$index}.currencyId`"
                :rules="formRules.currencyId"
                class="mb-0px!"
              >
                <el-select
                  disabled
                  v-model="row.currencyId"
                  placeholder="请选择币种"
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
              <el-text>{{ row.warehouseName }}</el-text>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="数量" width="120">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.qty`" class="mb-0px!">
              <el-input-number
                v-model="row.qty"
                controls-position="right"
                :min="1"
                :max="row.originCount"
                class="!w-100%"
                @change="(val) => changeValLimit(row, 'qty', 1, val)"
              />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="含税单价" width="120">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.actTaxPrice`" class="mb-0px!">
              <el-input-number
                disabled
                v-model="row.actTaxPrice"
                controls-position="right"
                :min="0.01"
                :precision="2"
                class="!w-100%"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="单价" width="200">
          <template #default="{ row }">
            <el-input disabled v-model="row.productPrice" :formatter="erpPriceInputFormatter" />
          </template>
        </el-table-column>

        <el-table-column label="税率%" width="115">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.taxPercent`" class="mb-0px!">
              <el-input-number
                disabled
                v-model="row.taxPercent"
                controls-position="right"
                :min="0"
                :precision="2"
                class="!w-100%"
              />
            </el-form-item>
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

        <el-table-column label="箱率" width="120">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.containerRate`" class="mb-0px!">
              <el-input disabled v-model.trim="row.containerRate" class="!w-100%" />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="备注" min-width="150">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.remark`" class="mb-0px!">
              <el-input v-model.trim="row.remark" type="textarea" placeholder="请输入备注" />
            </el-form-item>
          </template>
        </el-table-column>

        <!-- allAmount价税合计-orderItemId 采购订单项id  不展示传参带过去 -->

        <el-table-column align="center" fixed="right" label="操作" width="60">
          <template #default="{ $index }">
            <el-button :disabled="formData.length === 1" @click="handleDelete($index)" link>
              —
            </el-button>
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
// import { WarehouseApi, WarehouseVO } from '@/api/erp/stock/warehouse'
import { getDeptTree, getProductList, getUserList, getWarehouseList } from '@/commonData'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { computeTaxPriceAndAllAmount } from '@/utils/transformData'
import { TAX_PERCENT } from '@/utils/constant'
import { changeValLimit } from '@/utils/high/index'

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
  // warehouseId: [{ required: true, message: '仓库不能为空', trigger: 'blur' }],
  productId: [{ required: true, message: '产品编码不能为空', trigger: 'blur' }],
  qty: [{ required: true, message: '数量不能为空', trigger: 'blur' }],
  actTaxPrice: [{ required: true, message: '含税单价不能为空', trigger: 'blur' }],
  currencyId: [{ required: true, message: '币种不能为空', trigger: 'blur' }]
})
const formRef = ref([]) // 表单 Ref
// const defaultWarehouse = ref<WarehouseVO>(undefined) // 默认仓库
const productList = getProductList() // 产品列表
const warehouseList = getWarehouseList()
// const { deptList, defaultProps } = getDeptTree()
// const userList = getUserList()

/** 初始化设置入库项 */
watch(
  () => props.items,
  async (val) => {
    // val.forEach((item) => {
    //   if (item.warehouseId == null) {
    //     item.warehouseId = defaultWarehouse.value?.id
    //   }
    //   if (item.stockCount === null && item.warehouseId != null) {
    //     setStockCount(item)
    //   }
    // })
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
      taxPrice: 'taxPrice',
      taxPercent: 'taxPercent',
      allAmount: 'allAmount',
      actTaxPrice: 'actTaxPrice',
      onePrice: 'productPrice',
      applyCount: 'qty'
    }

    // 编辑回显
    computeTaxPriceAndAllAmount(val, keyMap)
    // 循环处理
    // val.forEach((item) => {
    //   item.totalProductPrice = erpPriceMultiply(item.productPrice, item.qty)
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
    orderNo: undefined,
    orderItemId: undefined, //list记得转化
    productId: undefined,
    productName: undefined,
    productBarCode: undefined,
    productUnitName: undefined, //列表要转化取item-product里面数据
    productUnitId: undefined, // 列表要转化取item-product里面数据
    model: undefined, // //列表要转化取item-product里面数据

    productPrice: undefined,
    qty: undefined,
    taxPercent: TAX_PERCENT,
    taxPrice: undefined,
    actTaxPrice: undefined,
    allAmount: undefined,
    remark: undefined,
    settlementDate: undefined,
    containerRate: undefined,

    warehouseId: undefined,
    expectArrivalDate: undefined,

    currencyId: undefined,
    applicantId: undefined,
    applicantName: undefined,
    applicationDeptId: undefined,
    applicationDeptName: undefined
    // productPrice: actTaxPrice
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

/** 初始化 */
onMounted(async () => {
  // warehouseList.value = await WarehouseApi.getWarehouseSimpleList()
  // defaultWarehouse.value = warehouseList.value.find((item) => item.defaultStatus)
})
</script>
