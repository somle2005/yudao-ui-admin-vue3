<template>
  <!-- <doc-alert title="【采购】采购订单、入库、退货" url="https://doc.iocoder.cn/erp/purchase/" /> -->

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
          v-hasPermi="['srm:purchase-in:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['srm:purchase-in:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>

        <el-button
          :disabled="disabledBtn"
          type="primary"
          plain
          @click="handleSubmitAuditBatch"
          v-hasPermi="['srm:purchase-in:submit-audit']"
        >
          提交审核
        </el-button>

        <el-dropdown
          :disabled="oneSelectDisabledBtn"
          class="ml-10px mr-10px"
          split-button
          type="primary"
          v-hasPermi="['srm:purchase-in:review']"
        >
          <div @click="handleUpdateStatus(selectionList[0], true)">审核</div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <div @click="handleUpdateStatus(selectionList[0], false)">反审核</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-switch
          v-model="wholeOrderEnable"
          active-text="整单"
          class="ml-10px"
          @change="handleWholeOrderEnable"
        />

        <!-- v-hasPermi="['srm:purchase-in:change-pay-status']" -->
        <!-- <el-button
          :disabled="disabledBtn"
          type="primary"
          plain
          @click="changePayStatusBatch(selectionList, true)"
          v-hasPermi="['srm:purchase-in:change-pay-status']"
        >
          付款
        </el-button>
        <el-button
          :disabled="disabledBtn"
          type="primary"
          plain
          @click="changePayStatusBatch(selectionList, false)"
          v-hasPermi="['srm:purchase-in:change-pay-status']"
        >
          撤销付款
        </el-button>

        <el-switch
          v-model="wholeOrderEnable"
          active-text="整单"
          class="ml-10px"
          @change="handleWholeOrderEnable"
        /> -->
        <!-- <el-button
          type="danger"
          plain
          @click="handleDelete(selectionList.map((item) => item.id))"
          v-hasPermi="['srm:purchase-in:delete']"
          :disabled="selectionList.length === 0"
        >
          <Icon icon="ep:delete" class="mr-5px" /> 删除
        </el-button> -->
      </template>
    </SmForm>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap :bodyStyle="{ padding: '20px', 'padding-bottom': 0 }">
    <SmTable
      border
      isSelection
      :loading="loading"
      :options="tableOptions"
      :data="list"
      :total="total"
      v-model:currentPage="queryParams.pageNo"
      v-model:pageSize="queryParams.pageSize"
      @selection-change="handleSelectionChange"
      @pagination="getList"
    >
      <template #reconciliationStatus="{ scope }">
        <ElTag :type="RECONCILIATION_STSTUS_MAP[scope.row.reconciliationStatus]?.colorType">
          {{ RECONCILIATION_STSTUS_MAP[scope.row.reconciliationStatus]?.label }}
        </ElTag>
      </template>
      <template #operate="{ scope }">
        <!-- <el-button
            link
            @click="openForm('detail', scope.row.id)"
            v-hasPermi="['srm:purchase-in:query']"
          >
            详情
          </el-button> -->
        <el-button
          link
          type="primary"
          @click="openForm('update', scope.row.id)"
          v-hasPermi="['srm:purchase-in:update']"
          v-if="scope.row.auditStatus !== 5"
        >
          编辑
        </el-button>
        <!-- <el-button
          link
          type="primary"
          @click="handleUpdateStatus(scope.row, true)"
          v-hasPermi="['srm:purchase-in:audit']"
          v-if="[3].includes(scope.row.auditStatus)"
        >
          审核
        </el-button>
        <el-button
          link
          type="danger"
          @click="handleUpdateStatus(scope.row, false)"
          v-hasPermi="['srm:purchase-in:audit']"
          v-if="scope.row.auditStatus === 5"
        >
          反审核
        </el-button> -->
        <el-button
          link
          type="danger"
          @click="handleDelete([scope.row.id])"
          v-hasPermi="['srm:purchase-in:delete']"
        >
          删除
        </el-button>
      </template>
    </SmTable>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <PurchaseInForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import download from '@/utils/download'
import { PurchaseInApi, PurchaseInVO } from '@/api/srm/in'
import PurchaseInForm from './PurchaseInForm.vue'
import { useTable } from './hooks/useTable'
import { useSearchForm } from './hooks/search'
import { useBatch } from './hooks/useBatch'
import { RECONCILIATION_STSTUS_MAP } from '@/utils/constant'

/** Srm 销售入库列表 */
defineOptions({ name: 'SrmPurchaseIn' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<PurchaseInVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  code: undefined,
  supplierId: undefined,
  productId: undefined,
  warehouseId: undefined,
  inTime: [],
  orderNo: undefined,
  paymentStatus: undefined,
  accountId: undefined,
  status: undefined,
  remark: undefined,
  creator: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

let {
  allOptions,
  tableOptions,

  wholeOrderEnable,
  itemsList,
  wholeOrderList,
  itemsTotal,
  wholeOrderTotal,

  switchList,
  useWholeOrder,
} = useTable()

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await PurchaseInApi.getPurchaseInPage(queryParams)

    // todo取出items里面对应对象数据

    // data.list.forEach((item) => {
    //   if (!item?.items?.length) return
    //   item.items.forEach((a) => {
    //     if (a.product) {
    //       a.productName = a.product.name
    //       a.productBarCode = a.product.barCode
    //     }

    //     // item.itemApplicantName = item.applicantName
    //     // item.itemApplicationDeptName = item.applicationDeptName
    //   })
    // })

    switchList(list, total, data)

    // 替换后

    // itemsList.value = mergeItemsToList(data.list, {
    //   id: 'itemsId',
    //   status: 'itemsStatus',
    //   orderStatus: 'itemsOrderStatus',
    //   offStatus: 'itemsOffStatus',
    //   executeStatus: 'itemsExecuteStatus',
    //   inStatus: 'itemsInStatus',
    //   payStatus: 'itemsPayStatus',
    //   totalPrice: 'itemsTotalPrice',
    //   barCode: 'itemsBarCode',
    //   qty: 'itemsQty'
    // })

    // 替换前
    // itemsList.value = mergeItemsToList(data.list, {
    //   id: 'rowItemsId',
    //   status: 'rowStatus',
    //   orderStatus: 'rowOrderStatus',
    //   offStatus: 'rowOffStatus',
    //   executeStatus: 'rowExecuteStatus',
    //   inStatus: 'rowInStatus',
    //   payStatus: 'rowPayStatus',
    //   totalPrice: 'itemTotalPrice',
    //   barCode: 'rowBarCode',
    //   qty: 'itemQty'
    // })
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
const openForm = (type: string, id?: number, data?: any) => {
  formRef.value.open(type, id, data)
}

/** 删除按钮操作 */
const handleDelete = async (ids: number[]) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await PurchaseInApi.deletePurchaseIn(ids)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
    selectionList.value = selectionList.value.filter((item) => !ids.includes(item.id))
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await PurchaseInApi.exportPurchaseIn(queryParams)
    download.excel(data, '销售入库.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 选中操作 */
const selectionList = ref<PurchaseInVO[]>([])
const handleSelectionChange = (rows: PurchaseInVO[]) => {
  selectionList.value = rows
}

const { handleWholeOrderEnable } = useWholeOrder(
  allOptions,
  tableOptions,
  selectionList,
  list,
  total,
  itemsList,
  itemsTotal,
  wholeOrderList,
  wholeOrderTotal
)

const { getSearchFormData, searchFormOptions } = useSearchForm(handleQuery, queryParams)

const { disabledBtn, handleUpdateStatus, handleSubmitAuditBatch, changePayStatusBatch } = useBatch(
  selectionList,
  getList,
  wholeOrderEnable,
  openForm
)

const oneSelectDisabledBtn = computed(() => selectionList.value.length !== 1)

/** 初始化 **/
onMounted(async () => {
  // 加载 列表 产品、仓库列表、供应商
  getList()
})
// TODO 芋艿：可优化功能：列表界面，支持导入
// TODO 芋艿：可优化功能：详情界面，支持打印
</script>
