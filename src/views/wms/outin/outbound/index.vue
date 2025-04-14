<template>
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
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['wms:outbound:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['wms:outbound:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
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
          @click="openForm('detail', scope.row.id)"
          v-hasPermi="['wms:outbound:query']"
        >
          详情
        </el-button>
        <el-button
          link
          type="primary"
          @click="openForm('update', scope.row.id)"
          v-hasPermi="['wms:outbound:update']"
        >
          编辑
        </el-button>
        <el-button
          link
          type="danger"
          @click="handleDelete(scope.row.id)"
          v-hasPermi="['wms:outbound:delete']"
        >
          删除
        </el-button>
      </template>
    </SmTable>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <OutboundForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { OutboundApi, OutboundVO } from '@/api/wms/outbound'
import OutboundForm from './OutboundForm.vue'
import { getItemProp, useTableData } from '@/components/SmTable/src/utils'
import { useSearchForm } from './hooks/search'

const { tableOptions, transformTableOptions } = useTableData()

//
const fieldMap = {
  // status: {
  //   label: '状态',
  //   slot: 'status',
  //   dictAttrs: { type: DICT_TYPE.WMS_VALID_STATUS }
  // },
  no: '单据号',
  warehouseName: '仓库名称',
  auditStatus: {
    label: '审核状态',
    slot: 'auditStatus',
    dictAttrs: { type: DICT_TYPE.WMS_OUTBOUND_AUDIT_STATUS }
  },
  type: {
    label: '类型',
    slot: 'status',
    dictAttrs: { type: DICT_TYPE.WMS_OUTBOUND_TYPE }
  },
  outboundStatus: {
    label: '出库状态',
    slot: 'outboundStatus',
    dictAttrs: { type: DICT_TYPE.WMS_OUTBOUND_STATUS }
  },
  companyName: '库存主体',
  deptName: '库存归属',
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
tableOptions.value = transformTableOptions(fieldMap, {
  noWidth: true,
  wrapList: ['warehouseName', 'deptName', 'companyName', 'creatorComment']
})

/** 出库单 列表 */
defineOptions({ name: 'WmsOutbound' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<OutboundVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  no: undefined,
  warehouseId: undefined,
  type: undefined,
  status: undefined,
  auditStatus: undefined,
  sourceBillId: undefined,
  sourceBillNo: undefined,
  sourceBillType: undefined,
  creatorComment: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await OutboundApi.getOutboundPage(queryParams)
    list.value = getItemProp(data.list, ['warehouse', 'dept', 'company'])
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
    await OutboundApi.deleteOutbound(id)
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
    const data = await OutboundApi.exportOutbound(queryParams)
    download.excel(data, '出库单.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

const { getSearchFormData, searchFormOptions } = useSearchForm(handleQuery, queryParams)

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
