<template>
  <div style="display: contents">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      v-loading="formLoading"
      label-width="0px"
      :inline-message="true"
    >
      <!-- show-summary :summary-method="getSummaries" -->
      <el-table border :data="formData" class="-mt-10px">
        <el-table-column label="序号" type="index" align="center" width="60" />
        <el-table-column v-if="!showCreate" prop="id" label="编号" min-width="120" align="center" />

        <template v-if="formType === 'detail'">
          <el-table-column label="验货单" width="200" align="center">
            <template #default="{ $index }">
              <el-button
                :disabled="jsonDisabled"
                type="primary"
                plain
                @click="openJsonList('inspectionJson', $index)"
              >
                验货单
              </el-button>
            </template>
          </el-table-column>

          <el-table-column label="完工单" width="200" align="center">
            <template #default="{ $index }">
              <el-button
                :disabled="jsonDisabled"
                type="primary"
                plain
                @click="openJsonList('completionJson', $index)"
              >
                完工单
              </el-button>
            </template>
          </el-table-column>
        </template>

        <el-table-column label="产品编码" width="180" align="center">
          <template #default="{ row, $index }">
            <el-form-item
              :prop="`${$index}.productId`"
              :rules="formRules.productId"
              class="mb-0px!"
              :disabled="disabled"
            >
              <!-- <el-select
                v-model="row.productId"
                clearable
                filterable
                @change="onChangeProduct($event, row)"
                @update:model-value="updateModelValue"
                placeholder="请选择产品编码"
                :disabled="disabled"
              >
                <el-option
                  v-for="item in productList"
                  :key="item.id"
                  :label="item.barCode"
                  :value="item.id"
                />
              </el-select> -->
              <!-- @update:model-value=" @change="onChangeProduct($event, row)" 测试可以 -->
              <SmSelect
                :disabled="disabled"
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
                        productUnitName: 'unitName',
                        productUnitId: 'unitId'
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
        <el-table-column prop="productName" label="产品名称" width="120" align="center" />

        <el-table-column label="海关品名" width="180" align="center">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.declaredType`" class="mb-0px!">
              <el-input :disabled="disabled" v-model.trim="row.declaredType" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="海关品名(英文)" width="180" align="center">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.declaredTypeEn`" class="mb-0px!">
              <el-input :disabled="disabled" v-model="row.declaredTypeEn" />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="条码" width="120" align="center">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.xcode`" class="mb-0px!">
              <el-input v-model.trim="row.xcode" :disabled="disabled" class="!w-100%" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="箱率" width="120" align="center">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.containerRate`" class="mb-0px!">
              <el-input v-model.trim="row.containerRate" :disabled="disabled" class="!w-100%" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="productUnitName" label="单位" min-width="60" align="center" />
        <el-table-column label="仓库" width="150" align="center">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.warehouseId`" class="mb-0px!">
              <el-select
                :disabled="warehouseDisabled"
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

        <!-- 因为详情拿不到 未订购数量-统一让后端原子性判断报错。前端不做最大值限制 -->

        <el-table-column v-if="!showOringinCount" label="下单数量" width="120" align="center">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.qty`" class="mb-0px!">
              <!-- <el-input-number
                :disabled="countDisabled"
                v-model="row.qty"
                controls-position="right"
                :min="1"
                class="!w-100%"
              /> -->
              <SmNumber
                :min="1"
                :max="row.originCount"
                :disabled="countDisabled"
                v-model="row.qty"
              />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column v-if="showOringinCount" label="入库数量" width="120" align="center">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.qty`" class="mb-0px!">
              <!-- <el-input-number
                :disabled="countDisabled"
                v-model="row.qty"
                controls-position="right"
                :min="1"
                :max="row.originCount"
                class="!w-100%"
              /> -->
              <SmNumber
                :disabled="countDisabled"
                :min="1"
                :max="row.originCount"
                v-model="row.qty"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          v-if="showOringinCount"
          prop="originCount"
          label="下单数量"
          width="120"
          align="center"
        />

        <!-- <el-table-column label="币种" prop="currencyId" width="120">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.currencyId`" class="mb-0px!">
              <el-select
                :disabled="disabled"
                v-model="row.currencyId"
                placeholder="请选择币种"
                clearable
                filterable
                style="width: 100px"
                @change="currencyChange($event, row)"
              >
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.CURRENCY_CODE)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column> -->

        <!-- 丁哥说只要有整单币种就可以了 -->
        <!-- <el-table-column label="币种" prop="currencyName" width="120">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.currencyName`" class="mb-0px!">
              <SmSelect
                :disabled="disabled"
                v-model="row.currencyName"
                placeholder="请选择币种"
                @change="currencyNameChange($event, row)"
                :data="currencyList"
              />
            </el-form-item>
          </template>
        </el-table-column> -->

        <el-table-column label="含税单价" width="120" align="center">
          <template #default="{ row, $index }">
            <el-form-item
              :prop="`${$index}.actTaxPrice`"
              :rules="formRules.actTaxPrice"
              class="mb-0px!"
            >
              <!-- <el-input-number
                :disabled="disabled"
                v-model="row.actTaxPrice"
                controls-position="right"
                :min="0.01"
                :precision="2"
                class="!w-100%"
              /> -->
              <SmNumber :disabled="disabled" :min="0.01" :precision="2" v-model="row.actTaxPrice" />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="单价" width="200" align="center">
          <template #default="{ row }">
            <!-- <el-input disabled v-model="row.productPrice" :formatter="erpPriceInputFormatter" /> -->
            <SmNumber disabled :precision="2" v-model="row.productPrice" />
          </template>
        </el-table-column>

        <el-table-column label="税率%" width="115" align="center">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.taxPercent`" class="mb-0px!">
              <!-- <el-input-number
                :disabled="disabled"
                v-model="row.taxPercent"
                controls-position="right"
                :min="0"
                :precision="2"
                class="!w-100%"
              /> -->
              <SmNumber
                :disabled="disabled"
                :precision="2"
                :max="row.originCount"
                v-model="row.taxPercent"
              />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="税额" prop="taxPrice" width="120" align="center">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.taxPrice`" class="mb-0px!">
              <el-form-item :prop="`${$index}.taxPrice`" class="mb-0px!">
                <el-input disabled v-model="row.taxPrice" :formatter="erpPriceInputFormatter" />
              </el-form-item>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="allAmount" label="价税合计" min-width="150" align="center" />

        <el-table-column v-if="showCreate" label="期望到货日期" min-width="150" align="center">
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

        <el-table-column label="交货日期" width="180" align="center">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.deliveryTime`" class="mb-0px!">
              <el-date-picker
                :disabled="disabled"
                v-model="row.deliveryTime"
                type="date"
                value-format="x"
                placeholder="选择交货日期"
                class="!w-100%"
              />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="备注" min-width="150" align="center">
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
        <el-table-column prop="purchaseApplyCode" label="源单单号" width="200" align="center" />

        <el-table-column label="申请人" width="200" align="center">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.applicantId`" class="mb-0px!">
              <el-select
                v-if="!row.purchaseApplyCode"
                :disabled="disabled"
                v-model="row.applicantId"
                clearable
                filterable
                placeholder="请选择申请人"
              >
                <el-option
                  v-for="item in userList"
                  :key="item.id"
                  :label="item.nickname"
                  :value="item.id"
                />
              </el-select>
              <el-text v-if="row.purchaseApplyCode">{{ row.applicantName }}</el-text>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="申请部门" width="200" align="center">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.applicationDeptId`" class="mb-0px!">
              <el-tree-select
                v-if="!row.purchaseApplyCode"
                filterable
                clearable
                :disabled="disabled"
                v-model="row.applicationDeptId"
                :data="deptList"
                :props="defaultProps"
                check-strictly
                node-key="id"
                placeholder="请选择申请部门"
              />
              <el-text v-if="row.purchaseApplyCode">{{ row.departmentName }}</el-text>
            </el-form-item>
          </template>
        </el-table-column>

        <!-- purchaseApplyItemId 采购申请单，申请项编号 -->

        <!-- 
      <el-table-column label="税额合计" prop="totalPrice" min-width="100">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.totalPrice`" class="mb-0px!">
            <el-input disabled v-model="row.totalPrice" :formatter="erpPriceInputFormatter" />
          </el-form-item>
        </template>
      </el-table-column> -->

        <el-table-column v-if="showOperate" align="center" fixed="right" label="操作" width="60">
          <template #default="{ $index }">
            <el-button :disabled="formData.length === 1" @click="handleDelete($index)" link
              >—</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <el-row justify="center" class="mt-3" v-if="!disabled">
      <el-button @click="handleAdd" round>+ 添加采购产品</el-button>
    </el-row>

    <InspectionJsonForm ref="inspectionJsonFormRef" :disabled="jsonDisabled" />
    <CompletionJsonForm ref="completionJsonFormRef" :disabled="jsonDisabled" />
  </div>
</template>
<script setup lang="ts">
import { StockApi } from '@/api/erp/stock/stock'
import {
  getCurrencyList,
  getDeptTree,
  getProductList,
  getUserList,
  getWarehouseList
} from '@/commonData'
import {
  erpCountInputFormatter,
  erpPriceInputFormatter,
  erpPriceMultiply,
  getSumValue
} from '@/utils'
import { computeTaxPriceAndAllAmount } from '@/utils/transformData'
import { TAX_PERCENT } from '@/utils/constant'
import { defaultProps } from '@/utils/tree'
import { updateModelValue } from '@/utils/high/index'
import { getDeclaredType, currencyNameChange, currencyChange } from '@/utils/operate/purchase'
import InspectionJsonForm from './InspectionJsonForm.vue'
import CompletionJsonForm from './CompletionJsonForm.vue'
import { InfoKeyOpenFormData } from '../hooks/injectKeys'
import { getWMSWarehouseList } from '@/commonData/wms'

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

const warehouseDisabled = computed(() =>
  ['audit', 'detail', 'generateContract'].includes(props.formType)
)

// 合并入库的时候有入库数量
const countDisabled = computed(() =>
  ['audit', 'detail', 'generateContract'].includes(props.formType)
)
const showOringinCount = computed(() => ['merge'].includes(props.formType))
const showOperate = computed(() => ['create', 'update'].includes(props.formType))
const showCreate = computed(() => ['create'].includes(props.formType))

const formLoading = ref(false) // 表单的加载中
const formData: any = ref([])
const formRules = reactive({
  productId: [{ required: true, message: '产品不能为空', trigger: 'blur' }],
  // productPrice: [{ required: true, message: '产品单价不能为空', trigger: 'blur' }],
  actTaxPrice: [{ required: true, message: '含税单价不能为空', trigger: 'blur' }],
  qty: [{ required: true, message: '数量不能为空', trigger: 'blur' }]
  // currencyId: [{ required: true, message: '币种不能为空', trigger: 'blur' }],
  // declaredType: [{ required: true, message: '海关品名不能为空', trigger: 'blur' }],
  // declaredTypeEn: [{ required: true, message: '海关品名(英文)不能为空', trigger: 'blur' }]
})
const formRef = ref([]) // 表单 Ref
const productList = getProductList() // 产品列表
const WMSWarehouseList = getWMSWarehouseList()
const deptList: any = ref([])
const userList: any = ref([])
getUserList(userList)
getDeptTree(deptList)
const inspectionJsonFormRef = ref()
const completionJsonFormRef = ref()

const openFormData = inject(InfoKeyOpenFormData)
const jsonDisabled = computed(() => {
  return openFormData.value.auditStatus !== 5
}) // 已审核状态下进行编辑

const openJsonList = (type: string, index: number) => {
  const row = formData.value[index]
  const map = {
    inspectionJson: () => {
      inspectionJsonFormRef.value.open(row, formData, index, type)
    },
    completionJson: () => {
      completionJsonFormRef.value.open(row, formData, index, type)
    }
  }

  map[type]()
}

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
      taxPrice: 'taxPrice',
      taxPercent: 'taxPercent',
      allAmount: 'allAmount',
      actTaxPrice: 'actTaxPrice',
      onePrice: 'productPrice',
      applyCount: 'qty'
    }

    // 编辑回显
    computeTaxPriceAndAllAmount(val, keyMap)

    // // 循环处理
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
    id: undefined,
    productId: undefined,
    productPrice: undefined,
    taxPercent: TAX_PERCENT,
    taxPrice: undefined,
    currencyId: undefined,
    // actTaxPrice: undefined, 产品单价就是含税单价了
    remark: undefined,
    discountPercent: undefined,
    warehouseId: undefined,
    deliveryTime: undefined,
    xcode: undefined,
    containerRate: undefined,
    purchaseApplyItemId: undefined,
    purchaseApplyCode: undefined,
    qty: undefined,
    inspectionJson: [],
    completionJson: []
    // inboundClosedQty: undefined,
    // applyCount: undefined,
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
  // 默认添加一个
  if (formData.value.length === 0) {
    handleAdd()
  }
})
</script>
