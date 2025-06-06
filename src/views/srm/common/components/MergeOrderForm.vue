<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    v-loading="formLoading"
    label-width="0px"
    :inline-message="true"
    :disabled="allDisabled"
  >
    <!-- <el-table :data="formData" show-summary :summary-method="getSummaries" class="-mt-10px"> -->
    <el-table border :data="formData" class="-mt-10px">
      <el-table-column label="序号" type="index" align="center" width="100" />
      <el-table-column v-if="formType !== 'create'" label="编号" min-width="120">
        <template #default="{ row }">
          <el-text>{{ row.id }}</el-text>
        </template>
      </el-table-column>

      <el-table-column label="产品编码" width="180">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.productId`" :rules="formRules.productId" class="mb-0px!">
            <SmSelect
              :disabled="productDisabled"
              v-model="row.productId"
              placeholder="请选择产品编码"
              @change="
                (val) =>
                  updateModelValue(
                    val,
                    row,
                    productList,
                    'id',
                    {
                      productName: 'name',
                      barCode: 'barCode',
                      productUnitName: 'unitName'
                    },
                    getDeclaredType
                  )
              "
              :data="productList"
              :keyMap="{ label: 'barCode', value: 'id' }"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="产品名称" min-width="120">
        <template #default="{ row }">
          <el-text>{{ row.productName }}</el-text>
        </template>
      </el-table-column>

      <el-table-column label="海关品名" width="180">
        <template #default="{ row, $index }">
          <el-form-item
            :prop="`${$index}.declaredType`"
            :rules="formRules.declaredType"
            class="mb-0px!"
          >
            <el-input :disabled="productDisabled" v-model="row.declaredType" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="海关品名(英文)" width="180">
        <template #default="{ row, $index }">
          <el-form-item
            :prop="`${$index}.declaredTypeEn`"
            :rules="formRules.declaredTypeEn"
            class="mb-0px!"
          >
            <el-input :disabled="productDisabled" v-model="row.declaredTypeEn" />
          </el-form-item>
        </template>
      </el-table-column>

 
        <el-table-column label="条码" width="120">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.fbaCode`" class="mb-0px!">
              <el-input v-model.trim="row.fbaCode" :disabled="disabled" class="!w-100%" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="箱率" width="120">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.containerRate`" class="mb-0px!">
              <el-input v-model.trim="row.containerRate" :disabled="disabled" class="!w-100%" />
            </el-form-item>
          </template>
        </el-table-column>


      <el-table-column label="单位" min-width="60">
        <template #default="{ row }">
          <el-text>{{ row.productUnitName }}</el-text>
        </template>
      </el-table-column>

      <el-table-column label="仓库" min-width="150">
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
                v-for="item in WMSWarehouseList"
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

      <el-table-column  label="下单数量" prop="orderQuantity" min-width="120">
        <template #default="{ row, $index }">
          <el-form-item
            :prop="`${$index}.orderQuantity`"
            :rules="formRules.orderQuantity"
            class="mb-0px!"
          >
            <!-- <el-input-number
              v-model="row.orderQuantity"
              controls-position="right"
              :min="0"
              :max="row.unOrderCount"
              class="!w-100%"
              @change="(val) => changeValLimit(row, 'orderQuantity', 0, val)"
            /> -->
            <SmNumber
              :max="row.unOrderCount"
              v-model="row.orderQuantity"
              @change="(val) => changeValLimit(row, 'orderQuantity', 0, val)"
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column  label="未订购数量" prop="unOrderCount" min-width="120">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.unOrderCount`" class="mb-0px!">
            <el-text>{{ row.unOrderCount }}</el-text>
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="申请数量" prop="qty" min-width="120">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.qty`" :rules="formRules.qty" class="mb-0px!">
            <!-- <el-input-number
              :disabled="productDisabled"
              v-model="row.qty"
              controls-position="right"
              :min="1"
              class="!w-100%"
            /> -->
            <SmNumber :disabled="productDisabled" :min="1" v-model="row.qty" />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column v-if="approveCountShow" label="批准数量" prop="approvedQty" min-width="120">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.approvedQty`" class="mb-0px!">
            <!-- <el-input-number
              :disabled="approveCountDisabled"
              v-model="row.approvedQty"
              controls-position="right"
              :min="1"
              :max="row.qty"
              class="!w-100%"
              @change="(val) => changeValLimit(row, 'approvedQty', 1, val)"
            /> -->
            <SmNumber
              :disabled="approveCountDisabled"
              :min="1"
              :max="row.qty"
              v-model="row.approvedQty"
              @change="(val) => changeValLimit(row, 'approvedQty', 1, val)"
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="含税单价" prop="grossPrice" min-width="140">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.grossPrice`" class="mb-0px!">
            <!-- <el-input-number
              :disabled="disabled"
              v-model="row.grossPrice"
              controls-position="right"
              :min="0.01"
              :precision="2"
              class="!w-100%"
            /> -->
            <SmNumber :disabled="disabled" :min="0.01" :precision="2" v-model="row.grossPrice" />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="单价" width="200">
        <template #default="{ row }">
          <!-- <el-input disabled v-model="row.productPrice" :formatter="erpPriceInputFormatter" /> -->
          <SmNumber disabled :min="0.01" :precision="2" v-model="row.productPrice" />
        </template>
      </el-table-column>

      <el-table-column label="税率%" prop="taxRate" min-width="140">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.taxRate`" class="mb-0px!">
            <!-- <el-input-number
              :disabled="disabled"
              v-model="row.taxRate"
              controls-position="right"
              :min="0"
              :precision="2"
              class="!w-100%"
            /> -->
            <SmNumber disabled :precision="2" v-model="row.taxRate" />
          </el-form-item>
        </template>
      </el-table-column>

      <template v-if="noCreate">
        <el-table-column label="税额" prop="taxPrice" min-width="140">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.taxPrice`" class="mb-0px!">
              {{ row.taxPrice }}
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="价税合计" min-width="150">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.source`" class="mb-0px!">
              <el-text>{{ row.grossTotalPrice }}</el-text>
            </el-form-item>
          </template>
        </el-table-column>
      </template>
      <el-table-column label="参考单价" prop="referenceUnitPrice" min-width="140">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.referenceUnitPrice`" class="mb-0px!">
            <!-- <el-input-number
              :disabled="disabled"
              v-model="row.referenceUnitPrice"
              controls-position="right"
              :min="0.01"
              :precision="2"
              class="!w-100%"
            /> -->
            <SmNumber :disabled="disabled" :min="0.01" :precision="2" v-model="row.referenceUnitPrice" />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="期望到货日期" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.expectArrivalDate`" class="mb-0px!">
            <el-date-picker
              disabled
              v-model="row.expectArrivalDate"
              type="date"
              value-format="x"
              placeholder="请选择期望到货日期"
              class="!w-1/1"
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column  label="交货日期" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item
            :prop="`${$index}.deliveryTime`"
            :rules="formRules.deliveryTime"
            class="mb-0px!"
          >
            <el-date-picker
              :disabled="disabled"
              v-model="row.deliveryTime"
              type="date"
              value-format="x"
              placeholder="请选择交货日期"
              class="!w-1/1"
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column  label="备注" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.remark`" class="mb-0px!">
            <el-input v-model.trim="row.remark" type="textarea" placeholder="请输入备注" />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column  label="申请人" width="200">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.applicantId`" class="mb-0px!">
            <el-text>{{ row.applicant }}</el-text>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column  label="申请部门" width="200">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.applicationDeptId`" class="mb-0px!">
            <el-text>{{ row.applicationDept }}</el-text>
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column v-if="showOperate" align="center" fixed="right" label="操作" width="60">
        <template #default="{ $index }">
          <el-button :disabled="formData.length === 1" @click="handleDelete($index)" link
            >—</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </el-form>
  <el-row justify="center" class="mt-3" v-if="!productDisabled">
    <el-button @click="handleAdd" round>+ 添加采购产品</el-button>
  </el-row>
</template>
<script setup lang="ts">
import { StockApi } from '@/api/erp/stock/stock'
import { getProductList, getWarehouseList } from '@/commonData'
import {
  erpCountInputFormatter,
  erpPriceInputFormatter,
  erpPriceMultiply,
  getSumValue
} from '@/utils'
import { TAX_PERCENT } from '@/utils/constant'
import { changeValLimit } from '@/utils/high/index'
import { computeGrossPriceAndGrossTotalPrice } from '@/utils/transformData'
import { updateModelValue } from '@/utils/high/index'
import { getDeclaredType } from '@/utils/operate/srm'
import { getWMSWarehouseList } from '@/commonData/wms'



/**
 * MergeOrderForm-采购申请合并-逻辑还是写在一块
 * 因为本地merge逻辑就是对申请部分项的补充-而且-展示内容和采购订单新增 行信息有一些区别
 * 
 */



/**
    items-商品信息-表格列(参照-采购订单-订单产品清单)

    商品id-productId-下拉框
    申请数量-qty-数字输入框(整数>0)
    仓库编号-warehouseId-下拉框 (数据来源-仓库精简列表接口)
    批准数量-approvedQty-数字输入框(整数>0)
    含税单价-grossPrice-数字输入框(手动输入，价格保留小数点后两位。)
    价税合计-grossTotalPrice-(显示在底部合计行-与含税单价联动，通过计算保持一致)
    参考单价-referenceUnitPrice-数字输入框(整数>0)
    税额，单位：元-taxPrice-(纯显示-保留小数点后两位   = 含税单价*税率   )
    税率，百分比-taxRate-数字输入框(手动输入，保留小数点后两位。)


    税额的计算


    单价 * (1+税率) = 含税单价
    单价 = 含税单价/ (1+税率)
    税额 = 单价 * 税率
    税额 = 含税单价 * (税率/(1+税率))

    产品带出 产品编码产品编码-barCode-change事件赋予值联动即可
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

const productDisabled = computed(() => ['audit', 'detail', 'merge'].includes(props.formType))
const allDisabled = computed(() => ['detail'].includes(props.formType))
const disabled = computed(() => ['audit', 'detail'].includes(props.formType))
// 批准数量在merge下要禁用
const mergeDisabled = computed(() => props.formType === 'merge')
const showAudit = computed(() => props.formType === 'audit' || props.formType === 'merge')
const showOperate = computed(() => ['create', 'update'].includes(props.formType))

const approveCountDisabled = computed(() => !['audit'].includes(props.formType))
const approveCountShow = computed(() =>
  ['detail', 'update', 'merge', 'audit'].includes(props.formType)
)

// 非新增下才会展示税额-价税合计
const noCreate = computed(() => !['create'].includes(props.formType))

const formLoading = ref(false) // 表单的加载中
const formData = ref<Array<any>>([])
// 必填项 单据日期 申请人 申请部门(在外部父表单) 产品编码-产品编码(产品名称-单位) 申请数量
const formRules = reactive({
  deliveryTime: [{ required: true, message: '交货日期不能为空', trigger: 'blur' }],
  productId: [{ required: true, message: '产品编码不能为空', trigger: 'blur' }],
  qty: [{ required: true, message: '申请数量不能为空', trigger: 'blur' }],
  orderQuantity: [{ required: true, message: '下单数量不能为空', trigger: 'blur' }],
  declaredType: [{ required: true, message: '海关品名不能为空', trigger: 'blur' }],
  declaredTypeEn: [{ required: true, message: '海关品名(英文)不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref
const productList = getProductList() // 产品列表

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
    税率，百分比-taxRate-数字输入框(手动输入，保留小数点后两位。)
     */

    const keyMap = {
      // taxPrice: 'taxPrice',
      // taxRate: 'taxRate',
      // grossTotalPrice: 'grossTotalPrice',
      // grossPrice: 'grossPrice',
      // onePrice: 'productPrice',
      applyCount: 'approvedQty'
    }

    /**
      新增-申请数量-qty
      审核-批准数量-approvedQty
      合并-下单数量-orderQuantity
     */
    const applyCountMap = {
      create: 'approvedQty', // 新增的时候不展示 价税合计-税额- 数据无法计算传递null
      audit: 'approvedQty',
      merge: 'orderQuantity',
      detail: 'approvedQty', // 详情只能看数量-和新增一样查看-详情展示批准数量
      update: 'approvedQty' // 展示批准数量-无法编辑
    }
    keyMap.applyCount = applyCountMap[props.formType] || 'approvedQty' // 新增没有值就不计算或者不传递

    // 编辑回显
    computeGrossPriceAndGrossTotalPrice(val, keyMap)
    // val.forEach((item) => {
    //   // 申请数量和税率都要有 才能计算出税额
    //   if (item.taxRate && item.qty && item.grossPrice) {
    //     const taxPercent100 = item.taxRate / 100.0
    //     // 税额 = 含税单价 * (税率/(1+税率)) * 申请数量
    //     const scale = (taxPercent100 / (1 + taxPercent100)) * item.qty
    //     item.taxPrice = erpPriceMultiply(item.grossPrice, scale)
    //     // 价税合计 = 含税单价 * 申请数量。
    //     item.grossTotalPrice = erpPriceMultiply(item.grossPrice, item.qty)
    //   }

    //   // item.totalProductPrice = erpPriceMultiply(item.productPrice, item.qty)
    //   // item.taxPrice = erpPriceMultiply(item.totalProductPrice, item.taxRate / 100.0)
    //   // if (item.totalProductPrice != null) {
    //   //   item.totalPrice = item.totalProductPrice + (item.taxPrice || 0)
    //   // } else {
    //   //   item.totalPrice = undefined
    //   // }
    // })
  },
  { deep: true, immediate: true }
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
    if (['qty', 'totalProductPrice', 'taxPrice', 'totalPrice'].includes(column.property)) {
      // const sum = getSumValue(data.map((item) => Number(item[column.property])))
      // sums[index] =
      //   column.property === 'qty' ? erpCountInputFormatter(sum) : erpPriceInputFormatter(sum)
    } else {
      sums[index] = ''
    }
  })

  return sums
}

/** 新增按钮操作 */
const handleAdd = () => {
  // 商品id-productId-下拉框
  // 申请数量-qty-数字输入框(整数>0)
  // 仓库编号-warehouseId-下拉框 (数据来源-仓库精简列表接口)
  // 批准数量-approvedQty-数字输入框(整数>0)
  // 含税单价-grossPrice-数字输入框(手动输入，价格保留小数点后两位。)
  // 价税合计-grossTotalPrice-(显示在底部合计行-与含税单价联动，通过计算保持一致)
  // 参考单价-referenceUnitPrice-数字输入框(整数>0)
  // 税额，单位：元-taxPrice-(纯显示-保留小数点后两位   = 含税单价*税率   )
  // 税率，百分比-taxRate-数字输入框(手动输入，保留小数点后两位。)

  // 增值税税率	从供应商中带出来，也可以自行输入

  const row = {
    id: undefined,
    productId: undefined,
    qty: undefined, // 申请数量
    approvedQty: undefined, // 批准数量
    warehouseId: undefined,
    grossPrice: undefined,
    referenceUnitPrice: undefined,
    taxPrice: undefined,
    taxRate: TAX_PERCENT,
    grossTotalPrice: undefined,
    orderQuantity: undefined, // 下单数量
    expectArrivalDate: undefined
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
  const product: any = productList.value.find((item) => item.id === productId)
  if (product) {
    row.productName = product.name
    row.productUnitName = product.unitName
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
  const qty = await StockApi.getStockCount(row.productId)
  row.stockCount = qty || 0
}

/** 表单校验 */
const validate = () => {
  return formRef.value.validate()
}

const WMSWarehouseList = getWMSWarehouseList()

defineExpose({ validate })

/** 初始化 */
onMounted(async () => {
  // 默认添加一个
  if (formData.value.length === 0) {
    handleAdd()
  }
})
</script>
