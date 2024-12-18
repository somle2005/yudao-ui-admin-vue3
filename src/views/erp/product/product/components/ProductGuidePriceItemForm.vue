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
      <el-table-column label="序号" type="index" align="center" width="60" />
      <el-table-column label="国别代码" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.code`" :rules="formRules.code" class="mb-0px!">
            <el-select
              v-model="row.code"
              placeholder="请选择国别代码"
              clearable
              class="!w-240px"
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.COUNTRY_CODE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="指导价" fixed="right" :rules="formRules.price" min-width="120">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.price`" class="mb-0px!">
            <el-input-number
              v-model="row.price"
              placeholder="请输入指导价"
              controls-position="right"
              :min="0.01"
              :precision="2"
              class="!w-100%"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="排序" fixed="right" min-width="115">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.sort`" class="mb-0px!">
            <el-input-number
              v-model="row.sort"
              controls-position="right"
              :min="0"
              class="!w-100%"
            />
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
    <el-button @click="handleAdd" round>+ 添加指导价</el-button>
  </el-row>
</template>
<script setup lang="ts">

import {ElForm} from "element-plus";
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
interface GuidePrice {
  code: number | undefined;
  price: number | undefined;
  sort: number;
}

const props = defineProps<{
  guidePriceList: GuidePrice[]
  //disabled: false
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref<GuidePrice[]>([]);
const formRules = reactive({
  code: [{ required: true, message: '请选择国别代码', trigger: 'change' }],
  price: [{ required: true, message: '指导价不能为空', trigger: 'blur' }]
})
const formRef = ref<InstanceType<typeof ElForm>>() // 表单 Ref
/** 初始化设置入库项 */
watch(
  () => props.guidePriceList,
  async (val) => {
    formData.value = val
  },
  { immediate: true }
)

/** 新增按钮操作 */
const handleAdd = () => {
  const row = {
    code: undefined,
    price: undefined,
    sort: 0
  }
  formData.value.push(row)
}

/** 删除按钮操作 */
const handleDelete = (index: number) => {
  formData.value.splice(index, 1)
}


/** 表单校验 */
const validate = () => {
  return formRef.value?.validate()
}
defineExpose({ validate })

/** 初始化 */
onMounted(async () => {

})
</script>
