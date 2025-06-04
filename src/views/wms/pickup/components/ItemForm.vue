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

        <el-table-column label="入库单编号" prop="inboundCode" align="center" width="150" />
        <el-table-column prop="productBarCode" label="产品编码" width="120" align="center" />
        <!-- <el-table-column label="产品编码" width="120" align="center">
          <template #default="{ row, $index }">
            <el-form-item
              :prop="`${$index}.productId`"
              :rules="formRules.productId"
              class="mb-0px!"
            >
              <div>{{ row.productBarCode }}</div>
            </el-form-item>
          </template>
        </el-table-column> -->

        <el-table-column label="库位" width="180" align="center">
          <template #default="{ row, $index }">
            <!-- :data="warehouseBinList" -->
            <el-form-item :prop="`${$index}.binId`" :rules="createBinIdRule(row)" class="mb-0px!">
              <SmSelect
                :disabled="disabled"
                v-model="row.binId"
                placeholder="请选择库位"
                :data="warehouseBinList"
              />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="本次上架数" width="100" align="center">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.qty`" :rules="formRules.qty" class="mb-0px!">
              <!-- <el-input-number
                v-model="row.qty"
                controls-position="right"
                :min="0"
                class="!w-100%"
              /> -->
              <SmNumber v-model="row.qty" />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="pickQty" label="已选择数" width="100" align="center" />
        <el-table-column prop="actualQty" label="入库数量" width="100" align="center" />
        <!-- <el-table-column prop="outboundAvailableQty" label="待上架数" width="100" align="center" /> -->
        <el-table-column prop="shelveAvailableQty" label="待上架数" width="100" align="center" />

        <!-- <el-table-column label="计划入库量" width="100">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.planQty`" class="mb-0px!">
              <el-text>{{ row.planQty }}</el-text>
            </el-form-item>
          </template>
        </el-table-column> -->

        <el-table-column prop="shelveClosedQty" label="已上架数" width="100" align="center" />

        <el-table-column v-if="!disabled" align="center" fixed="right" label="操作" width="60">
          <template #default="{ $index }">
            <div class="btnList">
              <div class="btn-item" @click="handleDelete($index)">
                <Icon icon="ep:minus" class="mr-5px" />
              </div>
              <div class="btn-item" @click="handleAddItem($index)">
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
import { getBinIdRules } from '../../utils'

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
    type: String,
    default: null
  }
})

const updateShow = computed(() => props.formType === 'update')
const formLoading = ref(false) // 表单的加载中
const formData: any = ref([])

const { binIdRuleList, createBinIdRule } = getBinIdRules(formData)

const formRules = reactive({
  productId: [{ required: true, message: '产品编码不能为空', trigger: 'blur' }],
  binId: binIdRuleList,
  qty: [{ required: true, message: '本次上架数不能为空', trigger: 'blur' }]
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
    // getWarehouseBinList(warehouseBinList, { warehouseId: val })
  }
)

/** 初始化设置入库项 */
watch(
  () => props.items,
  async (val: any) => {
    formData.value = val
    if (val?.length && !warehouseBinList.value.length) {
      getWarehouseBinList(warehouseBinList, { warehouseId: val[0].warehouseId })
    }
    // formData.value = cloneDeep(val)
    // if (formData.value?.length) {
    //   formData.value.forEach((item: any) => {
    //     item.warehouseBinList = warehouseBinList.value.filter(
    //       (a) => a.warehouseId === item.warehouseId
    //     )
    //   })
    //   val = formData.value
    // }
  }
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
  formData.value.splice(index + 1, 0, row)
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
  // flex-direction: column;
  align-items: center;
  justify-content: center;
}
.btn-item {
  cursor: pointer;
}
</style>
