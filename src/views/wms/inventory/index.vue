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
          v-hasPermi="['wms:inventory:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <!-- <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['wms:inventory:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button> -->

        <!-- <el-button
          v-hasPermi="['wms:inbound-item:import']"
          plain
          type="warning"
          @click="handleImportBinExcel"
        >
          <Icon icon="ep:upload" />
          导入盘点结果
        </el-button>
        <el-button
          v-hasPermi="['wms:inbound-item:import']"
          plain
          type="warning"
          @click="handleImportProductExcel"
        >
          <Icon icon="ep:upload" />
          导入盘点库位
        </el-button> -->
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
          v-hasPermi="['wms:inventory:query']"
        >
          详情
        </el-button>

        <el-button
          link
          type="success"
          @click="handleExport(scope.row.id)"
          v-hasPermi="['wms:inventory:export']"
          :loading="exportLoading"
        >
          导出
        </el-button>

        <!-- 'wms:inventory:submit' -->
        <el-button
          link
          type="primary"
          @click="openForm(OPERATE_MAP.inventory, scope.row.id)"
          v-if="hasAllPermission(['wms:inventory:update', 'wms:outbound:agree'])"
        >
          盘点
        </el-button>
        <el-button
          link
          type="danger"
          @click="openForm(OPERATE_MAP.abandon, scope.row.id)"
          v-hasPermi="['wms:inventory:abandon']"
        >
          作废
        </el-button>

        <el-button
          link
          type="primary"
          @click="openForm(OPERATE_MAP.append, scope.row.id)"
          v-if="hasAllPermission(['wms:inventory-bin:append'])"
        >
          追加盘点库位
        </el-button>

        <el-button
          link
          type="primary"
          @click="openForm('update', scope.row.id)"
          v-hasPermi="['wms:inventory:update']"
        >
          编辑
        </el-button>
        <el-button
          link
          type="danger"
          @click="handleDelete(scope.row.id)"
          v-hasPermi="['wms:inventory:delete']"
        >
          删除
        </el-button>
      </template>
    </SmTable>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <InventoryForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { InventoryApi, InventoryVO } from '@/api/wms/inventory'
import InventoryForm from './InventoryForm.vue'
import { useSearchForm } from './hooks/search'
import { useTableData } from '@/components/SmTable/src/utils'
import { OPERATE_MAP } from './constant'
import { hasAllPermission } from '@/directives/permission/hasPermi'
import { getLastListProp } from '@/utils/transformData'
import { InventoryBinApi } from '@/api/wms/inventory-bin'

const { tableOptions, transformTableOptions, getItemPropList } = useTableData()

// 可售数-可用数-待出库数-待上架数-不良品数-采购计划数-采购在途数-退件在途数-库龄

const fieldMap = {
  code: '盘点单号',
  warehouseName: '仓库',
  auditStatus: {
    label: '状态',
    slot: 'auditStatus',
    dictAttrs: { type: DICT_TYPE.WMS_INVENTORY_AUDIT_STATUS }
  },
  // comment: '审批意见',
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
    width: '400px'
  }
}
tableOptions.value = transformTableOptions(fieldMap, {
  noWidth: true,
  wrapList: ['code', 'warehouseName'],
  noComputePropListWidth: ['code','warehouseName'],
})

/** 盘点 列表 */
defineOptions({ name: 'WmsInventory' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<InventoryVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  no: undefined,
  warehouseId: undefined,
  auditStatus: undefined,
  creatorNotes: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await InventoryApi.getInventoryPage(queryParams)
    list.value = data.list.map((item) => {
      item.warehouseName = item?.warehouse?.name
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
    await InventoryApi.deleteInventory(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async (inventoryId: number) => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    // const data = await InventoryApi.exportInventory(queryParams)
    const data = await InventoryBinApi.exportInventoryBin({ inventoryId })
    download.excel(data, '盘点.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

const { getSearchFormData, searchFormOptions } = useSearchForm(handleQuery, queryParams)

const handleImportBinExcel = () => {
  // InventoryBinApi.importInventoryBinExcel
}
const handleImportProductExcel = () => {
  // handleImportProductExcel
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
