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
        <el-button @click="handleQuery"> <Icon icon="ep:search" class="mr-5px" /> 搜索 </el-button>
        <el-button @click="resetQuery"> <Icon icon="ep:refresh" class="mr-5px" /> 重置 </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['wms:stock-warehouse:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </template>
    </SmForm>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap :bodyStyle="{ padding: '20px', 'padding-bottom': 0 }">
    <SmTable
      class="stock-warehouse-table"
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
        <ProductInfo :data="scope?.row?.product" />
      </template>
      <template #warehouseInfo="{ scope }">
        <SmTable
          show-summary
          :summary-method="getSummaries"
          :pagination="false"
          border
          :tooltip="false"
          :options="warehouseTableOptions"
          :data="scope.row.stockWarehouseList"
          ref="warehouseInfoRef"
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
import { getSumValue } from '@/utils'

const { tableOptions, transformTableOptions, getItemPropList } = useTableData()

const fieldMap = {
  // 产品图片
  productPrimaryImageUrl: {
    label: '产品图片',
    slot: 'productPrimaryImageUrl',
    imageAttrs: {}
  },

  productInfo: {
    width: '400px',
    label: '产品信息',
    slot: 'productInfo'
  },
  warehouseInfo: {
    width: '1690px', // 需要综合计算后得出暂时2000
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
// 可售数-可用数-待出库数-待上架数-不良品数-采购计划数-采购在途数-退件在途数-库龄
const warehouseFieldMap = {
  warehouseName: '仓库',
  warehouseMode: {
    label: '仓库经营方式',
    width: '150px',
    slot: 'warehouseMode',
    dictAttrs: { type: DICT_TYPE.WMS_WAREHOUSE_MODE }
  },
  sellableQty: '可售数',
  availableQty: '可用数',
  outboundPendingQty: '待出库数',
  shelvingPendingQty: '待上架数',
  defectiveQty: '不良品数',
  // purchasePlanQty: '采购计划数',
  transitQty: '在途数',
  makePendingQty: '在制数',
  // purchaseTransitQty: '采购在途数',
  returnTransitQty: '退件在途数'
  // age: '库龄'
}

const warehouseTableOptions = ref(transformTableOptions(warehouseFieldMap, { allWrap: true }))
const widthList = ['warehouseName', 'warehouseMode']

warehouseTableOptions.value.forEach((item: any) => {
  if (!widthList.includes(item.prop)) {
    item.width = '100px'
  }
})

const warehouseInfoWidth = warehouseTableOptions.value.reduce((prev, cur) => {
  return prev + Number(cur.width!.replace('px', ''))
}, 0)

const warehouseInfoItem = tableOptions.value.find((item) => item.prop === 'warehouseInfo')!
warehouseInfoItem.width = warehouseInfoWidth + 'px'
const warehouseInfoRef = ref() // 仓库信息表格

// const tableOptionsWidth = tableOptions.value.reduce((prev, cur) => {
//   return prev + Number(cur.width!.replace('px', ''))
// }, 0)

// // 2560-1690-500 = 370
// const remainWidthFlag = window.innerWidth - tableOptionsWidth - 500 >= 370
// if (remainWidthFlag) {
//   const productInfoItem = tableOptions.value.find((item) => item.prop === 'productInfo')!
//   productInfoItem.width = undefined
// }

/** 合计 */
const getSummaries = (param: any) => {
  const { columns, data } = param
  const sums: string[] = []
  columns.forEach((column, index: number) => {
    if (index === 0) {
      sums[index] = '产品小计'
      return
    }

    if (!['warehouseName', 'warehouseMode'].includes(column.property)) {
      const sum = getSumValue(data.map((item) => Number(item[column.property])))
      sums[index] = sum + ''
      // column.property === 'qty' ? erpCountInputFormatter(sum) : erpPriceInputFormatter(sum)
    } else {
      sums[index] = ''
    }
  })

  return sums
}

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
    // const data = await StockBinApi.getStockBinGroupedPage(queryParams)
    const data = await StockWarehouseApi.getStockWarehousePageGrouped(queryParams)
    list.value = data.list.map((item) => {
      item.stockWarehouseList = getItemPropList(item.stockWarehouseList, [
        { prop: 'warehouse', keyList: ['mode', 'name', 'code'] }
      ])
      item.productPrimaryImageUrl = item?.product?.primaryImageUrl
      return item
    })
    total.value = data.total

    // setTimeout(() => {
    //   warehouseInfoRef.value.tableRef.doLayout()
    // }, 1000)
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
<style lang="scss" scoped>
:global(.stock-warehouse-table .cell) {
  padding: 0 !important;
}
</style>
