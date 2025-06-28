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
    <SmTable
      v-if="formData.length"
      :pagination="false"
      isIndex
      isSelection
      :options="tableOptions"
      :data="formData"
      :getTableData="getTableData"
      @selection-change="handleSelectionChange"
    >
      <template #productId="{ row, $index }">
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
                    productCode: 'code',
                    productUnitName: 'unitName'
                  },
                  getDeclaredType
                )
            "
            :data="productList"
            :keyMap="{ label: 'code', value: 'id' }"
          />
        </el-form-item>
      </template>

      <template #declaredType="{ row, $index }">
        <el-form-item
          :prop="`${$index}.declaredType`"
          :rules="formRules.declaredType"
          class="mb-0px!"
        >
          <el-input :disabled="productDisabled" v-model="row.declaredType" />
        </el-form-item>
      </template>

      <template #containerRate="{ row, $index }">
        <el-form-item :prop="`${$index}.containerRate`" class="mb-0px!">
          <el-input v-model.trim="row.containerRate" :disabled="disabled" class="!w-100%" />
        </el-form-item>
      </template>

      <template #warehouseId="{ row, $index }">
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

      <template #orderQuantity="{ row, $index }">
        <el-form-item
          :prop="`${$index}.orderQuantity`"
          :rules="formRules.orderQuantity"
          class="mb-0px!"
        >
          <SmNumber
            :max="row.unOrderCount"
            v-model="row.orderQuantity"
            @change="(val) => changeValLimit(row, 'orderQuantity', 0, val)"
          />
        </el-form-item>
      </template>

      <template #qty="{ row, $index }">
        <el-form-item :prop="`${$index}.qty`" :rules="formRules.qty" class="mb-0px!">
          <SmNumber :disabled="productDisabled" :min="1" v-model="row.qty" />
        </el-form-item>
      </template>

      <template #approvedQty="{ row, $index }">
        <el-form-item :prop="`${$index}.approvedQty`" class="mb-0px!">
          <SmNumber
            :disabled="approveCountDisabled"
            :min="1"
            :max="row.qty"
            v-model="row.approvedQty"
            @change="(val) => changeValLimit(row, 'approvedQty', 1, val)"
          />
        </el-form-item>
      </template>

      <template #grossPrice="{ row, $index }">
        <el-form-item :prop="`${$index}.grossPrice`" class="mb-0px!">
          <SmNumber :disabled="disabled" :min="0.01" :precision="2" v-model="row.grossPrice" />
        </el-form-item>
      </template>

      <template #productPrice="{ row }">
        <SmNumber disabled :min="0.01" :precision="2" v-model="row.productPrice" />
      </template>

      <template #taxRate="{ row, $index }">
        <el-form-item :prop="`${$index}.taxRate`" class="mb-0px!">
          <SmNumber :precision="2" v-model="row.taxRate" />
        </el-form-item>
      </template>

      <template #referenceUnitPrice="{ row, $index }">
        <el-form-item :prop="`${$index}.referenceUnitPrice`" class="mb-0px!">
          <SmNumber
            :disabled="disabled"
            :min="0.01"
            :precision="2"
            v-model="row.referenceUnitPrice"
          />
        </el-form-item>
      </template>

      <template #expectArrivalDate="{ row, $index }">
        <el-form-item :prop="`${$index}.expectArrivalDate`" class="mb-0px!">
          <el-date-picker
            :disabled="mergeDisabled"
            v-model="row.expectArrivalDate"
            type="date"
            value-format="x"
            placeholder="请选择期望到货日期"
            class="!w-1/1"
            @change="(val) => batchChange(row, val, 'expectArrivalDate')"
          />
        </el-form-item>
      </template>

      <template #deliveryTime="{ row, $index }">
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
            @change="(val) => batchChange(row, val, 'deliveryTime')"
          />
        </el-form-item>
      </template>

      <template #declaredTypeEn="{ row, $index }">
        <el-form-item
          :prop="`${$index}.declaredTypeEn`"
          :rules="formRules.declaredTypeEn"
          class="mb-0px!"
        >
          <el-input :disabled="productDisabled" v-model="row.declaredTypeEn" />
        </el-form-item>
      </template>

      <template #remark="{ row, $index }">
        <el-form-item :prop="`${$index}.remark`" class="mb-0px!">
          <el-input v-model.trim="row.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </template>

      <template #operate="{ $index }">
        <el-button :disabled="formData.length === 1" @click="handleDelete($index)" link
          >—</el-button
        >
      </template>
    </SmTable>
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
import { useBatchChange } from '@/hooks/common/useBatch'
import { useTableData } from '@/components/SmTable/src/utils'
import { WHOLE_ORDER_TYPE } from '@/hooks/common/wholeOrder'
import { dateFormatter, dateFormatter2 } from '@/utils/formatTime'
import { addFieldProp } from '@/components/SmTableField/src/utils'

/**
    items-商品信息-表格列(参照-采购订单-订单产品清单)

    商品id-productId-下拉框
    申请数量-qty-数字输入框(整数>0)
    仓库编号-warehouseId-下拉框 (数据来源-仓库精简列表接口)
    批准数量-approvedQty-数字输入框(整数>0)
    含税单价-grossPrice-数字输入框(手动输入，价格保留小数点后两位。)
    价税合计-grossTotalPrice-(显示在底部合计行-与含税单价联动，通过计算保持一致)
    参考单价-referenceUnitPrice-数字输入框(整数>0)
    税额，单位：元-tax-(纯显示-保留小数点后两位   = 含税单价*税率   )
    税率，百分比-taxRate-数字输入框(手动输入，保留小数点后两位。)


    税额的计算


    单价 * (1+税率) = 含税单价
    单价 = 含税单价/ (1+税率)
    税额 = 单价 * 税率
    税额 = 含税单价 * (税率/(1+税率))

    产品带出 产品编码产品编码-code-change事件赋予值联动即可
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
const showMerge = computed(() => props.formType === 'merge')
const noCreate = computed(() => props.formType !== 'create')

// 非新增下才会展示税额-价税合计

// noCreate.value能否正确响应式要测试下-可以正确响应
// :rules="formRules.qty" 测试检验功能是否ok

// 选择项记得开启 isSelection isIndex
//  <el-table-column fixed="left" width="40" label="选择" type="selection" align="center" />
//     <el-table-column label="序号" type="index" align="center" width="60" />
// 清单标记listDisabled 清单强制字段 无法被启用 应该会disabled
// 抛出$index字段 <template #operate="{ scope }"> 直接取scope.$index  row, $index
const fieldMap = {
  id: {
    width: '60',
    label: '行编号',
    isEnable: noCreate.value,
    listDisabled: true
  },

  productId: {
    width: '180',
    label: '*产品编码',
    slot: 'productId'
  },
  productName: {
    width: '160',
    label: '产品名称'
  },
  declaredType: {
    width: '180',
    label: '*海关品名',
    slot: 'declaredType'
  },

  containerRate: {
    width: '100',
    label: '箱率',
    slot: 'containerRate',
    isEnable: disabled.value,
    listDisabled: true
  },

  productUnitName: {
    width: '100',
    label: '单位'
  },

  warehouseId: {
    width: '120',
    label: '仓库',
    slot: 'warehouseId',
    isEnable: disabled.value,
    listDisabled: true
  },

  orderQuantity: {
    width: '80',
    label: '*下单数量',
    slot: 'orderQuantity',
    isEnable: mergeDisabled.value,
    listDisabled: true
  },
  unOrderCount: {
    width: '120',
    label: '未订购数量',
    slot: 'unOrderCount',
    isEnable: mergeDisabled.value,
    listDisabled: true
  },

  qty: {
    width: '100',
    label: '*申请数量',
    slot: 'qty'
  },

  approvedQty: {
    width: '100',
    label: '批准数量',
    slot: 'approvedQty',
    isEnable: approveCountShow.value,
    listDisabled: true
  },

  grossPrice: {
    width: '100',
    label: '含税单价',
    slot: 'grossPrice'
  },

  productPrice: {
    width: '100',
    label: '单价',
    slot: 'productPrice'
  },

  taxRate: {
    width: '100',
    label: '税率%',
    slot: 'taxRate'
  },

  tax: {
    width: '100',
    label: '税额',
    isEnable: showMerge.value,
    listDisabled: true
  },

  grossTotalPrice: {
    width: '100',
    label: '价税合计',
    isEnable: showMerge.value,
    listDisabled: true
  },

  referenceUnitPrice: {
    width: '100',
    label: '参考单价',
    slot: 'referenceUnitPrice'
  },

  expectArrivalDate: {
    width: '150',
    label: '期望到货日期',
    slot: 'expectArrivalDate'
  },

  deliveryTime: {
    width: '150',
    label: '*交货日期',
    slot: 'deliveryTime'
  },

  declaredTypeEn: {
    width: '150',
    label: '*海关品名(英文)',
    slot: 'declaredTypeEn'
  },

  remark: {
    width: '100',
    label: '备注',
    slot: 'remark',
    isEnable: mergeDisabled.value,
    listDisabled: true
  },

  applicant: {
    width: '160',
    label: '申请人',
    isEnable: mergeDisabled.value,
    listDisabled: true
  },
  applicationDept: {
    width: '160',
    label: '申请部门',
    isEnable: mergeDisabled.value,
    listDisabled: true
  },

  operate: {
    width: '60',
    label: '操作',
    slot: 'operate',
    isEnable: showOperate.value,
    listDisabled: true
  }
}

const { tableOptions, transformTableOptions } = useTableData()
const allOptions = transformTableOptions(fieldMap)
tableOptions.value = addFieldProp(allOptions).filter((item) => item.isEnable)

const getTableData = () => {
  return formData
}

const { addSelectionId, handleSelectionChange, batchChange } = useBatchChange(formData)

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

    税额，单位：元-tax-(纯显示-保留小数点后两位   = 含税单价*税率   )
    税率，百分比-taxRate-数字输入框(手动输入，保留小数点后两位。)
     */

    const keyMap = {
      // tax: 'tax',
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
    // 新增的时候还是用批准数量虽然是0 如果新增带过去 编辑回显就会有问题如果没有批准数量 就无法进行计算
    const applyCountMap = {
      // create: 'qty', // 新增的时候不展示 价税合计-税额- 数据无法计算传递null
      create: 'approvedQty',
      audit: 'approvedQty',
      merge: 'orderQuantity',
      detail: 'approvedQty', // 详情只能看数量-和新增一样查看-详情展示批准数量
      update: 'approvedQty' // 展示批准数量-无法编辑
    }
    keyMap.applyCount = applyCountMap[props.formType] || 'approvedQty' // 新增没有值就不计算或者不传递

    // 编辑回显
    computeGrossPriceAndGrossTotalPrice(val, keyMap)
    addSelectionId(val)
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
    if (['qty', 'totalProductPrice', 'tax', 'totalPrice'].includes(column.property)) {
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
  // 税额，单位：元-tax-(纯显示-保留小数点后两位   = 含税单价*税率   )
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
    tax: undefined,
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
    // row.productCode = product.code
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

defineExpose({ validate, formData })

/** 初始化 */
onMounted(async () => {
  // 默认添加一个
  if (formData.value.length === 0) {
    handleAdd()
  }
})
</script>
