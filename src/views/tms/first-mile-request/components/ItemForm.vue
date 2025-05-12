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
        <el-table-column label="序号" type="index" align="center" width="60" />

        <el-table-column label="产品编码" width="150">
          <template #default="{ row, $index }">
            <el-form-item
              :prop="`${$index}.productId`"
              :rules="formRules.productId"
              class="mb-0px!"
            >
              <SmSelect
                :disabled="disabled"
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
        <el-table-column label="FBA条码" width="150">
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

        <el-table-column label="申请数量" width="100" align="center">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.qty`" :rules="formRules.qty" class="mb-0px!">
              <SmNumber :disabled="disabled" v-model="row.qty" />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="包装长(cm)" prop="packageLength" width="100" align="center" />
        <el-table-column label="包装宽(cm)" prop="packageWidth" width="100" align="center" />
        <el-table-column label="包装高(cm)" prop="packageHeight" width="100" align="center" />
        <el-table-column label="毛重(kg)" prop="packageWeight" width="100" align="center" />
        <el-table-column label="体积(m³)" prop="volume" width="100" align="center" />

        <el-table-column v-if="!disabled" align="center" fixed="right" label="操作" width="60">
          <template #default="{ $index }">
            <el-button @click="handleDelete($index)" link> — </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-row justify="center" class="mt-3">
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
import { getProductList } from '@/commonData'
import { changeAppStatus } from '@/api/pay/app'

const productList = getProductList()

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
const formRules = reactive({
  productId: [{ required: true, message: '产品编码不能为空', trigger: 'blur' }],
  qty: [{ required: true, message: '本次上架数不能为空', trigger: 'blur' }],
  fbaBarCode: [{ required: true, message: '请输入FBA条码', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

watch(
  () => props.itemIdKey,
  (val) => {}
)

watch(
  () => props.warehouse,
  (val: any) => {
    if (val) {
      const country = val.country
    } else {
    }
    console.log(val, '目的仓库')
    // getWarehouseBinList(warehouseBinList, { warehouseId: val })
  }
)

/** 初始化设置入库项 */
watch(
  () => props.items,
  async (val) => {
    formData.value = val
    if (formData.value?.length) {
      formData.value.forEach((item) => {
        computeVolume(item)
      })
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

// 体积= 长*宽*高*数量
const computeVolume = (item) => {
  const { packageHeight, packageLength, packageWidth, qty } = item
  if ([packageHeight, packageLength, packageWidth, qty].every((item) => item)) {
    item.volume = (packageHeight * packageLength * packageWidth * qty) / 1000000
  }
}

const changeProduct = (row, index, val) => {
  const product = productList.value.find((item) => item.id === val)
  if (!product) return

  const { packageHeight, packageLength, packageWidth, packageWeight } = product
  row.packageHeight = packageHeight
  row.packageLength = packageLength
  row.packageWidth = packageWidth
  row.packageWeight = packageWeight

  console.log(product, 'product')

  console.log(row, index, val, 'row,index,val-row,index,val')
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
