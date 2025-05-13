<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    v-loading="formLoading"
    label-width="0px"
    :inline-message="true"
  >
    <el-table :data="formData" class="-mt-10px">
      <el-table-column label="序号" type="index" width="100" />
      <el-table-column label="申请项ID" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.requestItemId`" :rules="formRules.requestItemId" class="mb-0px!">
            <el-radio-group v-model="row.requestItemId">
                <el-radio value="1">请选择字典生成</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="产品ID" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.productId`" :rules="formRules.productId" class="mb-0px!">
            <el-radio-group v-model="row.productId">
                <el-radio value="1">请选择字典生成</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="箱数" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.boxQty`" :rules="formRules.boxQty" class="mb-0px!">
            <el-input v-model="row.boxQty" placeholder="请输入箱数" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="库存公司" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.companyId`" :rules="formRules.companyId" class="mb-0px!">
            <el-radio-group v-model="row.companyId">
                <el-radio value="1">请选择字典生成</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="库存归属部门ID" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.deptId`" :rules="formRules.deptId" class="mb-0px!">
            <el-radio-group v-model="row.deptId">
                <el-radio value="1">请选择字典生成</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.remark`" :rules="formRules.remark" class="mb-0px!">
            <el-input v-model="row.remark" placeholder="请输入备注" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="计划发货数" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.outboundPlanQty`" :rules="formRules.outboundPlanQty" class="mb-0px!">
            <el-input v-model="row.outboundPlanQty" placeholder="请输入计划发货数" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="已入库数量" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.inboundClosedQty`" :rules="formRules.inboundClosedQty" class="mb-0px!">
            <el-input v-model="row.inboundClosedQty" placeholder="请输入已入库数量" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="发出仓ID" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.fromWarehouseId`" :rules="formRules.fromWarehouseId" class="mb-0px!">
            <el-radio-group v-model="row.fromWarehouseId">
                <el-radio value="1">请选择字典生成</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="包装长（cm）" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.packageLength`" :rules="formRules.packageLength" class="mb-0px!">
            <el-input v-model="row.packageLength" placeholder="请输入包装长（cm）" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="包装宽（cm）" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.packageWidth`" :rules="formRules.packageWidth" class="mb-0px!">
            <el-input v-model="row.packageWidth" placeholder="请输入包装宽（cm）" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="包装高（cm）" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.packageHeight`" :rules="formRules.packageHeight" class="mb-0px!">
            <el-input v-model="row.packageHeight" placeholder="请输入包装高（cm）" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="毛重（kg）" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.packageWeight`" :rules="formRules.packageWeight" class="mb-0px!">
            <el-input v-model="row.packageWeight" placeholder="请输入毛重（kg）" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="体积（m³）" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.volume`" :rules="formRules.volume" class="mb-0px!">
            <el-input v-model="row.volume" placeholder="请输入体积（m³）" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="60">
        <template #default="{ $index }">
          <el-button @click="handleDelete($index)" link>—</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
  <el-row justify="center" class="mt-3">
    <el-button @click="handleAdd" round>+ 添加头程单明细</el-button>
  </el-row>
</template>
<script setup lang="ts">
import { FirstMileApi } from '@/api/tms/first-mile'

const props = defineProps<{
  firstMileId: undefined // 头程主表ID（主表的关联字段）
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref([])
const formRules = reactive({
  fromWarehouseId: [{ required: true, message: '发出仓ID不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.firstMileId,
  async (val) => {
    // 1. 重置表单
    formData.value = []
    // 2. val 非空，则加载数据
    if (!val) {
      return;
    }
    try {
      formLoading.value = true
      formData.value = await FirstMileApi.getFirstMileItemListByFirstMileId(val)
    } finally {
      formLoading.value = false
    }
  },
  { immediate: true }
)

/** 新增按钮操作 */
const handleAdd = () => {
  const row = {
    requestItemId: undefined,
    productId: undefined,
    boxQty: undefined,
    companyId: undefined,
    deptId: undefined,
    remark: undefined,
    outboundPlanQty: undefined,
    inboundClosedQty: undefined,
    fromWarehouseId: undefined,
    packageLength: undefined,
    packageWidth: undefined,
    packageHeight: undefined,
    packageWeight: undefined,
    volume: undefined,
  }
  row.firstMileId = props.firstMileId
  formData.value.push(row)
}

/** 删除按钮操作 */
const handleDelete = (index) => {
  formData.value.splice(index, 1)
}

/** 表单校验 */
const validate = () => {
  return formRef.value.validate()
}

/** 表单值 */
const getData = () => {
  return formData.value
}

defineExpose({ validate, getData })
</script>