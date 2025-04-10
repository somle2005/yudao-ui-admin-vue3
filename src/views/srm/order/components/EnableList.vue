<!-- 可入库的订单列表 -->
<template>
  <Dialog title="选择采购申请项（仅展示已审核）" v-model="dialogVisible" width="1000">
    <ContentWrap>
      <!-- 搜索工作栏 -->
      <SmForm
        class="-mb-15px"
        ref="queryFormRef"
        :inline="true"
        label-width="68px"
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
      >
        <template #auditStatus="{ scope }">
          <dict-tag :type="DICT_TYPE.ERP_AUDIT_STATUS" :value="scope.row.auditStatus || ''" />
        </template>

        <template #orderStatus="{ scope }">
          <dict-tag :type="DICT_TYPE.SRM_ORDER_STATUS" :value="scope.row.orderStatus || ''" />
        </template>

        <template #offStatus="{ scope }">
          <dict-tag :type="DICT_TYPE.SRM_OFF_STATUS" :value="scope.row.offStatus || ''" />
        </template>

        <template #rowOrderStatus="{ scope }">
          <dict-tag :type="DICT_TYPE.SRM_ORDER_STATUS" :value="scope.row.rowOrderStatus || ''" />
        </template>

        <template #rowOffStatus="{ scope }">
          <dict-tag :type="DICT_TYPE.SRM_OFF_STATUS" :value="scope.row.rowOffStatus || ''" />
        </template>
      </SmTable>
    </ContentWrap>
    <template #footer>
      <el-button @click="submitForm" type="primary"> 确 定 </el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { useApplicantTable } from '../hooks/useApplicantTable'
import { DICT_TYPE } from '@/utils/dict'

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
} = useApplicantTable()

defineOptions({ name: 'ErpPurchaseOrderOutEnableList' })

const dialogVisible = ref(false) // 弹窗的是否展示

/** 打开弹窗 */
const open = async () => {
  dialogVisible.value = true
  resetQuery()
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
