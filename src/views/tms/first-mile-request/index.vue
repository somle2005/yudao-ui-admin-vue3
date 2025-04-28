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

const { tableOptions, transformTableOptions } = useTableData()

const fieldMap = {
  code: '单据编码',
  requestUserName: '申请人名称',
  requestDeptName: '申请部门名称',
  toWarehouseName: '目的仓名称',
  totalWeight: '总重量(kg)',
  totalVolume: '总体积(m³)',
  itemCount: '明细数量',

  auditStatus: {
    label: '审核状态',
    slot: 'auditStatus',
    dictAttrs: { type: DICT_TYPE.SRM_AUDIT_STATUS }
  },
  orderStatus: {
    label: '审核状态',
    slot: 'orderStatus',
    dictAttrs: { type: DICT_TYPE.SRM_ORDER_STATUS }
  },
  offStatus: {
    label: '关闭状态',
    slot: 'offStatus',
    dictAttrs: { type: DICT_TYPE.SRM_OFF_STATUS }
  },

  // comment: '审批意见',
  // remark: '备注',
  // updateTime: {
  //   label: '更新时间',
  //   formatter: dateFormatter,
  //   width: '200px'
  // },
  // updaterName: '更新人',
  createTime: {
    label: '创建时间',
    formatter: dateFormatter,
    width: '200px'
  },
  // creatorName: '创建人',
  operate: {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '200px'
  }
}
tableOptions.value = transformTableOptions(fieldMap, {
  wrapList: ['code'],
  noComputePropList: ['code', 'auditStatus', 'orderStatus', 'offStatus']
})

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

const { getSearchFormData, searchFormOptions } = useSearchForm(handleQuery, queryParams)

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
