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
          v-hasPermi="['wms:stock-flow:export-logic']"
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
      <template #deltaQty="{ scope }">
        <div class="green" v-if="scope.row.deltaQty > 0">+{{ scope.row.deltaQty }}</div>
        <div class="red" v-else-if="scope.row.deltaQty < 0">{{ scope.row.deltaQty }}</div>
        <div v-else-if="scope.row.deltaQty === 0">{{ scope.row.deltaQty }}</div>
      </template>

      <template #operateNo="{ scope }">
        <div> 操作单号:{{ getOperateNo(scope.row) }} </div>
        <div> 入库单号:{{ scope.row.inboundCode }} </div>
        <!-- <div> 出库单号:{{ scope.row.outboundCode }} </div>
        <div> 上架单号:{{ scope.row.pickupCode }} </div> -->
      </template>
      <template #codeType="{ scope }">
        <dict-tag
          :type="getCodeType(scope?.row?.reason, scope.row)"
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
import { getCodeType, getCodeValue, getOperateNo } from '@/views/wms/common/utils/index'

/**
所有者批次日志
1.顺序：
产品编码--产品名称--库存公司--库存归属--操作时间--批次可用库存--库存变更--批次当前库存--仓库名称----仓
库当前库存--仓库可用库存--仓库可售库存--操作类型--
操作单号（入库出库单等）--操作人


2.库存信息无
3.操作类型为 产生这个变更单据的 单据的类型，如入库单的类型 为采购入库  盘点入库 手工入库 等
4.展示不需要太多时间，只需要一个操作时间和操作人即可 
5.筛选项 无 库存公司和库存归属的筛选，表中也无此两列的信息

 */
const { tableOptions, transformTableOptions, getItemPropList } = useTableData()

const fieldMap = {
  productCode: {
    label: '产品编码',
    width: '160px'
  },
  productName: {
    label: '产品名称',
    width: '200px'
  },
  companyName: '库存公司',
  deptName: '库存归属',
  flowTime: {
    label: '操作时间',
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
  warehouseName: {
    label: '仓库',
    width: '160px'
  },
  stockWarehouseAvailableQty1: '仓库当前库存',
  stockWarehouseAvailableQty: '仓库可用库存',
  stockWarehouseSellableQty: '仓库可售库存',

  codeType: {
    label: '单据类型',
    width: '120px',
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

  // zoneName: '库区名称',
  // binName: '库位',

  // stockType: {
  //   label: '库存类型',
  //   width: '200px',
  //   slot: 'stockType',
  //   dictAttrs: { type: DICT_TYPE.WMS_STOCK_TYPE }
  // },
  // direction: {
  //   label: '库存流水方向',
  //   width: '200px',
  //   slot: 'direction',
  //   dictAttrs: { type: DICT_TYPE.WMS_STOCK_FLOW_DIRECTION }
  // },

  // inboundCode: '入库单号',
  // outboundCode: '出库单号',
  // pickupCode: '上架单号',

  // outboundPendingQty: '待出库数',
  // purchasePlanQty: '采购计划数',
  // purchaseTransitQty: '采购在途数',
  // returnTransitQty: '退件在途数数',
  // sellableQty: '可售数',
  // shelvingPendingQty: '待上架数数',

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
  // allWrap: true,
  noComputePropList: [
    'warehouseName',
    'productCode',
    'productName',
    'updateTime',
    'createTime',
    'inboundCode',
    'flowTime'
  ]
})

/** 库存流水 列表 */
defineOptions({ name: 'WmsOwnerStockFlow' })

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
    // const data = await StockFlowApi.getStockFlowPageWarehouse(queryParams)
    const data = await StockFlowApi.getStockFlowPageLogic(queryParams)
    list.value = getItemPropList(data.list, [
      { prop: 'warehouse', keyList: ['name'] },
      // { prop: 'bin', keyList: ['name'] },
      // { prop: 'zone', keyList: ['name'] },
      { prop: 'product', keyList: ['name', 'code'] },
      { prop: 'inbound', keyList: ['code'] },
      { prop: 'outbound', keyList: ['code'] },
      { prop: 'pickup', keyList: ['code'] },
      { prop: 'exchange', keyList: ['code'] },
      { prop: 'stockWarehouse', keyList: ['availableQty', 'sellableQty'] },
      { prop: 'inboundItemFlow', keyList: ['outboundAvailableQty'] },

      { prop: 'dept', keyList: ['name'] },
      { prop: 'company', keyList: ['name'] }
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
    const data = await StockFlowApi.exportStockFlowLogic(queryParams)
    download.excel(data, '所有者批次日志.xls')
    // download.excel(data, '库存流水.xls')
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
