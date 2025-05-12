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
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['wms:stock-ownership:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>

        <el-button
          type="success"
          plain
          @click="handleImport"
          :loading="exportLoading"
          v-hasPermi="['wms:stock-ownership-move:import']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 批量调归属
        </el-button>
      </template>
    </SmForm>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap :bodyStyle="{ padding: '20px', 'padding-bottom': 0 }">
    <SmTable
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
          :loading="exportLoading"
          @click="openForm(OPERATE_MAP.moveOwnership, undefined, scope.row)"
          v-hasPermi="['wms:stock-ownership-move:create']"
        >
          调归属
        </el-button>

        <!-- <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['wms:stock-ownership:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['wms:stock-ownership:delete']"
          >
            删除
          </el-button> -->
      </template>
    </SmTable>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <StockOwnershipForm ref="formRef" @success="getList" />

  <SmImportFile
    ref="smImportFileRef"
    :importUrlFn="StockOwnershipMoveApi.importStockOwnershipMove"
    :templateObj="templateObj"
  />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { StockOwnershipApi, StockOwnershipVO } from '@/api/wms/stock-ownership'
import StockOwnershipForm from './StockOwnershipForm.vue'
import { useSearchForm } from './hooks/search'
import { useTableData } from '@/components/SmTable/src/utils'
import { StockOwnershipMoveApi } from '@/api/wms/stock-ownership-move'
import { OPERATE_MAP } from './constant/index'
import * as CustomerApi from '@/api/crm/customer'

const { tableOptions, transformTableOptions, getItemPropList } = useTableData()

const fieldMap = {
  warehouseName: '仓库',
  productBarCode: '产品编码',
  productName: '产品名称',
  deptName: '库存归属',
  companyName: '库存主体',
  availableQty: '可用数',
  outboundPendingQty: '待出库数',
  shelvingPendingQty: '待上架数',

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
    width: '100px'
  }
}
tableOptions.value = transformTableOptions(fieldMap, {
  allWrap: true,
  noComputePropList: ['warehouseName', 'productName', 'productBarCode']
})

/** 所有者库存 列表 */
defineOptions({ name: 'WmsStockOwnership' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<StockOwnershipVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  warehouseId: undefined,
  productId: undefined,
  productSku: undefined,
  inventorySubjectId: undefined,
  inventoryOwnerId: undefined,
  availableQuantity: undefined,
  pendingOutboundQuantity: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await StockOwnershipApi.getStockOwnershipPage(queryParams)
    list.value = getItemPropList(data.list, [
      { prop: 'warehouse', keyList: ['mode', 'name', 'code'] },
      { prop: 'dept', keyList: ['name'] },
      { prop: 'company', keyList: ['name'] },
      { prop: 'product', keyList: ['name', 'barCode'] }
    ]) as any[]

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
const openForm = (type: string, id?: number, row?: any) => {
  formRef.value.open(type, id, row)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await StockOwnershipApi.deleteStockOwnership(id)
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
    const data = await StockOwnershipApi.exportStockOwnership(queryParams)
    download.excel(data, '库存归属.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

const { getSearchFormData, searchFormOptions } = useSearchForm(handleQuery, queryParams)

const templateObj = ref({
  url: CustomerApi.importCustomerTemplate,
  name: '调归属模版.xls'
})
const smImportFileRef = ref()
/** 导入按钮操作 */
const handleImport = async () => {
  smImportFileRef.value.open()
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
