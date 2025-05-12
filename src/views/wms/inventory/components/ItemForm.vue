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

        <el-table-column prop="productBarCode" label="产品编码" width="120" align="center" />
        <el-table-column
          v-if="showDetail"
          prop="updaterName"
          label="操作人"
          width="80"
          align="center"
        />

        <el-table-column label="库位" width="120" align="center">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.binId`" :rules="createBinIdRule(row)" class="mb-0px!">
              <SmSelect
                :disabled="binDisabled || row.originBin"
                v-model="row.binId"
                placeholder="请选择库位"
                :data="warehouseBinList"
                @change="(val) => changeBin(row, $index, val)"
              />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column v-if="showActualQty" label="实盘数量" width="100" align="center">
          <template #default="{ row, $index }">
            <el-form-item
              :prop="`${$index}.actualQty`"
              :rules="formRules.actualQty"
              class="mb-0px!"
            >
              <SmNumber :disabled="otherDisabled" v-model="row.actualQty" />
              <!-- <SmNumber :disabled="otherDisabled" :max="row.expectedQty" v-model="row.actualQty" /> -->
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="expectedQty" label="系统数量" width="100" align="center" />

        <el-table-column v-if="showDetail" prop="deltaQty" label="差异值" width="80" align="center">
          <!-- 2盘盈 1盘亏 0盘平 -->
          <template #default="{ row }">
            <SmPlusMinus :val="row.deltaQty" :type="row.status" :typeList="[2, 1, 0]" />
          </template>
        </el-table-column>

        <el-table-column v-if="showDetail" label="盘点结果" width="100" align="center">
          <template #default="{ row }">
            <dict-tag :type="DICT_TYPE.WMS_INVENTORY_STATUS" :value="row.status" />
          </template>
        </el-table-column>

        <!-- <el-table-column label="预期库存" width="100" align="center">
          <template #default="{ row, $index }">
            <el-form-item
              :prop="`${$index}.expectedQty`"
              :rules="formRules.expectedQty"
              class="mb-0px!"
            >
              <SmNumber v-model="row.expectedQty" />
            </el-form-item>
          </template>
        </el-table-column> -->

        <el-table-column label="备注" width="120" align="center">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.remark`" class="mb-0px!">
              <el-input
                :disabled="otherDisabled"
                v-model="row.remark"
                placeholder="请输入备注"
                type="textarea"
              />
            </el-form-item>
          </template>
        </el-table-column>

        <!-- <el-table-column prop="pickQty" label="已选择数" width="100" align="center" /> -->

        <el-table-column v-if="!disabled" align="center" fixed="right" label="操作" width="60">
          <template #default="{ $index }">
            <div class="btnList">
              <div v-if="!inventoryDisabled" class="btn-item" @click="handleDelete($index)">
                <Icon icon="ep:minus" class="mr-5px" />
              </div>
              <div v-if="!binDisabled" class="btn-item" @click="handleAddItem($index)">
                <Icon icon="ep:plus" class="mr-5px" />
              </div>
              <!-- <el-button @click="handleDelete($index)" link> — </el-button> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
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
import { getWarehouseBinList } from '@/commonData/wms'
import { cloneDeep } from 'lodash-es'
import { computeTargetQty } from '@/utils/transformData'
import { OPERATE_MAP } from '../constant'
import { getBinIdRules } from '../../utils'
import { DICT_TYPE } from '@/utils/dict'
import { StockBinApi } from '@/api/wms/stock-bin'
import { isEmpty } from '@/utils/is'

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
  },
  itemIdKey: {
    type: Number,
    default: null
  }
})

const showActualQty = computed(() =>
  [OPERATE_MAP.inventory, 'update', 'detail'].includes(props.formType)
)
const showBin = computed(() => [OPERATE_MAP.append].includes(props.formType))

const otherDisabled = computed(
  () => props.disabled || [OPERATE_MAP.append].includes(props.formType)
)

const binDisabled = computed(
  () => props.disabled || [OPERATE_MAP.append, 'create'].includes(props.formType)
)
const showDetail = computed(() => ['detail'].includes(props.formType))
const inventoryDisabled = computed(() => [OPERATE_MAP.inventory].includes(props.formType))

const formLoading = ref(false) // 表单的加载中
const formData: any = ref([])
const { binIdRuleList, createBinIdRule } = getBinIdRules(formData)

const formRules = reactive({
  productId: [{ required: true, message: '产品编码不能为空', trigger: 'blur' }],
  binId: binIdRuleList,
  expectedQty: [{ required: true, message: '预期库存不能为空', trigger: 'blur' }],
  actualQty: [{ required: true, message: '实际库存不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref
const warehouseBinList: any = ref([])
// getWarehouseBinList(warehouseBinList, {})

watch(
  () => props.itemIdKey,
  (val) => {}
)

watch(
  () => props.warehouseId,
  (val) => {
    getWarehouseBinList(warehouseBinList, { warehouseId: val })
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
  // row[props.itemIdKey] = Math.random() + formData.value.length
  const row = cloneDeep(formData.value[index])
  row.id = undefined
  row.binId = undefined
  row.expectedQty = 0
  row.actualQty = 0
  row.originBin = undefined
  formData.value.splice(index + 1, 0, row)
}

const changeBin = async (row, index, val) => {
  if (isEmpty(val)) {
    row.expectedQty = 0
    row.actualQty = 0
    return
  }
  if (!row.binId) return

  const query = {
    binId: row.binId, // 必须取外面的会选择变更
    productId: row?.productId,
    warehouseId: row.bin?.warehouseId
  }
  const data = await StockBinApi.getStockBinStocks(query)
  if (data?.length) {
    const binItem = data[0]
    row.expectedQty = binItem.availableQty
    row.actualQty = binItem.availableQty
  } else {
    row.expectedQty = 0
    row.actualQty = 0
  }
}

/** 表单校验 */
const validate = () => {
  return formRef.value.validate()
}
defineExpose({ validate, formData })
</script>
<style lang="scss" scoped>
.btnList {
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-item {
  cursor: pointer;
}
</style>
