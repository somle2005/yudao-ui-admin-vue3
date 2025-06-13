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
        <el-table-column label="产品编码" width="150" align="center">
          <template #default="{ row, $index }">
            <el-form-item
              :prop="`${$index}.productId`"
              :rules="formRules.productId"
              class="mb-0px!"
            >
              <SmSelect
                disabled
                v-model="row.productId"
                placeholder="请选择产品编码"
                :data="productList"
                :keyMap="{ label: 'code', value: 'id' }"
              />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="源库位" width="120" :rules="formRules.fromBinId" align="center">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.fromBinId`" class="mb-0px!">
              <SmSelect v-model="row.fromBinId" placeholder="请选择源库位" :data="sourceBinList" />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="目的库位" width="120" align="center">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.toBinId`" :rules="formRules.toBinId" class="mb-0px!">
              <SmSelect v-model="row.toBinId" placeholder="请选择目的库位" :data="toBinList" />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="数量" width="100" align="center">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.qty`" :rules="formRules.qty" class="mb-0px!">
              <SmNumber :disabled="disabled" v-model="row.qty" />
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
            <el-button :disabled="formData.length === 1" @click="handleDelete($index)" link>
              —
            </el-button>
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
import { getProductList } from '@/commonData'
import { InfoKeyOpenFormData } from '../hooks/injectKeys'
import { useSourceBinList } from '../../common/utils'

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
  productId: [{ required: true, message: '产品编码不能为空', trigger: 'blur' }],
  qty: [{ required: true, message: '数量不能为空', trigger: 'blur' }],
  fromBinId: [{ required: true, message: '源库位不能为空', trigger: 'blur' }],
  toBinId: [{ required: true, message: '目的库位不能为空', trigger: 'blur' }]
})

const productList = getProductList()
const sourceBinList = ref([])
const toBinList = ref([])
const formRef = ref() // 表单 Ref
const openFormData = inject(InfoKeyOpenFormData)
const { canSourceBinList } = useSourceBinList()
const { canSourceBinList: canToBinList } = useSourceBinList()

watch(
  () => openFormData,
  async (val) => {
    canSourceBinList(val, sourceBinList)
    canToBinList(val, toBinList, 'toBin')
  },
  { immediate: true, deep: true }
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
