<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="仓库ID" prop="warehouseId">
        <el-input
          v-model="queryParams.warehouseId"
          placeholder="请输入仓库ID"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="产品ID" prop="productId">
        <el-input
          v-model="queryParams.productId"
          placeholder="请输入产品ID"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="产品SKU" prop="productSku">
        <el-input
          v-model="queryParams.productSku"
          placeholder="请输入产品SKU"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="采购计划量" prop="purchasePlanQuantity">
        <el-input
          v-model="queryParams.purchasePlanQuantity"
          placeholder="请输入采购计划量"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="采购在途量" prop="purchaseTransitQuantity">
        <el-input
          v-model="queryParams.purchaseTransitQuantity"
          placeholder="请输入采购在途量"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="退件在途数量" prop="returnTransitQuantity">
        <el-input
          v-model="queryParams.returnTransitQuantity"
          placeholder="请输入退件在途数量"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="待上架数量" prop="pendingShelvingQuantity">
        <el-input
          v-model="queryParams.pendingShelvingQuantity"
          placeholder="请输入待上架数量"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="可用量，在库的良品数量" prop="availableQuantity">
        <el-input
          v-model="queryParams.availableQuantity"
          placeholder="请输入可用量，在库的良品数量"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="可售量，未被单据占用的良品数量" prop="sellableQuantity">
        <el-input
          v-model="queryParams.sellableQuantity"
          placeholder="请输入可售量，未被单据占用的良品数量"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="待出库量" prop="pendingOutboundQuantity">
        <el-input
          v-model="queryParams.pendingOutboundQuantity"
          placeholder="请输入待出库量"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="不良品数量" prop="defectiveQuantity">
        <el-input
          v-model="queryParams.defectiveQuantity"
          placeholder="请输入不良品数量"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['wms:stock-warehouse:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['wms:stock-warehouse:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="仓库ID" align="center" prop="warehouseId" />
      <el-table-column label="产品ID" align="center" prop="productId" />
      <el-table-column label="产品SKU" align="center" prop="productSku" />
      <el-table-column label="采购计划量" align="center" prop="purchasePlanQuantity" />
      <el-table-column label="采购在途量" align="center" prop="purchaseTransitQuantity" />
      <el-table-column label="退件在途数量" align="center" prop="returnTransitQuantity" />
      <el-table-column label="待上架数量" align="center" prop="pendingShelvingQuantity" />
      <el-table-column label="可用量，在库的良品数量" align="center" prop="availableQuantity" />
      <el-table-column label="可售量，未被单据占用的良品数量" align="center" prop="sellableQuantity" />
      <el-table-column label="待出库量" align="center" prop="pendingOutboundQuantity" />
      <el-table-column label="不良品数量" align="center" prop="defectiveQuantity" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" min-width="120px">
        <template #default="scope">
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
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <StockWarehouseForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { StockWarehouseApi, StockWarehouseVO } from '@/api/wms/stock-warehouse'
import StockWarehouseForm from './StockWarehouseForm.vue'

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
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await StockWarehouseApi.getStockWarehousePage(queryParams)
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

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>