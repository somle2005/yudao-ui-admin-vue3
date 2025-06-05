<!-- 选择采购入库（仅展示可付款）-->
<template>
  <Dialog title="选择采购到货项（仅展示已审核）" v-model="dialogVisible">
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
    <ContentWrap style="padding-bottom: 0">
      <SmTable
        border
        oneSelection
        highlight-current-row
        :loading="loading"
        :options="tableOptions"
        :data="list"
        :total="total"
        v-model:currentPage="queryParams.pageNo"
        v-model:pageSize="queryParams.pageSize"
        @pagination="getList"
        @one-selection-change="handleCurrentChange"
      >
        <template #reconciliationStatus="{ scope }">
          <ElTag :type="RECONCILIATION_STSTUS_MAP[scope.row.reconciliationStatus]?.colorType">
            {{ RECONCILIATION_STSTUS_MAP[scope.row.reconciliationStatus]?.label }}
          </ElTag>
        </template>
      </SmTable>
    </ContentWrap>
    <template #footer>
      <el-button @click="submitForm" type="primary"> 确 定 </el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { mergeItemsUpToList, resetQueryParams } from '@/utils/transformData'
import { useSearchForm } from './hooks/search'
import { RECONCILIATION_STSTUS_MAP } from '@/utils/constant'
import { PurchaseInApi } from '@/api/srm/in'
import { useTable } from './hooks/useTable'
import { getMainItemBodyData } from '@/utils/transform'
import { getCurrencyName } from '@/commonData'

// 暂时都是分行展示逻辑

defineOptions({ name: 'EnableList' })

const dialogVisible = ref(false) // 弹窗的是否展示

const queryFormRef = ref() // 搜索的表单
const selectionList = ref<any[]>([])

const loading = ref(false)
const total = ref(0)
const list = ref<any[]>([]) // 列表的数据

// 注意外面都要用let
// eslint-disable-next-line prefer-const
let queryParams: any = reactive({})

let {
  allOptions,
  tableOptions,

  wholeOrderEnable,
  itemsList,
  wholeOrderList,
  itemsTotal,
  wholeOrderTotal,

  switchList
} = useTable()

let supplierIdSave

// 这里只有整单展示了-退货单是整单退货-带出子项所有id
const getList = async () => {
  loading.value = true
  try {
    const bodyData = getMainItemBodyData({
      queryParams,
      mainQueryList: ['code', 'supplierId', 'auditStatus', 'inboundStatus'],
      itemQueryList: ['productId', 'orderCode']
    })
    // bodyData.itemQuery.inboundStatus = queryParams.itemsInboundStatus

    bodyData.mainQuery.inboundStatus = 3 // 3整单全部入库 2 // 部分入库
    bodyData.mainQuery.supplierId = supplierIdSave
    bodyData.mainQuery.auditStatus = 5 // 已审核
    // bodyData.itemQuery.inboundStatus = 2 // 部分入库

    const data = await PurchaseInApi.getPurchaseInPage(bodyData)

    // todo取出items里面对应对象数据

    // data.list.forEach((item) => {
    //   if (!item?.items?.length) return
    //   item.items.forEach((a) => {
    //     if (a.product) {
    //       a.productName = a.product.name
    //       a.productBarCode = a.product.barCode
    //     }

    //     item.itemApplicantName = item.applicantName
    //     item.itemApplicationDeptName = item.applicationDeptName
    //   })
    // })

    // itemsList.value = mergeItemsToList(data.list, {
    //   id: 'itemsId',
    //   status: 'itemsStatus',
    //   orderStatus: 'itemsOrderStatus',
    //   offStatus: 'itemsOffStatus',
    //   executeStatus: 'itemsExecuteStatus',
    //   inboundStatus: 'itemsInboundStatus',
    //   payStatus: 'itemsPayStatus'
    // })

    switchList(list, total, data)
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  queryParams.pageNo = 1
  selectionList.value = []
  getList()
}

const handleCurrentChange = (row: any) => {
  // 转换成整单数据
  selectionList.value = mergeItemsUpToList([row], 'items', {
    productId: 'productId',
    productName: 'productName',
    // productBarCode,
    barCode: 'barCode',
    productUnitId: 'productUnitId',
    productUnitName: 'productUnitName',
    productPrice: 'productPrice',
    qty: 'qty', // 计划的数量
    actualQty: 'actualQty', //实际入库的数量
    code: 'inCode', // 适配采购退货详情接口

    taxPercent: 'taxPercent',
    taxPrice: 'taxPrice',
    grossPrice: 'grossPrice',
    allAmount: 'allAmount',
    // remark:'remark',
    containerRate: 'containerRate',

    warehouseId: 'warehouseId',
    warehouseName: 'warehouseName',
    source: 'source',
    // 整单带出来
    // currencyId: 'currencyId',
    // currencyName: 'currencyName',
    applicantId: 'applicantId',
    applicantName: 'applicantName',
    applicationDeptId: 'applicationDeptId',
    applicationDeptName: 'applicationDeptName',
    declaredType: 'declaredType',
    remark: 'remark' // remark: itemsRemark防止和主单冲突
  })

  selectionList.value.forEach((item) => {
    item.currencyName = getCurrencyName(item.currencyId)
  })
  // selectionList.value = mergeItemsToList([row], {
  //   id: 'itemsId',
  //   status: 'itemsStatus',
  //   orderStatus: 'itemsOrderStatus',
  //   offStatus: 'itemsOffStatus',
  //   executeStatus: 'itemsExecuteStatus',
  //   inboundStatus: 'itemsInboundStatus',
  //   payStatus: 'itemsPayStatus',
  //   currencyId: 'currencyId'
  // })queryParams
  // console.log(selectionList.value, 'selectionList.value')
  // console.log('当前选中项', row)
}

const { getSearchFormData, searchFormOptions } = useSearchForm(handleQuery, queryParams)

const resetQuery = () => {
  resetQueryParams(queryParams, queryFormRef)
  queryParams.inboundStatus = 3 // 默认主单部分入库-可选全部入库
  handleQuery()
}

/** 提交选择 */
const emits = defineEmits<{
  (e: 'success', value: any[]): void
}>()
const submitForm = () => {
  try {
    emits('success', selectionList.value)
  } finally {
    // 关闭弹窗
    dialogVisible.value = false
  }
}

/** 打开弹窗 */
const open = async (supplierId) => {
  supplierIdSave = supplierId
  dialogVisible.value = true
  resetQuery()
  // await nextTick() // 等待，避免 queryFormRef 为空
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>
