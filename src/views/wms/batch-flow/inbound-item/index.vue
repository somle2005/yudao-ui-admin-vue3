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
          @click="handleImport"
          :loading="exportLoading"
          v-hasPermi="['wms:stock-bin-move:import']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 批量调整库位
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
          :loading="exportLoading"
          @click="openForm(OPERATE_MAP.moveBin, undefined, scope.row)"
          v-hasPermi="['wms:stock-bin-move:create']"
        >
          移库位
        </el-button>
        <!-- <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['wms:inbound-item:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
          v-hasPermi="['wms:inbound-item:delete']"
          >
            删除
          </el-button> -->
      </template>
    </SmTable>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <InboundItemForm ref="formRef" @success="getList" />

  <SmImportFile
    ref="smImportFileRef"
    v-model="importFile"
    :importUrlFn="StockBinMoveApi.importStockBinMove"
  />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { InboundItemApi, InboundItemVO } from '@/api/wms/inbound-item'
import InboundItemForm from './InboundItemForm.vue'
import { useTableData } from '@/components/SmTable/src/utils'
import { useSearchForm } from './hooks/search'
import { StockBinMoveApi } from '@/api/wms/stock-bin-move'
import { OPERATE_MAP } from './constant/index'

const { tableOptions, transformTableOptions, getItemPropList } = useTableData()

const fieldMap = {
  warehouseName: '仓库',
  binName: '库位',
  productBarCode: '产品编码',
  binAvailableQty: '库位库存',
  stockWarehouseTotalQty: '库存总数', // availableQty+shelvingPendingQty

  binOutboundPendingQty: '待出数量',
  inboundCode: '入库单号',
  stockType: {
    label: '存货类型',
    slot: 'stockType',
    dictAttrs: { type: DICT_TYPE.WMS_WAREHOUSE_ZONE_PARTITION_TYPE }
  },
  age: '库龄',
  updateTime: {
    label: '操作时间',
    formatter: dateFormatter,
    width: '200px'
  },

  operate: {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '100px'
  }

  // binSellableQty: '库位可售数量',
  // remark: '备注',
  // productName: '产品名称',

  // binName: '库位',
  // deptName: '库存归属',
  // companyName: '库存主体',
  // inboundDeptName: '入库库存归属',
  // inboundCompanyName: '入库库存归属',
  // inboundStatus: {
  //   label: '入库状态',
  //   slot: 'inboundStatus',
  //   dictAttrs: { type: DICT_TYPE.WMS_INBOUND_STATUS }
  // },

  // actualQty: '入库数量',

  // outboundAvailableQty: '批次剩余库存',
  // planQty: '计划入库量',
  // shelvedQty: '已上架数',

  // actualQty: '数量',
  // stockWarehouseAvailableQty: '总库存',
  // outboundAvailableQty: '待出数量',

  // updaterName: '更新人',
  // createTime: {
  //   label: '创建时间',
  //   formatter: dateFormatter,
  //   width: '200px'
  // }
  // creatorName: '创建人'
}
tableOptions.value = transformTableOptions(fieldMap, {
  allWrap: true,
  noComputePropList: [
    'inboundCode',
    'productName',
    'productBarCode',
    'warehouseName',
    'stockType',
    'remark'
  ]
})

// tableOptions.value[tableOptions.value.length - 1].width = undefined

/** 入库单详情 列表 */
defineOptions({ name: 'WmsInboundItem' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<InboundItemVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  inboundId: undefined,
  productId: undefined,
  productSku: undefined,
  planQty: undefined,
  actualQty: undefined,
  leftQty: undefined,
  sourceItemId: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await InboundItemApi.getInboundItemPageBin(queryParams)
    list.value = getItemPropList(data.list, [
      { prop: 'warehouse', keyList: ['name'] },
      // { prop: 'bin', keyList: ['name'] },
      { prop: 'product', keyList: ['name', 'barCode'] },
      { prop: 'inbound', keyList: ['code'] },
      { prop: 'dept', keyList: ['name'] },
      { prop: 'company', keyList: ['name'] },
      { prop: 'inboundDept', keyList: ['name'] },
      { prop: 'inboundCompany', keyList: ['name'] },
      { prop: 'stockWarehouse', keyList: ['totalQty'] }
    ]) as any
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
    await InboundItemApi.deleteInboundItem(id)
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
    const data = await InboundItemApi.exportInboundItem(queryParams)
    download.excel(data, '入库单详情.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

const importFile = ref()
const smImportFileRef = ref()
/** 导入按钮操作 */
const handleImport = async () => {
  smImportFileRef.value.open()
}

const { getSearchFormData, searchFormOptions } = useSearchForm(handleQuery, queryParams)

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
