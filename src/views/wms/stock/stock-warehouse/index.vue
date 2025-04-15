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
      :showOverflowTooltip="false"
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
          v-hasPermi="['wms:stock-warehouse:update']"
        >
          编辑
        </el-button>
        <el-button
          link
          type="danger"
          @click="handleDelete(scope.row.id)"
          v-hasPermi="['wms:stock-warehouse:delete']"
        >
          删除
        </el-button>
      </template> -->

      <template #productInfo="{ scope }">
        <ProductInfo :data="scope.row" />
      </template>
      <template #warehouseInfo="{ scope }">
        <!-- show-summary -->
        <SmTable
          :pagination="false"
          border
          :tooltip="false"
          :options="warehouseTableOptions"
          :data="scope.row.stockWarehouseList"
        />
      </template>
    </SmTable>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <StockWarehouseForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter, dateFormatter2 } from '@/utils/formatTime'
import download from '@/utils/download'
import { StockWarehouseApi, StockWarehouseVO } from '@/api/wms/stock-warehouse'
import StockWarehouseForm from './StockWarehouseForm.vue'
import { useTableData } from '@/components/SmTable/src/utils'
import { useSearchForm } from './hooks/search'
import { StockBinApi } from '@/api/wms/stock-bin'
import ProductInfo from './components/ProductInfo.vue'

const { tableOptions, transformTableOptions, getItemProp, getItemPropList } = useTableData()

const fieldMap = {
  // 产品图片
  primaryImageUrl: {
    label: '产品图片',
    slot: 'primaryImageUrl',
    imageAttrs: {}
  },

  productInfo: {
    width: '400px',
    label: '产品信息',
    slot: 'productInfo'
  },
  warehouseInfo: {
    width: '2000px', // 需要综合计算后得出暂时2000
    label: '仓库信息',
    slot: 'warehouseInfo'
  }
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
// tableOptions.value = transformTableOptions(fieldMap, { allWrap: true })
tableOptions.value = transformTableOptions(fieldMap)

const warehouseFieldMap = {
  warehouseName: '仓库名称',
  warehouseMode: {
    label: '仓库经营方式',
    width: '250px',
    slot: 'warehouseMode',
    dictAttrs: { type: DICT_TYPE.WMS_WAREHOUSE_MODE }
  },
  availableQty: '可用量',
  defectiveQty: '不良品数量',
  outboundPendingQty: '待出库量',
  purchasePlanQty: '采购计划量',
  purchaseTransitQty: '采购在途量',
  returnTransitQty: '退件在途数量',
  sellableQty: '可售量',
  shelvingPendingQty: '待上架数量'
}

const warehouseTableOptions = ref(transformTableOptions(warehouseFieldMap, { allWrap: true }))

const warehouseInfoWidth = warehouseTableOptions.value.reduce((prev, cur) => {
  return prev + Number(cur.width!.replace('px', ''))
}, 0)

const warehouseInfoItem = tableOptions.value.find((item) => item.prop === 'warehouseInfo')!
warehouseInfoItem.width = warehouseInfoWidth + 'px'

console.log(warehouseInfoWidth, 'warehouseInfoWidth')

/** 仓库库存 列表 */
defineOptions({ name: 'WmsStockWarehouse' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<StockWarehouseVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  warehouseId: undefined,
  productId: undefined,
  productSku: undefined,
  purchasePlanQuantity: undefined,
  purchaseTransitQuantity: undefined,
  returnTransitQuantity: undefined,
  pendingShelvingQuantity: undefined,
  availableQuantity: undefined,
  sellableQuantity: undefined,
  pendingOutboundQuantity: undefined,
  defectiveQuantity: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    // const data = await StockWarehouseApi.getStockWarehousePage(queryParams)
    const data = await StockBinApi.getStockBinGroupedPage(queryParams)
    list.value = data.list.map((item) => {
      item.stockWarehouseList = getItemPropList(item.stockWarehouseList, [
        { prop: 'warehouse', keyList: ['mode', 'name', 'code'] }
      ])
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
    await StockWarehouseApi.deleteStockWarehouse(id)
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
    const data = await StockWarehouseApi.exportStockWarehouse(queryParams)
    download.excel(data, '仓库库存.xls')
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
