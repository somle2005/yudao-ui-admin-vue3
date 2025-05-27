<!-- 可付款的采购入库单列表 选择采购入库（仅展示可付款）width="1000"-->
<template>
  <Dialog title="选择采购申请项（仅展示已审核）" v-model="dialogVisible">
    <ContentWrap>
      <!-- 搜索工作栏 -->
      <SmForm
        class="-mb-15px"
        ref="queryFormRef"
        :inline="true"
        label-width="68px"
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
        isSelection
        :loading="loading"
        :options="tableOptions"
        :data="list"
        :total="total"
        v-model:currentPage="queryParams.pageNo"
        v-model:pageSize="queryParams.pageSize"
        @pagination="getList"
        @selection-change="handleSelectionChange"
      >
        <template #status="{ scope }">
          <dict-tag :type="DICT_TYPE.SRM_AUDIT_STATUS" :value="scope.row.status || ''" />
        </template>

        <template #orderStatus="{ scope }">
          <dict-tag :type="DICT_TYPE.SRM_ORDER_STATUS" :value="scope.row.orderStatus || ''" />
        </template>

        <template #offStatus="{ scope }">
          <dict-tag :type="DICT_TYPE.SRM_OFF_STATUS" :value="scope.row.offStatus || ''" />
        </template>

        <template #itemsOrderStatus="{ scope }">
          <dict-tag :type="DICT_TYPE.SRM_ORDER_STATUS" :value="scope.row.itemsOrderStatus || ''" />
        </template>

        <template #itemsOffStatus="{ scope }">
          <dict-tag :type="DICT_TYPE.SRM_OFF_STATUS" :value="scope.row.itemsOffStatus || ''" />
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
import { DICT_TYPE } from '@/utils/dict'
import { useTableData } from '@/components/SmTable/src/utils'
import { dateFormatter, dateFormatter2 } from '@/utils/formatTime'
import { mergeItemsToList, mergeItemsUpToList, resetQueryParams } from '@/utils/transformData'
import { cloneDeep } from 'lodash-es'
import { useWholeOrderMergeCompute, useWholeOrderMergeComputeUp } from '@/hooks/common/wholeOrder'
import { PurchaseOrderApi } from '@/api/srm/order'
import { useSearchForm } from './hooks/search'
import { currencyNameChange } from '@/utils/operate/srm'

// 暂时都是分行展示逻辑

defineOptions({ name: 'PurchaseInPaymentEnableList' })

const dialogVisible = ref(false) // 弹窗的是否展示

const queryFormRef = ref() // 搜索的表单
const selectionList = ref<any[]>([])

const loading = ref(false)
const total = ref(0)
const list = ref<any[]>([]) // 列表的数据
const { tableOptions, transformTableOptions } = useTableData()

const { WHOLE_ORDER_TYPE, wholeOrderMergeCompute } = useWholeOrderMergeComputeUp()
// 带有items标记的都是整单不进行展示的-到时候直接进行遍历即可

// 字段是不是从items里面取麻烦标明一下 各个状态的字典值记得取一下
const fieldMap = {
  code: '单据编码', // 采购单编号
  billTime: {
    label: '单据日期',
    formatter: dateFormatter2, // 年月日-金蝶
    width: '200px'
  },
  supplierName: '供应商',

  auditStatus: {
    label: '审核状态',
    slot: 'auditStatus',
    dictAttrs: { type: DICT_TYPE.SRM_AUDIT_STATUS }
  },

  executeStatus: {
    label: '执行状态',
    slot: 'executeStatus',
    dictAttrs: { type: DICT_TYPE.SRM_EXECUTE_STATUS }
  },
  inStatus: {
    label: '入库状态',
    slot: 'inStatus',
    dictAttrs: { type: DICT_TYPE.SRM_STORAGE_STATUS }
  },
  payStatus: {
    label: '付款状态',
    slot: 'payStatus',
    dictAttrs: { type: DICT_TYPE.SRM_PAYMENT_STATUS }
  },
  offStatus: {
    label: '关闭状态',
    slot: 'offStatus',
    dictAttrs: { type: DICT_TYPE.SRM_OFF_STATUS }
  },

  // 整单才进行展示
  totalPrice: {
    label: '成交金额',
    wholeOrderEnable: WHOLE_ORDER_TYPE.wholeOrder
  },

  itemsExecuteStatus: {
    label: '行执行状态',
    slot: 'itemsExecuteStatus',
    dictAttrs: { type: DICT_TYPE.SRM_EXECUTE_STATUS },
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },
  itemsInStatus: {
    label: '行入库状态',
    slot: 'itemsInStatus',
    dictAttrs: { type: DICT_TYPE.SRM_STORAGE_STATUS },
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },
  itemsPayStatus: {
    label: '行付款状态',
    slot: 'itemsPayStatus',
    dictAttrs: { type: DICT_TYPE.SRM_PAYMENT_STATUS },
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },
  itemsOffStatus: {
    label: '行关闭状态',
    slot: 'itemsOffStatus',
    dictAttrs: { type: DICT_TYPE.SRM_OFF_STATUS },
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },

  // 8:  '入库核销状态',

  itemsBarCode: {
    label: '产品编码',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },
  itemsProductName: {
    label: '产品名称',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },

  // 海关品名
  itemsContainerRate: {
    label: '箱率',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },

  itemsDeliveryDate: {
    label: '交货日期',
    formatter: dateFormatter2, // 年月日-金蝶
    width: '180px'
  },
  // 总验货通过数-只有整单的时候才进行展示
  itemsTotalInspectionPassCount: {
    width: '250px',
    label: '总验货通过数',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },
  itemsWaitInCount: {
    label: '待收数量'
    // wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute // 需要整单合并计算的
  },
  itemsQty: {
    label: '下单数量'
    // wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute // 需要整单合并计算的
  },
  itemsInCount: {
    label: '已收数量'
    // wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute // 需要整单合并计算的
  },
  currencyName: '币种',
  // currencyId: {
  //   label: '币种',
  //   slot: 'currencyId',
  //   wholeOrderEnable: WHOLE_ORDER_TYPE.items
  // },

  itemsActTaxPrice: {
    label: '含税单价'
    // wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute // 需要整单合并计算的
  },
  itemsTaxPrice: {
    label: '税额'
    // wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute // 需要整单合并计算的
  },
  itemsAmount: {
    label: '价税合计'
    // wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute // 需要整单合并计算的
  },

  // 取后端总的税额无法进行分行展示数据了
  // taxPrice: {
  //   label:'税额',
  //   wholeOrderEnable: 'items',
  // }, // items
  // totalTaxPrice: {
  //   label: '价税合计',
  //   wholeOrderEnable: 'items',
  // }, // items

  itemsApplicantName: {
    label: '申请人',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },
  itemsDepartmentName: {
    label: '申请部门',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },

  creator: '制单人',
  createTime: {
    label: '制单时间',
    formatter: dateFormatter, // 年月日-金蝶
    width: '200px'
  },

  // auditorName: '审核人',
  auditor: '审核人',
  auditTime: {
    label: '审核时间',
    formatter: dateFormatter, // 年月日-金蝶
    width: '200px'
  },

  reviewComment: '审核意见'

  // operate: {
  //   label: '操作',
  //   slot: 'operate',
  //   fixed: 'right',
  //   width: '220px'
  // }
}

// 最终展示这几个 单据编码，供应商，产品编码，待收数量，下单数量，已收数量 ，交货日期
const showList = [
  'code',
  'supplierName',
  'itemsBarCode',
  'itemsWaitInCount',
  'itemsQty',
  'itemsInCount',
  'itemsDeliveryDate'
]

const branchOptions = transformTableOptions(fieldMap).filter((item: any) =>
  showList.includes(item.prop)
)
const wrapList = ['code', 'supplierName', 'barCode', 'reviewComment', 'productName', 'remark']
branchOptions.forEach((item: any) => {
  if (wrapList.includes(item.prop)) {
    item.slot = item.prop
    item.wrap = true
    item.width = '200px'
  }
})

tableOptions.value = cloneDeep(branchOptions)

// 注意外面都要用let
// eslint-disable-next-line prefer-const
let queryParams: any = reactive({})
let supplierIdSave

const getList = async () => {
  queryParams.auditStatus = 5 // 已审核
  queryParams.supplierId = supplierIdSave
  queryParams.inStatus = 3 // 整单全部入库
  loading.value = true
  try {
    const data = await PurchaseOrderApi.getPurchaseOrderPage(queryParams)
    list.value = mergeItemsUpToList(data.list, 'items', {
      barCode: 'barCode',
      productName: 'productName',
      containerRate: 'containerRate',
      deliveryDate: 'deliveryDate',
      qty: 'qty',
      inCount: 'inCount',
      actTaxPrice: 'actTaxPrice',
      amount: 'amount',
      declaredType: 'declaredType',
      declaredTypeEn: 'declaredTypeEn',
      warehouseId: 'warehouseId',
      warehouseName: 'warehouseName',
      expectArrivalDate: 'expectArrivalDate',
      payPrice: 'payPrice',
      xcode: 'xcode',

      productUnitId: 'productUnitId',
      productUnitName: 'productUnitName',

      applicantName: 'applicantName',
      departmentName: 'departmentName',
      applicantId: 'applicantId',
      applicationDeptId: 'applicationDeptId',
      source: 'source', //接口无返回
      remark: 'remark',
    })
    // list.value = wholeOrderMergeCompute(arr, tableOptions.value)

    // data.list.forEach((item) => {
    //   if (!item?.items?.length) return
    //   item.items.forEach((a) => {
    //     if (a.product) {
    //       a.productName = a.product.name
    //       a.productBarCode = a.product.barCode
    //       a.model = a.product.model
    //       a.productUnitName = a.product.unitName
    //       a.productUnitId = a.product.unitId
    //       // productId-item有
    //       a.productId = a.product.id
    //     }
    //     // const purchaseRequestItem = a.purchaseRequestItem
    //     // if (purchaseRequestItem) {
    //     //   const { creator, departmentName } = purchaseRequestItem
    //     //   item.PRItemCreator = creator
    //     //   item.PRItemDepartmentName = departmentName
    //     // }
    //   })
    // })

    // list.value = mergeItemsToList(data.list, {
    //   id: 'itemsId',
    //   status: 'itemsStatus',
    //   orderStatus: 'itemsOrderStatus',
    //   offStatus: 'itemsOffStatus',
    //   executeStatus: 'itemsExecuteStatus',
    //   inStatus: 'itemsInStatus',
    //   payStatus: 'itemsPayStatus'
    // })

    // 后续需要补充itemsTotal
    total.value = data.itemsTotal || data.total
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  queryParams.pageNo = 1
  selectionList.value = []
  getList()
}

const handleSelectionChange = (rows: any[]) => {
  selectionList.value = rows
}

const { getSearchFormData, searchFormOptions } = useSearchForm(handleQuery, queryParams)

const resetQuery = () => {
  resetQueryParams(queryParams, queryFormRef)
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
  dialogVisible.value = true
  supplierIdSave = supplierId
  resetQuery()
  // await nextTick() // 等待，避免 queryFormRef 为空
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>
