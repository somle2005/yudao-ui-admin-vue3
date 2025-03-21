<!-- 可付款的采购入库单列表 选择采购申请项（仅展示已审核）-->
<template>
  <Dialog title="选择采购入库（仅展示可付款）" v-model="dialogVisible" width="1000">
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
        <template #reconciliationStatus="{ scope }">
          <ElTag :type="RECONCILIATION_STSTUS_MAP[scope.row.reconciliationStatus]?.colorType">
            {{ RECONCILIATION_STSTUS_MAP[scope.row.reconciliationStatus]?.label }}
          </ElTag>
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
import { resetQueryParams } from '@/utils/transformData'
import { useSearchForm } from '../hooks/search'
import { RECONCILIATION_STSTUS_MAP } from '@/utils/constant'
import { PurchaseInApi } from '@/api/erp/purchase/in'
import { useTable } from './hooks/useTable'

// 暂时都是分行展示逻辑

defineOptions({ name: 'EnableList' })

const dialogVisible = ref(false) // 弹窗的是否展示

const queryFormRef = ref() // 搜索的表单
const selectionList = ref<any[]>([])

const loading = ref(false)
const total = ref(0)
const list = ref<any[]>([]) // 列表的数据

// 注意外面都要用let
// eslint-disable-next-line prefer-const
let queryParams: any = reactive({})


let {
  allOptions,
  tableOptions,

  wholeOrderEnable,
  itemsList,
  wholeOrderList,
  itemsTotal,
  wholeOrderTotal,

  wholeOrderMergeCompute,
  mergeItemsToList,
  switchList,
  useWholeOrder
} = useTable()

// 这里只有整单展示了-退货单是整单退货-带出子项所有id
const getList = async () => {
  loading.value = true
  try {
    const data = await PurchaseInApi.getPurchaseInPage(queryParams)

    // todo取出items里面对应对象数据

    data.list.forEach((item) => {
      if (!item?.items?.length) return
      item.items.forEach((a) => {
        if (a.product) {
          a.productName = a.product.name
          a.productBarCode = a.product.barCode
        }

        item.itemApplicantName = item.applicantName
        item.itemApplicationDeptName = item.applicationDeptName
      })
    })

    wholeOrderList.value = wholeOrderMergeCompute(data.list, allOptions)
    // itemsList.value = mergeItemsToList(data.list, {
    //   id: 'rowItemsId',
    //   status: 'rowStatus',
    //   orderStatus: 'rowOrderStatus',
    //   offStatus: 'rowOffStatus',
    //   executeStatus: 'rowExecuteStatus',
    //   inStatus: 'rowInStatus',
    //   payStatus: 'rowPayStatus'
    // })

    switchList(list, total, data)
    // list.value = data.list
    // total.value = data.total
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  queryParams.pageNo = 1
  selectionList.value = []
  getList()
}

const handleSelectionChange = (rows: any[]) => {
  selectionList.value = rows
}

const { getSearchFormData, searchFormOptions } = useSearchForm(handleQuery, queryParams)

const resetQuery = () => {
  resetQueryParams(queryParams, queryFormRef)
  handleQuery()
}

/** 提交选择 */
const emits = defineEmits<{
  (e: 'success', value: any[]): void
}>()
const submitForm = () => {
  try {
    emits('success', selectionList.value)
  } finally {
    // 关闭弹窗
    dialogVisible.value = false
  }
}

/** 打开弹窗 */
const open = async () => {
  dialogVisible.value = true
  resetQuery()
  // await nextTick() // 等待，避免 queryFormRef 为空
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>
