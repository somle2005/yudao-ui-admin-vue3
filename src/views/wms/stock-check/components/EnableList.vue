<template>
  <Dialog title="待盘点库位" v-model="dialogVisible">
    <ContentWrap>
      <!-- 搜索工作栏 -->
      <SmForm
        class="-mb-15px"
        ref="queryFormRef"
        :inline="true"
        label-width="100px"
        v-model="queryParams"
        :options="searchFormOptions"
        :getModelValue="getSearchFormData"
      >
        <template #action>
          <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
          <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        </template>
      </SmForm>
    </ContentWrap>
    <ContentWrap style="padding-bottom: 0">
      <SmTable
        border
        isSelection
        :loading="loading"
        :options="tableOptions"
        :data="list"
        :total="total"
        v-model:currentPage="queryParams.pageNo"
        v-model:pageSize="queryParams.pageSize"
        @pagination="getList"
        @selection-change="handleSelectionChange"
      />
    </ContentWrap>
    <template #footer>
      <el-button @click="submitForm" type="primary"> 确 定 </el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { useEnableTable } from './hooks/useEnableTable'

let {
  queryFormRef,
  queryParams,
  list,
  tableOptions,
  loading,
  total,
  selectionList,
  handleSelectionChange,
  getList,
  getSearchFormData,
  searchFormOptions,
  handleQuery,
  resetQuery
} = useEnableTable()

defineOptions({ name: 'EnableList' })

const dialogVisible = ref(false) // 弹窗的是否展示

/** 打开弹窗 */
const open = async (warehouseId: number) => {
  const addQuery = (queryParams) => {
    queryParams.warehouseId = warehouseId
  }
  dialogVisible.value = true
  resetQuery(addQuery)
  // await nextTick() // 等待，避免 queryFormRef 为空
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交选择 */
const emits = defineEmits<{
  (e: 'success', value: any): void
}>()
const submitForm = () => {
  try {
    emits('success', selectionList.value)
  } finally {
    // 关闭弹窗
    dialogVisible.value = false
  }
}
</script>
