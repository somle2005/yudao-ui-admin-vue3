<template>
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
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['tms:first-mile-request:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['tms:first-mile-request:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>

        <el-button
          :disabled="disabledBtn"
          type="primary"
          plain
          @click="handleUpdateStatusEnableBatch(true)"
          v-hasPermi="['tms:first-mile-request:item-off']"
        >
          开启
        </el-button>

        <el-button
          :disabled="disabledBtn"
          plain
          @click="handleUpdateStatusEnableBatch(false)"
          v-hasPermi="['tms:first-mile-request:item-off']"
        >
          关闭
        </el-button>

        <el-button
          :disabled="disabledBtn"
          type="primary"
          plain
          @click="handleSubmitAuditBatch"
          v-hasPermi="['tms:first-mile-request:submit-audit']"
        >
          提交审核
        </el-button>

        <el-dropdown
          :disabled="oneSelectDisabledBtn"
          class="ml-10px"
          split-button
          type="primary"
          v-hasPermi="['tms:first-mile-request:audit-status']"
        >
          <div @click="handleUpdateStatus(selectionList[0], true)">审核</div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <div @click="handleUpdateStatus(selectionList[0], false)">反审核</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-button
          :disabled="disabledBtn"
          class="ml-10px"
          type="primary"
          plain
          @click="handleMerge"
          v-hasPermi="['tms:first-mile-request:merge']"
        >
          合并
        </el-button>

        <el-switch
          v-model="wholeOrderEnable"
          active-text="整单"
          class="ml-10px"
          @change="handleWholeOrderEnable"
        />
      </template>
    </SmForm>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap :bodyStyle="{ padding: '20px', 'padding-bottom': 0 }">
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
      <template #request="{ scope }">
        <div class="common-text">申请人:{{ scope.row.requestUserName }}</div>
        <div class="common-text">申请部门:{{ scope.row.requestDeptName }}</div>
      </template>

      <template #itemsPackage="{ scope }">
        <div class="common-text">包装长:{{ scope.row.itemsPackageLength }}</div>
        <div class="common-text">包装宽:{{ scope.row.itemsPackageWidth }}</div>
        <div class="common-text">包装高:{{ scope.row.itemsPackageHeight }}</div>
      </template>

      <template #operate="{ scope }">
        <el-button
          link
          type="primary"
          @click="openForm('update', scope.row.id)"
          v-hasPermi="['tms:first-mile-request:update']"
        >
          编辑
        </el-button>
        <el-button
          link
          type="danger"
          @click="handleDelete(scope.row.id)"
          v-hasPermi="['tms:first-mile-request:delete']"
        >
          删除
        </el-button>
      </template>
    </SmTable>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <FirstMileRequestForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { FirstMileRequestApi, FirstMileRequestVO } from '@/api/tms/first-mile-request'
import FirstMileRequestForm from './FirstMileRequestForm.vue'
import { useSearchForm } from './hooks/search'
import { useTableData } from '@/components/SmTable/src/utils'
import { useBatch } from './hooks/useBatch'
import { useTable } from './hooks/useTable'


let {
  allOptions,
  tableOptions,

  wholeOrderEnable,
  itemsList,
  wholeOrderList,
  itemsTotal,
  wholeOrderTotal,

  switchList,
  useWholeOrder
} = useTable()

/** 头程申请单 列表 */
defineOptions({ name: 'TmsFirstMileRequest' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<FirstMileRequestVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  id: undefined,
  createTime: [],
  code: undefined,
  requestUserId: undefined,
  requestDeptId: undefined,
  toWarehouseId: undefined,
  auditStatus: undefined,
  orderStatus: undefined,
  offStatus: undefined,
  totalWeight: [],
  totalVolume: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await FirstMileRequestApi.getFirstMileRequestPage(queryParams)
    // list.value = data.list
    // total.value = data.total
    switchList(list, total, data)
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number, data?: any) => {
  formRef.value.open(type, id, data)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await FirstMileRequestApi.deleteFirstMileRequest(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await FirstMileRequestApi.exportFirstMileRequest(queryParams)
    download.excel(data, '头程申请单.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 选中操作 */
const selectionList = ref<any[]>([])
const handleSelectionChange = (rows: any[]) => {
  selectionList.value = rows
}

const { getSearchFormData, searchFormOptions } = useSearchForm(handleQuery, queryParams)

const {
  disabledBtn,
  oneSelectDisabledBtn,
  handleUpdateStatus,
  handleSubmitAuditBatch,
  handleUpdateStatusEnableBatch,
  handleMerge
} = useBatch(wholeOrderEnable, selectionList, getList, openForm)

const { handleWholeOrderEnable } = useWholeOrder(
  allOptions,
  tableOptions,
  selectionList,
  list,
  total,
  itemsList,
  itemsTotal,
  wholeOrderList,
  wholeOrderTotal
)

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
