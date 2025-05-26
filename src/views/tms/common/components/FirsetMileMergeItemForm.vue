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
      <el-table border :data="formData" class="-mt-10px">
        <el-table-column label="序号" type="index" width="60" align="center" />

        <el-table-column label="上游单据编号" width="150" prop="requestCode" align="center" />

        <el-table-column label="产品编码" width="150" align="center">
          <template #default="{ row, $index }">
            <el-form-item
              :prop="`${$index}.productId`"
              :rules="formRules.productId"
              class="mb-0px!"
            >
              <SmSelect
                v-model="row.productId"
                placeholder="请选择产品编码"
                :data="productList"
                :keyMap="{ label: 'barCode', value: 'id' }"
                @change="(val) => changeProduct(row, $index, val)"
              />
            </el-form-item>
          </template>
        </el-table-column>

        <!-- 自动带出该目的仓库所在国家的产品FBA条码 -->
        <el-table-column label="FBA条码" width="150" align="center">
          <template #default="{ row, $index }">
            <el-form-item
              :prop="`${$index}.fbaBarCode`"
              :rules="formRules.fbaBarCode"
              class="mb-0px!"
            >
              <el-input v-model="row.fbaBarCode" placeholder="请输入FBA条码" />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="件数" width="100" align="center">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.qty`" :rules="formRules.qty" class="mb-0px!">
              <SmNumber v-model="row.qty" />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="箱数" width="100" align="center">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.boxQty`" :rules="formRules.boxQty" class="mb-0px!">
              <SmNumber v-model="row.boxQty" />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="库存公司" width="200" align="center">
          <!-- <template #default="{ row, $index }"> -->
          <template #default>
            <!-- <el-form-item :prop="`${$index}.companyId`" class="mb-0px!">
              <SmSelect
                :disabled="getStoreDisabled(row)"
                v-model="row.companyId"
                placeholder="请选择库存公司"
                :data="financeSubjectList"
              />
            </el-form-item> -->
            <div
              v-for="item in [
                { companyName: '库存公司名称', availableQty: '60', id: 1 },
                { companyName: '库存公司名称1212', availableQty: '80', id: 2 }
              ]"
              :key="item.id"
              class="common-text"
            >
              {{ item.companyName }} * {{ item.availableQty }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="库存归属" width="200" align="center">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.deptId`" class="mb-0px!">
              <el-tree-select
                :disabled="getStoreDisabled(row)"
                filterable
                clearable
                v-model="row.deptId"
                :data="deptList"
                :props="defaultProps"
                check-strictly
                node-key="id"
                placeholder="请选择库存归属"
                @change="(val) => changeDept(row, $index, val)"
              />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="计划发货数" width="100" align="center">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.outboundPlanQty`" class="mb-0px!">
              <SmNumber v-model="row.outboundPlanQty" />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="发出仓" width="150" align="center">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.fromWarehouseId`" class="mb-0px!">
              <el-select
                :disabled="disabled"
                v-model="row.fromWarehouseId"
                clearable
                filterable
                placeholder="请选择发出仓"
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

        <!-- <el-table-column label="逻辑库存" prop="availableQty" width="100" align="center" />
        <el-table-column label="采购在途数" prop="purchaseTransitQty" width="100" align="center" /> -->

        <el-table-column label="包装长(cm)" prop="packageLength" width="100" align="center" />
        <el-table-column label="包装宽(cm)" prop="packageWidth" width="100" align="center" />
        <el-table-column label="包装高(cm)" prop="packageHeight" width="100" align="center" />
        <el-table-column label="毛重(kg)" prop="packageWeight" width="100" align="center" />
        <el-table-column
          label="体积(m³)"
          prop="volume"
          width="120"
          align="center"
          :formatter="formatDecimalFormatter"
        />
        <!-- <el-table-column label="体积(m³)" prop="volume" width="120" align="center">
          <template #default="{ row }">
            <SmNumber :precision="3" disabled v-model="row.volume" />
          </template>
        </el-table-column> -->

        <el-table-column label="销售公司" width="200" align="center">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.salesCompanyId`" class="mb-0px!">
              <SmSelect
                v-model="row.salesCompanyId"
                placeholder="请选择库存公司"
                :data="financeSubjectList"
              />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="备注" width="150" align="center">
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

        <el-table-column v-if="!disabled" align="center" fixed="right" label="操作" width="60">
          <template #default="{ $index }">
            <el-button @click="handleDelete($index)" link> — </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-row justify="center">
        <el-button @click="handleAdd" round>+ 添加</el-button>
      </el-row>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import {
  erpCountInputFormatter,
  erpPriceInputFormatter,
  erpPriceMultiply,
  getSumValue
} from '@/utils'
import { cloneDeep } from 'lodash-es'
import { computeTargetQty } from '@/utils/transformData'
import { hasRepeat } from '@/utils/judge'
import { getDeptTree, getFinanceSubjectList, getProductList, getWarehouseList } from '@/commonData'
import { changeAppStatus } from '@/api/pay/app'
import { CustomRuleApi } from '@/api/tms/customrule'
import { getIntDictOptions } from '@/utils/dict'
import { formatDecimal, formatDecimalFormatter } from '@/utils/num'
import { computeVolume, addFbaBarCode, addCompanyList, addCompany, addShowQtyDB } from '../utils'
import { useInitNum } from '../hooks'
import { getWMSWarehouseList } from '@/commonData/wms'

const productList = getProductList()
const WMSWarehouseList = getWMSWarehouseList()
const financeSubjectList = getFinanceSubjectList()
const { defaultProps, deptList } = getDeptTree()

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
  warehouse: {
    type: Object,
    default: () => {
      return {}
    }
  },
  itemIdKey: {
    type: String,
    default: null
  }
})

const updateShow = computed(() => props.formType === 'update')

/**
 * 头程单新增 有上游单据号的  也就是说从申请单过来的不可编辑  智能系统赋值 无上游单据号非合并过来 可以编辑
 * 头程申请单合并 选中项无法修改
 * 新加项可以修改
 */

const getStoreDisabled = (item) => {
  if (item.upstreamCode) {
    return true
  }
  if (props.formType === 'merge' && item.id) {
    return true
  }
}

const formLoading = ref(false) // 表单的加载中
const formData: any = ref([])
const formRules = reactive({
  productId: [{ required: true, message: '产品编码不能为空', trigger: 'blur' }],
  qty: [{ required: true, message: '数量不能为空', trigger: 'blur' }],
  fbaBarCode: [{ required: true, message: 'FBA条码不能为空', trigger: 'blur' }],
  boxQty: [{ required: true, message: '箱数不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

const { addInitNum, judgeNum } = useInitNum()

watch(
  () => props.itemIdKey,
  (val) => {}
)

watch(
  () => props.warehouse,
  async (val) => {
    if (judgeNum()) return
    addFbaBarCode(val, formData)
    // addCompanyList(val, formData)
    // val仓库id-formData companyId 库存归属deptId-批量去弄
  },
  { immediate: true, deep: true }
)

/** 初始化设置入库项 */
watch(
  () => props.items,
  async (val) => {
    formData.value = val
    if (formData?.value?.length) {
      formData.value.forEach((item) => {
        computeVolume(item)
      })
      addShowQtyDB(formData)
      addInitNum()
    }
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
    computeTargetQty(val, {
      targetQtyKey: 'pickQty',
      computeQtyKey: 'qty',
      computeKey: 'productId'
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

/** 添加按钮操作 */
const handleAddItem = (index: number) => {
  const row = cloneDeep(formData.value[index])
  // row[props.itemIdKey] = Math.random() + formData.value.length
  formData.value.splice(index, 0, row)
}

/** 新增按钮操作 */
const handleAdd = () => {
  const row = {
    id: undefined
  }
  formData.value.push(row)
}

const changeProduct = async (row, index, val) => {
  try {
    // addCompany(props.warehouse, row)

    const product = productList.value.find((item) => item.id === val)
    if (!product) {
      ;[
        'packageHeight',
        'packageLength',
        'packageWidth',
        'packageWeight',
        'fbaBarCode',
        'volume'
      ].forEach((key) => {
        row[key] = undefined
      })
      return
    }

    const { packageHeight, packageLength, packageWidth, packageWeight } = product
    row.packageHeight = packageHeight
    row.packageLength = packageLength
    row.packageWidth = packageWidth
    row.packageWeight = packageWeight

    const country = props?.warehouse?.country
    const countryList = getIntDictOptions(DICT_TYPE.COUNTRY_CODE)
    const countryCode = countryList.find((item) => country === item.label)?.value

    if (!countryCode && countryCode != 0) {
      row.fbaBarCode = undefined
      return
    }

    const query: any = {
      countryCode,
      productId: val
    }

    const data = await CustomRuleApi.getCustomRulePage(query)
    if (data?.list?.length) {
      row.fbaBarCode = data.list[0].fbaBarCode
    } else {
      row.fbaBarCode = undefined
    }
  } catch (e) {
    console.log(e, '报错')
  }
}

const changeDept = async (row, index, val) => {
  try {
    // addCompany(props.warehouse, row)
  } catch (e) {
    console.log(e, '报错')
  }
}

/** 初始化 */
onMounted(async () => {
  // 默认添加一个
  if (formData.value.length === 0) {
    handleAdd()
  }
})

/** 表单校验 */
const validate = () => {
  return formRef.value.validate()
}
defineExpose({ validate, formData })
</script>

<style lang="scss" scoped>
.btnList {
  display: flex;
  // flex-direction: column;
  align-items: center;
  justify-content: center;
}
.btn-item {
  cursor: pointer;
}
</style>
