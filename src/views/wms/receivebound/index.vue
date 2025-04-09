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
      </template>
    </SmForm>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap :bodyStyle="{ padding: '20px', 'padding-bottom': 0 }">
    <SmTable
      border
      :loading="loading"
      :options="tableOptions"
      :data="list"
      :total="total"
      v-model:currentPage="queryParams.pageNo"
      v-model:pageSize="queryParams.pageSize"
      @pagination="getList"
    >
      <template #operate="{ scope }">
        <el-button
          link
          type="primary"
          @click="openForm(OPERATE_MAP['update-actual-quantity'], scope.row.id)"
          v-hasPermi="['wms:receivebound:update-actual-quantity']"
        >
          收货
        </el-button>
        <el-button
          link
          type="warning"
          @click="openForm(OPERATE_MAP.abandon, scope.row.id)"
          v-hasPermi="['wms:receivebound:abandon']"
        >
          作废
        </el-button>
        <el-button
          link
          type="danger"
          @click="openForm(OPERATE_MAP['force-finish'], scope.row.id)"
          v-hasPermi="['wms:receivebound:force-finish']"
        >
          强制完成
        </el-button>
      </template>
    </SmTable>
  </ContentWrap>
  <!-- 表单弹窗：添加/修改 -->
  <OpenForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter, dateFormatter2 } from '@/utils/formatTime'
import download from '@/utils/download'
import { InboundApi, InboundVO } from '@/api/wms/inbound'
import { useSearchForm } from './hooks/search'
import { useTableData } from '@/components/SmTable/src/utils'
import { OPERATE_MAP } from './constant'
import OpenForm from './OpenForm.vue'

const { tableOptions, transformTableOptions, getItemProp } = useTableData()
// itemList-易仓上面没有展示

const fieldMap = {
  no: '入库单号',
  warehouseName: '仓库名称',

  type: {
    label: '入库单类型',
    slot: 'type',
    dictAttrs: { type: DICT_TYPE.WMS_INBOUND_TYPE }
  },
  auditStatus: {
    label: '审核状态',
    slot: 'auditStatus',
    dictAttrs: { type: DICT_TYPE.WMS_INBOUND_AUDIT_STATUS }
  },
  shippingMethod: {
    label: '运输方式',
    slot: 'shippingMethod',
    dictAttrs: { type: DICT_TYPE.WMS_SHIPPING_METHOD }
  },
  traceNo: '跟踪号',
  initAge: {
    label: '初始库龄',
    width: '100px'
  },

  arrivalPlanTime: {
    label: '实际到货时间',
    formatter: dateFormatter2,
    width: '200px'
  },
  arrivalActualTime: {
    label: '计到货时间',
    formatter: dateFormatter2,
    width: '200px'
  },
  creatorComment: '特别说明',
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
tableOptions.value = transformTableOptions(fieldMap, { allWrap: true })

/** 收货管理 列表 */
defineOptions({ name: 'WmsReceivebound' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<InboundVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  no: '',
  type: undefined,
  warehouseId: undefined,
  auditStatus: 1, // 待审批
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
  queryParams.auditStatus = 1 // 1待审批
  loading.value = true
  try {
    const data = await InboundApi.getInboundPage(queryParams)
    list.value = getItemProp(data.list, ['warehouse','product'])
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

onActivated(() => {
  const routeQuery = window.getRouteQuery && window.getRouteQuery()
  if (routeQuery) {
    const { no } = routeQuery
    queryParams.no = no
  }
  getList()
})

/** 初始化 **/
// onMounted(() => {
//   getList()
// })
</script>
