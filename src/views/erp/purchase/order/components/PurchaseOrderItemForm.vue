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
    <el-table :data="formData" show-summary :summary-method="getSummaries" class="-mt-10px">
      <el-table-column label="序号" type="index" align="center" width="60" />

      <!-- <el-table-column label="商品编码" min-width="180">
        <template #default="{ row, $index }">
          <el-form-item
            :prop="`${$index}.productCode`"
            :rules="formRules.productCode"
            class="mb-0px!"
          >
            <el-input v-model="row.productCode" />
          </el-form-item>
        </template>
      </el-table-column> -->


      <el-table-column label="产品名称" min-width="180">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.productId`" :rules="formRules.productId" class="mb-0px!">
            <el-select
              v-model="row.productId"
              clearable
              filterable
              @change="onChangeProduct(row.productId, row)"
              placeholder="请选择产品"
            >
              <el-option
                v-for="item in productList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>


      <el-table-column label="含税单价" fixed="right" min-width="120">
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
      <el-table-column label="产品单价" fixed="right" min-width="120">
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
      </el-table-column>
      <el-table-column label="数量" prop="count" fixed="right" min-width="140">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.count`" :rules="formRules.count" class="mb-0px!">
            <el-input-number
              v-model="row.count"
              controls-position="right"
              :min="0.001"
              :precision="3"
              class="!w-100%"
            />
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
      <el-table-column label="条码" min-width="150">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input disabled v-model="row.productBarCode" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="单位" min-width="80">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input disabled v-model="row.productUnitName" />
          </el-form-item>
        </template>
      </el-table-column> -->

      <el-table-column label="税率（%）" fixed="right" min-width="115">
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


      <el-table-column label="备注" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.remark`" class="mb-0px!">
            <el-input v-model="row.remark" placeholder="请输入备注" />
          </el-form-item>
        </template>
      </el-table-column>



      <!-- <el-table-column label="供应商产品" min-width="180">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.supplierProductId`" :rules="formRules.supplierProductId" class="mb-0px!">
            <el-select
              v-model="row.supplierProductId"
              clearable
              filterable
              placeholder="请选择供应商产品"
            >
              <el-option
                v-for="item in supplierProductList"
                :key="item.productId"
                :label="item.supplierName"
                :value="item.productId"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column> -->


      <el-table-column label="采购入库数量" fixed="right" min-width="115">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.inCount`" class="mb-0px!">
            <el-input-number
              v-model="row.inCount"
              controls-position="right"
              :min="0"
              :precision="2"
              class="!w-100%"
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="优惠率" fixed="right" min-width="115">
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


      <el-table-column label="仓库" min-width="180">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.warehouseId`"  class="mb-0px!">
            <el-select
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

      <el-table-column label="交货日期" fixed="right" min-width="115">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.discountPercent`" class="mb-0px!">
            <el-date-picker
              v-model="row.deliveryTime"
              type="date"
              value-format="x"
              placeholder="选择交货日期"
              class="!w-1/1"
            />
          </el-form-item>
        </template>
      </el-table-column>


      <el-table-column label="x码" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.xCode`" class="mb-0px!">
            <el-input v-model="row.xCode" placeholder="请输入x码" />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="箱率" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.containerRate`" class="mb-0px!">
            <el-input v-model="row.containerRate" placeholder="请输入箱率" />
          </el-form-item>
        </template>
      </el-table-column>




      <!-- <el-table-column label="金额" prop="totalProductPrice" fixed="right" min-width="100">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.totalProductPrice`" class="mb-0px!">
            <el-input
              disabled
              v-model="row.totalProductPrice"
              :formatter="erpPriceInputFormatter"
            />
          </el-form-item>
        </template>
      </el-table-column>
 
      <el-table-column label="税额" prop="taxPrice" fixed="right" min-width="120">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.taxPrice`" class="mb-0px!">
            <el-form-item :prop="`${$index}.taxPrice`" class="mb-0px!">
              <el-input disabled v-model="row.taxPrice" :formatter="erpPriceInputFormatter" />
            </el-form-item>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="税额合计" prop="totalPrice" fixed="right" min-width="100">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.totalPrice`" class="mb-0px!">
            <el-input disabled v-model="row.totalPrice" :formatter="erpPriceInputFormatter" />
          </el-form-item>
        </template>
      </el-table-column> -->



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
import { ProductApi, ProductVO } from '@/api/erp/product/product'
import { StockApi } from '@/api/erp/stock/stock'
import { getSupplierProductList, getWarehouseList } from '@/commonData'
import {
  erpCountInputFormatter,
  erpPriceInputFormatter,
  erpPriceMultiply,
  getSumValue
} from '@/utils'

const supplierProductList = getSupplierProductList()
const warehouseList  = getWarehouseList()

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const formLoading = ref(false) // 表单的加载中
const formData = ref<Array<any>>([])
const formRules = reactive({
  productId: [{ required: true, message: '产品不能为空', trigger: 'blur' }],
  count: [{ required: true, message: '产品数量不能为空', trigger: 'blur' }],
  productCode: [{ required: true, message: '商品编码不能为空', trigger: 'blur' }],
  // supplierProductId: [{ required: true, message: '供应商产品不能为空', trigger: 'blur' }], 
})
const formRef = ref([]) // 表单 Ref
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
    // 循环处理
    val.forEach((item) => {
      item.totalProductPrice = erpPriceMultiply(item.productPrice, item.count)
      item.taxPrice = erpPriceMultiply(item.totalProductPrice, item.taxPercent / 100.0)
      if (item.totalProductPrice != null) {
        item.totalPrice = item.totalProductPrice + (item.taxPrice || 0)
      } else {
        item.totalPrice = undefined
      }
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
  // const row = {
  //   id: undefined,
  //   productId: undefined,
  //   productUnitName: undefined, // 产品单位
  //   productBarCode: undefined, // 产品条码
  //   productPrice: undefined,
  //   stockCount: undefined,
  //   count: 1,
  //   totalProductPrice: undefined,
  //   taxPercent: undefined,
  //   taxPrice: undefined,
  //   totalPrice: undefined,
  //   remark: undefined
  // }
  /**
      1-含税单价-actTaxPrice?: number;
      2-产品数量 count: number;
      3-交货日期 deliveryTime?: string;
      4-优惠率，百分比 discountPercent?: number;
      5-订单项编号 id?: number;
      6-采购入库数量 inCount?: number;
      7-产品名称   ItemName?: string;
      8-产品编号 productId: number;
      9-产品单价-productPrice?: number;
      10-产品单位-productUnitId: number;
      11-备注-remark?: string;
      12-供应商产品编号-supplierProductId: string;
      13-增值税税率，百分比-taxPercent?: number;
      14-仓库编号- warehouseId?: string;
      15-x码
      16-箱率
    */
  const row = {
    actTaxPrice: undefined, // 1-含税单价-totalTaxPrice替换成actTaxPrice
    count: 1, // 2-产品数量-存在-必填
    deliveryTime: undefined, // 3-交货日期-需新增
    // discountPercent: undefined, // 4-优惠率，百分比-需新增-放在外面还是总的-不需要
    id: undefined, // 5-订单项编号-存在
    inCount: undefined, // 6-采购入库数量 inCount?: number;-需新增
    // ItemName: undefined, // productName7-产品名称ItemName?: string; 替换ItemName
    productId: undefined, // 8-产品编号
    productPrice: undefined, //  9-产品单价-productPrice?: number;
    productUnitName: undefined, // 10-产品单位 替换成productUnitId: number;-必填
    remark: undefined, // 11-备注-remark?: string;
    // supplierProductId: undefined, // 12-供应商产品编号-supplierProductId: string;-需新增-必填
    taxPercent: undefined, // 13-增值税税率(%)
    warehouseId: undefined, // 14-仓库编号- warehouseId?: string;
    xCode: undefined, // 15-x码
    containerRate: undefined, // 16-箱率


    // productCode: undefined, //暂时认为是商品编码
    // taxPrice: undefined, // 税额
    // productBarCode: undefined, // 产品条码
    // stockCount: undefined,
    // totalProductPrice: undefined,
    // totalPrice: undefined,
  }
  formData.value.push(row)
}

/** 删除按钮操作 */
const handleDelete = (index: number) => {
  formData.value.splice(index, 1)
}

/** 处理产品变更 */
const onChangeProduct = (productId, row) => {
  console.log(productId, 'productId', row)
  const product = productList.value.find((item) => item.id === productId)
  console.log(product, 'product')
  if (product) {
    // row.productUnitName = product.unitName
    // row.productBarCode = product.barCode
    row.productId = product.id
    row.productUnitId = product.unitId
  }
  // 加载库存
  setStockCount(row)
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
