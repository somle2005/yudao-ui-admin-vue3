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
          v-hasPermi="['tms:first-mile:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['tms:first-mile:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>

        <el-button
          :disabled="disabledBtn"
          type="primary"
          plain
          @click="handleSubmitAuditBatch"
          v-hasPermi="['tms:first-mile:audit']"
        >
          提交审核
        </el-button>

        <el-dropdown
          :disabled="oneSelectDisabledBtn"
          class="ml-10px"
          split-button
          type="primary"
          v-hasPermi="['tms:first-mile:review']"
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
      <template #geometry="{ scope }">
        <div class="common-text">总箱数:{{ scope.row.totalBoxQty }}</div>
        <div class="common-text">数量:{{ scope.row.totalQty }}</div>
        <div class="common-text">重量:{{ scope.row.totalWeight }}</div>
        <div class="common-text">体积:{{ scope.row.totalVolume }}</div>
      </template>

      <template #loadOutbound="{ scope }">
        <div class="common-text">装柜日期:{{ formatDate(scope.row.packTime, 'YYYY-MM-DD') }}</div>
        <div class="common-text">出库时间:{{ formatDate(scope.row.outboundTime) }}</div>
      </template>
      <template #company="{ scope }">
        <div class="common-text">出口公司:{{ scope.row.exportCompanyShortName }}</div>
        <div class="common-text">中转公司:{{ scope.row.transitCompanyShortName }}</div>
      </template>

      <template #voyageNo="{ scope }">
        <div class="common-text">提单号:{{ scope.row.ladingNo }}</div>
        <div class="common-text">箱号:{{ scope.row.containerNo }}</div>
        <div class="common-text">航次:{{ scope.row.voyage }}</div>
      </template>

      <template #create="{ scope }">
        <div class="common-text">创建人:{{ scope.row.creator }}</div>
        <div class="common-text">创建时间:{{ formatDate(scope.row.createTime) }}</div>
      </template>

      <template #operate="{ scope }">
        <el-button
          link
          @click="openForm('detail', scope.row.id)"
          v-hasPermi="['tms:first-mile:query']"
        >
          详情
        </el-button>
        <el-button
          link
          type="primary"
          @click="openForm('update', scope.row.id)"
          v-hasPermi="['tms:first-mile:update']"
        >
          编辑
        </el-button>
        <el-button
          link
          type="danger"
          @click="handleDelete(scope.row.id)"
          v-hasPermi="['tms:first-mile:delete']"
        >
          删除
        </el-button>
      </template>
    </SmTable>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <FirstMileForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { FirstMileApi, FirstMileVO } from '@/api/tms/first-mile'
import FirstMileForm from './FirstMileForm.vue'
import { useSearchForm } from './hooks/search'
import { useTable } from './hooks/useTable'
import { formatDate } from '@/utils/formatTime'
import { useBatch } from './hooks/useBatch'
import { getMainItemBodyDataField } from '@/utils/transform'

let { tableOptions } = useTable()

/** 头程单 列表 */
defineOptions({ name: 'TmsFirstMile' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<FirstMileVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  createTime: [],
  code: undefined,
  billTime: [],
  carrierId: undefined,
  settlementDate: [],
  balance: undefined,
  auditorId: undefined,
  auditTime: [],
  auditStatus: undefined,
  toWarehouseId: undefined,
  ladingNo: undefined,
  cabinetType: undefined,
  packTime: [],
  arrivePlanTime: [],
  deliveryEstimateTime: [],
  deliveryActualTime: [],
  totalVolume: [],
  totalWeight: [],
  netWeight: [],
  totalValue: [],
  totalQty: [],
  remark: undefined,
  outboundStatus: undefined,
  outboundTime: [],
  inboundStatus: undefined,
  inboundTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const bodyData = getMainItemBodyDataField({
      queryParams,
      configList: [
        { name: 'mainQueryVO', fieldList: ['code', 'toWarehouseId', 'ladingNo', 'auditStatus'] },
        { name: 'itemPageReqVO', fieldList: ['productId', 'outboundStatus', 'inboundStatus'] },
        { name: 'trackingQueryVO', fieldList: [] }
      ]
    })

    const data = await FirstMileApi.getFirstMilePage(bodyData)
    // const data = await FirstMileApi.getFirstMilePage(queryParams)
    list.value = data.list
    total.value = data.total
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
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await FirstMileApi.deleteFirstMile(id)
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
    const data = await FirstMileApi.exportFirstMile(queryParams)
    download.excel(data, '头程单.xls')
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

const { disabledBtn, oneSelectDisabledBtn, handleUpdateStatus, handleSubmitAuditBatch } = useBatch(
  selectionList,
  getList,
  openForm
)

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
