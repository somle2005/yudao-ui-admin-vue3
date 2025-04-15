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
          v-hasPermi="['wms:inbound:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>

        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['wms:inbound:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>

        <el-button
          :disabled="oneSelectDisabledBtn"
          type="primary"
          plain
          @click="handleSubmitAuditBatch"
          v-hasPermi="['wms:inbound:submit']"
        >
          提交审核
        </el-button>

        <el-button
          :disabled="oneSelectDisabledBtn"
          type="primary"
          @click="openForm('audit', selectionList[0]?.id)"
          v-hasPermi="['wms:inbound:agree', 'wms:inbound:reject']"
        >
          审核
        </el-button>
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
      @selection-change="handleSelectionChange"
      @pagination="getList"
    >
      <template #no="{ scope }">
        <div class="slot-wrap">
          <el-link type="primary" target="_blank" @click="toReceivebound(scope.row)">
            {{ scope.row.no }}
          </el-link>
        </div>
      </template>
      <template #operate="{ scope }">
        <el-button
          link
          @click="openForm('detail', scope.row.id)"
          v-hasPermi="['wms:inbound:query']"
        >
          详情
        </el-button>
        <!-- 待审核才出现 -->
        <!-- <el-button
          link
          type="primary"
          @click="openForm('audit', scope.row.id)"
          v-hasPermi="['wms:inbound:agree', 'wms:inbound:reject']"
          v-if="scope.row.auditStatus === 1"
        >
          审核
        </el-button> -->
        <el-button
          link
          type="primary"
          @click="openForm('update', scope.row.id)"
          v-hasPermi="['wms:inbound:update']"
        >
          编辑
        </el-button>
        <el-button
          link
          type="danger"
          @click="handleDelete(scope.row.id)"
          v-hasPermi="['wms:inbound:delete']"
        >
          删除
        </el-button>
      </template>
    </SmTable>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <InboundForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter, dateFormatter2 } from '@/utils/formatTime'
import download from '@/utils/download'
import { InboundApi, InboundVO } from '@/api/wms/inbound'
import InboundForm from './InboundForm.vue'
import { useSearchForm } from './hooks/search'
import { useTableData } from '@/components/SmTable/src/utils'
import { useBatch } from './hooks/useBatch'
import { getLastListProp } from '@/utils/transformData'

const { tableOptions, transformTableOptions, getItemProp } = useTableData()
// itemList-易仓上面没有展示

const fieldMap = {
  no: {
    label: '入库单号',
    slot: 'no',
    width: '200px'
  },
  warehouseName: '仓库名称',

  type: {
    label: '入库单类型',
    slot: 'type',
    dictAttrs: { type: DICT_TYPE.WMS_INBOUND_TYPE }
  },
  // status: {
  //   label: '状态',
  //   slot: 'status',
  //   dictAttrs: { type: DICT_TYPE.WMS_INBOUND_STATUS }
  // },
  auditStatus: {
    label: '状态',
    slot: 'auditStatus',
    dictAttrs: { type: DICT_TYPE.WMS_INBOUND_AUDIT_STATUS }
  },
  shippingMethod: {
    label: '运输方式',
    slot: 'shippingMethod',
    dictAttrs: { type: DICT_TYPE.WMS_SHIPPING_METHOD }
  },
  traceNo: '跟踪号',
  // initAge: {
  //   label: '初始库龄',
  //   width: '100px'
  // },

  arrivalPlanTime: {
    label: '预计到货时间',
    formatter: dateFormatter2,
    width: '200px'
  },
  arrivalActualTime: {
    label: '实际到货时间',
    formatter: dateFormatter2,
    width: '200px'
  },
  creatorComment: '特别说明',
  // comment: '审批意见',
  updateTime: {
    label: '更新时间',
    formatter: dateFormatter,
    width: '200px'
  },
  updaterName: '更新人',
  createTime: {
    label: '创建时间',
    formatter: dateFormatter,
    width: '200px'
  },
  creatorName: '创建人',
  operate: {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '200px'
  }
}
tableOptions.value = transformTableOptions(fieldMap, { allWrap: true, allWrapIgnoreList: ['no'] })

/** 入库单 列表 */
defineOptions({ name: 'WmsInbound' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<InboundVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  no: undefined,
  type: undefined,
  warehouseId: undefined,
  status: undefined,
  sourceBillId: undefined,
  sourceBillNo: undefined,
  sourceBillType: undefined,
  referNo: undefined,
  traceNo: undefined,
  shippingMethod: undefined,
  arrivalPlanTime: [],
  arrivalActualTime: [],
  creatorComment: undefined,
  initAge: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await InboundApi.getInboundPage(queryParams)
    list.value = getItemProp(data.list, ['warehouse']).map((item: any) => {
      item.comment = getLastListProp(item.approvalHistoryList, 'comment')
      return item
    })
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
    await InboundApi.deleteInbound(id)
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
    const data = await InboundApi.exportInbound(queryParams)
    download.excel(data, '入库单.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

const { getSearchFormData, searchFormOptions } = useSearchForm(handleQuery, queryParams)

const router = useRouter()
const toReceivebound = (row) => {
  window.getRouteQuery = () => {
    try {
      return {
        no: row.no,
        id: row.id
      }
    } finally {
      window.getRouteQuery = null as any
    }
  }
  router.push({
    path: `/wms/receivebound`
  })
}

/** 选中操作 */
const selectionList = ref<any[]>([])
const handleSelectionChange = (rows: any[]) => {
  selectionList.value = rows
}

const { disabledBtn, handleSubmitAuditBatch } = useBatch(selectionList, getList)
// 暂时提交审核是单选
const oneSelectDisabledBtn = computed(() => selectionList.value.length !== 1)

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
