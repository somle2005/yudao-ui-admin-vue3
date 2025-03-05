<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    v-loading="formLoading"
    label-width="0px"
    :inline-message="true"
  >
    <!-- <el-table :data="formData" show-summary :summary-method="getSummaries" class="-mt-10px"> -->
    <el-table :data="formData" class="-mt-10px">
      <el-table-column label="序号" type="index" align="center" width="100" />
      <el-table-column label="产品编号" min-width="180">
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

      <el-table-column label="产品名称" min-width="180">
        <template #default="{ row }">
          <el-text>{{ row.productName }}</el-text>
        </template>
      </el-table-column>

      <el-table-column label="仓库" min-width="125">
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

      <!-- <el-table-column label="库存" min-width="100">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input disabled v-model="row.stockCount" :formatter="erpCountInputFormatter" />
          </el-form-item>
        </template>
      </el-table-column>
    -->

      <el-table-column v-if="mergeDisabled" label="下单数量" prop="orderQuantity" min-width="140">
        <template #default="{ row, $index }">
          <el-form-item
            :prop="`${$index}.orderQuantity`"
            :rules="formRules.orderQuantity"
            class="mb-0px!"
          >
            <el-input-number
              v-model="row.orderQuantity"
              controls-position="right"
              :min="0"
              :max="row.approveCount"
              class="!w-100%"
              @change="(val) => changeValLimit(row, 'orderQuantity', 0, val)"
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="申请数量" prop="count" min-width="140">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.count`" :rules="formRules.count" class="mb-0px!">
            <!-- @change="(val) => (row.approveCount = val)" -->
            <el-input-number
              :disabled="disabled"
              v-model="row.count"
              controls-position="right"
              :min="1"
              class="!w-100%"
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column v-if="showAudit" label="批准数量" prop="approveCount" min-width="140">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.approveCount`" class="mb-0px!">
            <el-input-number
              :disabled="mergeDisabled"
              v-model="row.approveCount"
              controls-position="right"
              :min="1"
              :max="row.count"
              class="!w-100%"
              @change="(val) => changeValLimit(row, 'approveCount', 1, val)"
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="含税单价" prop="actTaxPrice" min-width="140">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.actTaxPrice`" class="mb-0px!">
            <el-input-number
              :disabled="disabled"
              v-model="row.actTaxPrice"
              controls-position="right"
              :min="0.01"
              :precision="2"
              class="!w-100%"
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="参考单价" prop="referenceUnitPrice" min-width="140">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.referenceUnitPrice`" class="mb-0px!">
            <el-input-number
              :disabled="disabled"
              v-model="row.referenceUnitPrice"
              controls-position="right"
              :min="0.01"
              :precision="2"
              class="!w-100%"
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="税率%" prop="taxPercent" min-width="140">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.taxPercent`" class="mb-0px!">
            <el-input-number
              :disabled="disabled"
              v-model="row.taxPercent"
              controls-position="right"
              :min="0"
              :precision="2"
              class="!w-100%"
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="税额" prop="taxPrice" min-width="140">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.taxPrice`" class="mb-0px!">
            {{ row.taxPrice }}
          </el-form-item>
        </template>
      </el-table-column>

      <!-- <el-table-column label="产品单价" fixed="right" min-width="120">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.productPrice`" class="mb-0px!">
            <el-input-number
              v-model="row.productPrice"
              controls-position="right"
              :min="0.01"
              :precision="2"
              class="!w-100%"
            />
          </el-form-item>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="备注" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.remark`" class="mb-0px!">
            <el-input v-model="row.remark" placeholder="请输入备注" />
          </el-form-item>
        </template>
      </el-table-column> -->
      <el-table-column v-if="!disabled" align="center" fixed="right" label="操作" width="60">
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
import { ProductApi, ProductVO } from '@/api/erp/product/product'
import { StockApi } from '@/api/erp/stock/stock'
import { getWarehouseList } from '@/commonData'
import {
  erpCountInputFormatter,
  erpPriceInputFormatter,
  erpPriceMultiply,
  getSumValue
} from '@/utils'
import { changeValLimit } from '@/utils/high/index'

/**
    items-商品信息-表格列(参照-采购订单-订单产品清单)

    商品id-productId-下拉框
    申请数量-count-数字输入框(整数>0)
    仓库编号-warehouseId-下拉框 (数据来源-仓库精简列表接口)
    批准数量-approveCount-数字输入框(整数>0)
    含税单价-actTaxPrice-数字输入框(手动输入，价格保留小数点后两位。)
    价税合计-allAmount-(显示在底部合计行-与含税单价联动，通过计算保持一致)
    参考单价-referenceUnitPrice-数字输入框(整数>0)
    税额，单位：元-taxPrice-(纯显示-保留小数点后两位   = 含税单价*税率   )
    税率，百分比-taxPercent-数字输入框(手动输入，保留小数点后两位。)


    税额的计算


    单价 * (1+税率) = 含税单价
    单价 = 含税单价/ (1+税率)
    税额 = 单价 * 税率
    税额 = 含税单价 * (税率/(1+税率))

    产品带出 产品编码sku-barCode-change事件赋予值联动即可
 */

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  // disabled: {
  //   type: Boolean,
  //   default: false
  // },
  formType: {
    type: String,
    default: ''
  }
})

const disabled = computed(() => props.formType === 'audit' || props.formType === 'merge')
// 批准数量在merge下要禁用
const mergeDisabled = computed(() => props.formType === 'merge')
const showAudit = computed(() => props.formType === 'audit' || props.formType === 'merge')

const formLoading = ref(false) // 表单的加载中
const formData = ref<Array<any>>([])
const formRules = reactive({
  productId: [{ required: true, message: '产品不能为空', trigger: 'blur' }],
  count: [{ required: true, message: '申请数量不能为空', trigger: 'blur' }],
  orderQuantity: [{ required: true, message: '下单数量不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref
const productList = ref<ProductVO[]>([]) // 产品列表

/** 初始化设置入库项 */
watch(
  () => props.items,
  async (val) => {
    formData.value = val
  },
  { immediate: true }
)

/** 监听合同产品变化，计算合同产品总价 */
watch(
  () => formData.value,
  (val) => {
    if (!val || val.length === 0) {
      return
    }

    /**
     * 税额的计算
      单价 * (1+税率) = 含税单价
      单价 = 含税单价/ (1+税率)
      税额 = 单价 * 税率
      税额 = 含税单价 * (税率/(1+税率))

    税额，单位：元-taxPrice-(纯显示-保留小数点后两位   = 含税单价*税率   )
    税率，百分比-taxPercent-数字输入框(手动输入，保留小数点后两位。)
     */

    // 循环处理
    val.forEach((item) => {
      // 申请数量和税率都要有 才能计算出税额
      if (item.taxPercent && item.count && item.actTaxPrice) {
        const taxPercent100 = item.taxPercent / 100.0
        // 税额 = 含税单价 * (税率/(1+税率)) * 申请数量
        const scale = (taxPercent100 / (1 + taxPercent100)) * item.count
        item.taxPrice = erpPriceMultiply(item.actTaxPrice, scale)
        // 价税合计 = 含税单价 * 申请数量。
        item.allAmount = erpPriceMultiply(item.actTaxPrice, item.count)
      }

      // item.totalProductPrice = erpPriceMultiply(item.productPrice, item.count)
      // item.taxPrice = erpPriceMultiply(item.totalProductPrice, item.taxPercent / 100.0)
      // if (item.totalProductPrice != null) {
      //   item.totalPrice = item.totalProductPrice + (item.taxPrice || 0)
      // } else {
      //   item.totalPrice = undefined
      // }
    })
  },
  { deep: true }
)

/** 合计 */
const getSummaries = (param: SummaryMethodProps) => {
  const { columns, data } = param
  const sums: string[] = []
  columns.forEach((column, index: number) => {
    if (index === 0) {
      sums[index] = '价税合计'
      return
    }
    if (['count', 'totalProductPrice', 'taxPrice', 'totalPrice'].includes(column.property)) {
      // const sum = getSumValue(data.map((item) => Number(item[column.property])))
      // sums[index] =
      //   column.property === 'count' ? erpCountInputFormatter(sum) : erpPriceInputFormatter(sum)
    } else {
      sums[index] = ''
    }
  })

  return sums
}

/** 新增按钮操作 */
const handleAdd = () => {
  // 商品id-productId-下拉框
  // 申请数量-count-数字输入框(整数>0)
  // 仓库编号-warehouseId-下拉框 (数据来源-仓库精简列表接口)
  // 批准数量-approveCount-数字输入框(整数>0)
  // 含税单价-actTaxPrice-数字输入框(手动输入，价格保留小数点后两位。)
  // 价税合计-allAmount-(显示在底部合计行-与含税单价联动，通过计算保持一致)
  // 参考单价-referenceUnitPrice-数字输入框(整数>0)
  // 税额，单位：元-taxPrice-(纯显示-保留小数点后两位   = 含税单价*税率   )
  // 税率，百分比-taxPercent-数字输入框(手动输入，保留小数点后两位。)

  // 增值税税率	从供应商中带出来，也可以自行输入

  const row = {
    id: undefined,
    productId: undefined,
    count: undefined, // 申请数量
    approveCount: undefined, // 批准数量
    warehouseId: undefined,
    actTaxPrice: undefined,
    referenceUnitPrice: undefined,
    taxPrice: undefined,
    taxPercent: undefined,
    allAmount: undefined,
    orderQuantity: undefined // 下单数量
    // remark: '',
  }
  formData.value.push(row)
}

/** 删除按钮操作 */
const handleDelete = (index: number) => {
  formData.value.splice(index, 1)
}

/** 处理产品变更 */
const onChangeProduct = (productId, row) => {
  const product:any = productList.value.find((item) => item.id === productId)
  console.log(product,'选中的产品')
  if (product) {
    row.productName = product.name
    // row.productUnitName = product.unitName
    // row.productBarCode = product.barCode
    // row.productPrice = product.purchasePrice
  }
  // // 加载库存
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

const warehouseList = getWarehouseList()

defineExpose({ validate })

/** 初始化 */
onMounted(async () => {
  productList.value = await ProductApi.getProductSimpleList()
  // 默认添加一个
  if (formData.value.length === 0) {
    handleAdd()
  }
})
</script>
