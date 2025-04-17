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
      <!-- <template #operate="{ scope }">
         <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['wms:stock-flow:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['wms:stock-flow:delete']"
          >
            删除
          </el-button>
      </template> -->
    </SmTable>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <StockFlowForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { StockFlowApi, StockFlowVO } from '@/api/wms/stock-flow'
import StockFlowForm from './StockFlowForm.vue'
import { useSearchForm } from './hooks/search'
import { useTableData } from '@/components/SmTable/src/utils'

const { tableOptions, transformTableOptions, getItemPropList } = useTableData()

const fieldMap = {
  warehouseName: '仓库名称',
  // zoneName: '库区名称',
  // binName: '库位名称',
  productBarCode: '产品编码',
  productName: '产品名称',
  stockType: {
    label: '库存类型',
    slot: 'stockType',
    dictAttrs: { type: DICT_TYPE.WMS_STOCK_TYPE }
  },
  direction: {
    label: '库存流水方向',
    width: '250px',
    slot: 'direction',
    dictAttrs: { type: DICT_TYPE.WMS_STOCK_FLOW_DIRECTION }
  },
  inboundNo: '入库单号',
  outboundNo: '出库单号',
  pickupNo: '拣货单号',
  reason: '流水原因',

  availableQty: '可用量',
  deltaQty: '变更量',
  outboundPendingQty: '待出库量',
  purchasePlanQty: '采购计划量',
  purchaseTransitQty: '采购在途量',
  returnTransitQty: '退件在途数量',
  sellableQty: '可售量',
  shelvingPendingQty: '待上架数量',

  flowTime: {
    label: '流水发生时间',
    formatter: dateFormatter,
    width: '200px'
  },
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
  creatorName: '创建人'
  // operate: {
  //   label: '操作',
  //   slot: 'operate',
  //   fixed: 'right',
  //   width: '200px'
  // }
}
tableOptions.value = transformTableOptions(fieldMap, { allWrap: true })

/** 库存流水 列表 */
defineOptions({ name: 'WmsStockFlow' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<StockFlowVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  stockType: undefined,
  stockId: undefined,
  reason: undefined,
  reasonBillId: undefined,
  reasonItemId: undefined,
  prevFlowId: undefined,
  deltaQuantity: undefined,
  purchasePlanQuantity: undefined,
  purchaseTransitQuantity: undefined,
  returnTransitQuantity: undefined,
  pendingShelvingQuantity: undefined,
  availableQuantity: undefined,
  sellableQuantity: undefined,
  pendingOutboundQuantity: undefined,
  defectiveQuantity: undefined,
  flowTime: [],
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await StockFlowApi.getStockFlowPageOwnership(queryParams)
    list.value = getItemPropList(data.list, [
      { prop: 'warehouse', keyList: ['name'] },
      { prop: 'bin', keyList: ['name'] },
      { prop: 'zone', keyList: ['name'] },
      { prop: 'product', keyList: ['name', 'barCode'] },
      { prop: 'inbound', keyList: ['no'] },
      { prop: 'outbound', keyList: ['no'] },
      { prop: 'pickup', keyList: ['no'] }
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
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await StockFlowApi.deleteStockFlow(id)
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
    const data = await StockFlowApi.exportStockFlow(queryParams)
    download.excel(data, '库存流水.xls')
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
