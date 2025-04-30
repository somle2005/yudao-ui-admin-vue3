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
      <template #deltaQty="{ scope }">
        <div class="green" v-if="scope.row.deltaQty > 0">+{{ scope.row.deltaQty }}</div>
        <div class="red" v-else-if="scope.row.deltaQty < 0">-{{ scope.row.deltaQty }}</div>
        <div v-else-if="scope.row.deltaQty === 0">{{ scope.row.deltaQty }}</div>
      </template>

      <template #operateNo="{ scope }">
        <div> 操作单号:{{ scope.row.outboundCode }} {{ scope.row.pickupCode }} </div>
        <div> 入库单号:{{ scope.row.inboundCode }} </div>
        <!-- <div> 出库单号:{{ scope.row.outboundCode }} </div>
        <div> 上架单号:{{ scope.row.pickupCode }} </div> -->
      </template>
      <template #codeType="{ scope }">
        <dict-tag
          :type="getCodeType(scope?.row?.reason)"
          :value="getCodeValue(scope.row, scope?.row?.reason)"
        />
      </template>

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
  productBarCode: '产品编码',
  productName: '产品名称',
  flowTime: {
    label: '操作时间', // 流水发生时间
    formatter: dateFormatter,
    width: '200px'
  },
  availableQty: '批次可用库存',
  deltaQty: {
    label: '库存变更',
    width: '100px',
    slot: 'deltaQty'
  },
  inboundItemFlowOutboundAvailableQty: '批次当前库存',
  warehouseName: '仓库名称',
  binName: '库位名称',

  stockWarehouseAvailableQty1: '仓库当前库存',
  stockWarehouseAvailableQty: '仓库可用库存',
  stockWarehouseSellableQty: '仓库可售库存',

  codeType: {
    label: '单据类型',
    width: '200px',
    slot: 'codeType'
  },

  operateNo: {
    label: '操作单号',
    slot: 'operateNo',
    width: '250px'
  },
  updaterName: '操作人'

  // reason: {
  //   label: '操作类型',
  //   width: '200px',
  //   slot: ' reason',
  //   dictAttrs: { type: DICT_TYPE.WMS_STOCK_REASON }
  // },

  // inboundCode: '入库单号',
  // outboundCode: '出库单号',
  // pickupCode: '上架单号',

  // direction: {
  //   label: '库存流水方向',
  //   width: '200px',
  //   slot: 'direction',
  //   dictAttrs: { type: DICT_TYPE.WMS_STOCK_FLOW_DIRECTION }
  // },

  // updateTime: {
  //   label: '更新时间',
  //   formatter: dateFormatter,
  //   width: '200px'
  // },
  // updaterName: '更新人',
  // createTime: {
  //   label: '创建时间',
  //   formatter: dateFormatter,
  //   width: '200px'
  // },
  // creatorName: '创建人'
  // operate: {
  //   label: '操作',
  //   slot: 'operate',
  //   fixed: 'right',
  //   width: '200px'
  // }
}
tableOptions.value = transformTableOptions(fieldMap, {
  allWrap: true,
  noComputePropList: ['productBarCode', 'productName']
})

const codeTypeList = [
  { name: '入库', type: 1, dictType: 'wms_inbound_status', getValue: 'inbound.inboundStatus' }, // split('.')[0][1]
  { name: '拣货', type: 2, dictType: 'wms_inbound_status', getValue: 'inbound.inboundStatus' },

  { name: '出库', type: 3, dictType: 'wms_outbound_type', getValue: 'outbound.type' },
  { name: '提交出库单', type: 4, dictType: 'wms_outbound_type', getValue: 'outbound.type' },
  { name: '拒绝出库单', type: 5, dictType: 'wms_outbound_type', getValue: 'outbound.type' }

  // 只有出库单-入库单状态
  // { name: '拒绝出库单', type: 6, dictType: 'wms_outbound_type', getValue: 'pickup.status' }, // 库位移动单等后端加字典

  // { name: '所有者移动单', type: 7, dictType: 'wms_move_execute_status', getValue: 'pickup.status' },

  // { name: '盘赢', type: 8, dictType: 'wms_inventory_audit_status', getValue: 'inventory.status' },
  // { name: '盘亏', type: 9, dictType: 'wms_inventory_audit_status', getValue: 'inventory.status' }
]

const getCodeType = (type: number) => {
  const item = codeTypeList.find((item) => item.type === type)
  if (item) {
    return DICT_TYPE[item.dictType.toUpperCase()]
  }
}

const getCodeValue = (row: any, type: number) => {
  const item = codeTypeList.find((item) => item.type === type)
  if (item) {
    const link = item.getValue.split('.')
    return row[link[0]][link[1]]
  }
}

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
    // const data = await StockFlowApi.getStockFlowPageOwnership(queryParams)
    const data = await StockFlowApi.getStockFlowPageBin(queryParams)
    list.value = getItemPropList(data.list, [
      { prop: 'warehouse', keyList: ['name'] },
      { prop: 'bin', keyList: ['name'] },
      { prop: 'zone', keyList: ['name'] },
      { prop: 'product', keyList: ['name', 'barCode'] },
      { prop: 'inbound', keyList: ['code'] },
      { prop: 'outbound', keyList: ['code'] },
      { prop: 'stockWarehouse', keyList: ['availableQty', 'sellableQty'] },
      { prop: 'inboundItemFlow', keyList: ['outboundAvailableQty'] }
    ]) as any

    list.value.forEach((item: any) => {
      item.deltaQty = item.deltaQty * item.direction
      item.stockWarehouseAvailableQty1 = item.stockWarehouseAvailableQty
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
<style lang="scss" scoped>
.red {
  color: red;
}
.green {
  color: green;
}
</style>
