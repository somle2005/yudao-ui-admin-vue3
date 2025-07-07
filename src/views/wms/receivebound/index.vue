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
          <!-- <el-dropdown
          :disabled="oneSelectDisabledBtn"
          class="ml-10px"
          split-button
          type="primary"
          v-hasPermi="['wms:exchange:audit']"
        >
          <div @click="handleUpdateStatus(selectionList[0], true)">审核(权限字符-后端给后修改)</div>
        </el-dropdown> -->
      </template>
    </SmForm>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap :bodyStyle="{ padding: '20px', 'padding-bottom': 0 }">
    <SmTable
      isTabledField
      :tableFieldOptions="tableFieldOptions"
      :tableFieldKey="tableFieldKey"
      @table-field-confirm="tableFieldConfirm"
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
          @click="openForm('detail', scope.row.id)"
          v-hasPermi="['wms:inbound:query']"
        >
          详情
        </el-button>
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
          type="primary"
          @click="openForm(OPERATE_MAP['update-actual-quantity'], scope.row.id)"
          v-if="hasAllPermission(['wms:inbound-item:update', 'wms:inbound:agree'])"
        >
          收货
        </el-button>
        <el-button
          link
          type="warning"
          @click="openForm(OPERATE_MAP.abandon, scope.row.id)"
          v-hasPermi="['wms:inbound:abandon']"
          v-if="isAbandon(scope.row.auditStatus)"
        >
          作废
        </el-button>
        <el-button
          link
          type="danger"
          @click="openForm(OPERATE_MAP['force-finish'], scope.row.id)"
          v-hasPermi="['wms:inbound:force-finish']"
        >
          强制完成
        </el-button>
        <!-- <el-button
          link
          type="primary"
          @click="openForm(OPERATE_MAP['update-actual-quantityAndPickup'], scope.row.id)"
          v-if="hasAllPermission(['wms:inbound-item:update', 'wms:pickup:create'])"
        >
          收货并上架
        </el-button> -->
        <el-button
          link
          type="primary"
          @click="toPickUp"
          v-if="hasAllPermission(['wms:pickup:create'])"
        >
          上架
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
import { OPERATE_MAP } from '@/views/wms/common/constants/index'
import OpenForm from './OpenForm.vue'
import { cloneDeep } from 'lodash-es'
import { hasAllPermission } from '@/directives/permission/hasPermi'
import { isAbandon } from '../common/utils'
import { useTableField } from '@/components/SmTableField/src/hooks'

const router = useRouter()
const toPickUp = () => {
  window.getRouteQuery = () => {
    try {
      return {
        routeJump: true
      }
    } finally {
      window.getRouteQuery = null as any
    }
  }
  router.push({
    path: `/wms/pickup`
  })
}

const { tableOptions, transformTableOptions, getItemProp } = useTableData()
// itemList-易仓上面没有展示

const fieldMap = {
  code: '入库单号',
  upstreamCode: '上游单据编号',
  warehouseName: '仓库',

  upstreamType: {
    // label: '上游单据类型',
    label: '入库单类型',
    width: '160px',
    slot: 'upstreamType',
    dictAttrs: { type: DICT_TYPE.WMS_INBOUND_TYPE }
  },

  // type: {
  //   label: '入库单类型',
  //   slot: 'type',
  //   dictAttrs: { type: DICT_TYPE.WMS_INBOUND_TYPE }
  // },
  auditStatus: {
    label: '审核状态',
    slot: 'auditStatus',
    dictAttrs: { type: DICT_TYPE.WMS_INBOUND_AUDIT_STATUS }
  },
  inboundStatus: {
    label: '入库状态',
    slot: 'inboundStatus',
    dictAttrs: { type: DICT_TYPE.WMS_INBOUND_STATUS }
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
    label: '计划到货时间',
    formatter: dateFormatter2,
    width: '200px'
  },
  arrivalActualTime: {
    label: '实际到货时间',
    formatter: dateFormatter2,
    width: '200px'
  },
  remark: '备注',
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
    width: '320px'
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
  code: '',
  type: undefined,
  warehouseId: undefined,
  auditStatus: 1, // 待审批
  upstreamId: undefined,
  upstreamCode: undefined,
  upstreamType: undefined,
  referNo: undefined,
  traceNo: undefined,
  shippingMethod: undefined,
  // arrivalPlanTime: [],
  // arrivalActualTime: [],
  remark: undefined,
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
    list.value = getItemProp(data.list, ['warehouse', 'product'])
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

const tableFieldKey = '/wms/inbound/page' + '-' + 'receivebound' // WMS很多页面可能复用一个接口
const { createTableFiledOptions, tableFieldOptions, tableFieldConfirm } = useTableField(
  tableOptions,
  tableFieldKey
)

onActivated(() => {
  const routeQuery = window.getRouteQuery && window.getRouteQuery()
  if (routeQuery?.no) {
    const { no } = routeQuery
    queryParams.no = no
    queryFormRef.value.initForm()
  }
  getList()
  createTableFiledOptions()
})
</script>
