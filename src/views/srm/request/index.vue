<template>
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
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['srm:purchase-request:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['srm:purchase-request:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>

        <el-button
          :disabled="disabledBtn || !isMerge(selectionList)"
          type="primary"
          plain
          @click="mergePurchase"
          :loading="mergeLoading"
          v-hasPermi="['srm:purchase-request:merge']"
        >
          合并采购
        </el-button>

        <el-button
          :disabled="disabledBtn || !isSubmitAuditBatch(selectionList)"
          type="primary"
          plain
          @click="handleSubmitAuditBatch"
          v-hasPermi="['srm:purchase-request:submit-audit']"
        >
          提交审核
        </el-button>
        <el-dropdown
          :disabled="oneSelectDisabledBtn"
          class="ml-10px"
          split-button
          type="primary"
          v-hasPermi="['srm:purchase-request:review']"
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

        <el-button
          :disabled="disabledBtn"
          class="ml-10px"
          type="primary"
          plain
          @click="handleUpdateStatusEnableBatch(true)"
          v-hasPermi="['srm:purchase-request:enable']"
        >
          开启
        </el-button>

        <el-button
          :disabled="disabledBtn"
          plain
          @click="handleUpdateStatusEnableBatch(false)"
          v-hasPermi="['srm:purchase-request:enable']"
        >
          关闭
        </el-button>

        <el-switch
          v-model="wholeOrderEnable"
          active-text="整单"
          class="ml-10px"
          @change="handleWholeOrderEnable"
        />
      </template>
    </SmForm>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap style="padding-bottom: 0">
    <SmTable
      isTabledField
      isWholeOrder
      :wholeOrderEnable="wholeOrderEnable"
      :tableFieldOptions="tableFieldOptions"
      :tableFieldKey="tableFieldKey"
      @table-field-confirm="tableFieldConfirm"
      show-summary
      :summary-method="getWholeOrderSelectSummaries"
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
      <template #auditStatus="{ scope }">
        <dict-tag :type="DICT_TYPE.SRM_AUDIT_STATUS" :value="scope.row.auditStatus || ''" />
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

      <template #operate="{ scope }">
        <el-button
          link
          @click="openForm('detail', scope.row.id)"
          v-hasPermi="['srm:purchase-request:query']"
        >
          详情
        </el-button>

        <!-- v-if="scope.row.auditStatus !== 5" -->
        <el-button
          link
          type="primary"
          @click="openForm('update', scope.row.id)"
          v-hasPermi="['srm:purchase-request:update']"
          :disabled="!isUpdate(scope.row.auditStatus)"
        >
          编辑
        </el-button>

        <el-button
          link
          type="danger"
          @click="handleDelete([scope.row.id])"
          v-hasPermi="['srm:purchase-request:delete']"
        >
          删除
        </el-button>
        <!-- <el-button
          link
          type="primary"
          @click="handleUpdateStatus(scope.row, true)"
          v-hasPermi="['srm:purchase-request:review']"
          v-if="[3].includes(scope.row.auditStatus)"
        >
          审核
        </el-button>

        <el-button
          link
          type="danger"
          @click="handleUpdateStatus(scope.row, false)"
          v-hasPermi="['srm:purchase-request:review']"
          v-if="scope.row.auditStatus === 5"
        >
          反审核
        </el-button> -->
      </template>
    </SmTable>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <PurchaseRequestForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { DICT_TYPE } from '@/utils/dict'
import { dateFormatter, dateFormatter2 } from '@/utils/formatTime'
import download from '@/utils/download'
import { PurchaseRequestApi, PurchaseRequestVO } from '@/api/srm/request'
import PurchaseRequestForm from './PurchaseRequestForm.vue'
import { useTableData } from '@/components/SmTable/src/utils'
import { mergeItemsToList, mergeItemsUpToList } from '@/utils/transformData'
import { useSearchForm } from './hooks/search'
import { cloneDeep } from 'lodash-es'
import {
  useWholeOrder,
  useWholeOrderMergeCompute,
  createBranchOrder
} from '@/hooks/common/wholeOrder'
import { isUpdate, isDelete, isSubmitAuditBatch, isMerge } from '@/utils/btnManager/srm'
import { notEmpty } from '@/utils/judge'
import { createWholeOrderSelectSummaries } from '@/utils/create'
import { transformDecimal3 } from '@/views/tms/common/utils'
import { useWholeOrderTableField } from '@/components/SmTableField/src/hooks'
import { clearTableFieldConfig } from '@/components/SmTableField/src/utils'

const { tableOptions, transformTableOptions } = useTableData()

const { wholeOrderMergeCompute, WHOLE_ORDER_TYPE } = useWholeOrderMergeCompute()

const fieldMap = {
  purchaseOrderId: {
    label: '行编号',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },
  billTime: {
    label: '单据日期',
    formatter: dateFormatter2, // 年月日-金蝶
    width: '180px'
  },
  itemsDefaultSupplierName: '默认供应商',
  code: {
    label: '单据编码',
    width: '200px',
    slot: 'code',
    wrap: true
  },
  applicant: '申请人',
  applicationDept: {
    label: '申请部门',
    slot: 'applicationDept',
    width: '150px',
    wrap: true
  },
  auditStatus: {
    label: '审核状态',
    slot: 'auditStatus',
    width: '120px'
  },
  orderStatus: {
    label: '订购状态',
    slot: 'orderStatus',
    width: '120px'
  },
  offStatus: {
    label: '关闭状态',
    slot: 'offStatus',
    width: '120px'
  },
  itemsUnOrderCount: {
    label: '未订购数量',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
    // wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute
  }, // 批准数量➖已订购数量后端计算返回
  itemsOrderClosedQty: {
    label: '已订购数量',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
    // wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute
  },
  // inQty: '已入库数量',
  itemsInboundClosedQty: {
    label: '已入库数量',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },
  // 改造别名
  itemsOrderStatus: {
    label: '行采购状态',
    slot: 'itemsOrderStatus',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },
  // 改造别名
  itemsOffStatus: {
    label: '行关闭状态',
    slot: 'itemsOffStatus',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },
  itemsCode: {
    label: '产品编码',
    slot: 'itemsCode',
    width: '200px',
    wrap: true,
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },
  itemsProductName: {
    label: '产品名称',
    slot: 'productName',
    width: '200px',
    wrap: true,
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },
  itemsDeclaredType: {
    label: '海关品名',
    slot: 'declaredType',
    width: '200px',
    wrap: true,
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },
  itemsDeclaredTypeEn: {
    label: '海关品名(英文)',
    slot: 'declaredTypeEn',
    width: '200px',
    wrap: true,
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },
  itemsProductUnitName: {
    label: '单位',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },
  itemsQty: {
    label: '申请数量',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
    // wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute
  },
  itemsApprovedQty: {
    label: '批准数量',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
    // wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute
  },
  itemsReferenceUnitPrice: {
    label: '参考单价',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },
  itemsGrossPrice: {
    label: '含税单价',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },
  itemsTax: {
    label: '税额',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
    // wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute
  },
  itemsGrossTotalPrice: {
    label: '价税合计',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
    // wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute
  },

  creator: '制单人',
  createTime: {
    label: '制单时间',
    formatter: dateFormatter,
    width: '180px'
  },
  auditAdvice: {
    label: '审核意见',
    width: '200px',
    slot: 'auditAdvice',
    wrap: true
  },
  auditor: '审核人',
  auditTime: {
    label: '审核时间',
    formatter: dateFormatter,
    width: '180px'
  },
  expectArrivalDate: {
    label: '期望到货日期',
    formatter: dateFormatter2,
    width: '180px'
  },
  operate: {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    // action: true,
    width: '320px'
  }
}
const allOptions = transformTableOptions(fieldMap)
tableOptions.value = createBranchOrder(cloneDeep(allOptions))

/** Srm 采购申请列表 */
defineOptions({ name: 'SrmPurchaseRequest' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const wholeOrderEnable = ref(false)
const loading = ref(true) // 列表的加载中
const list = ref<PurchaseRequestVO[]>([]) // 列表的数据
const itemsList = ref<PurchaseRequestVO[]>([])
const wholeOrderList = ref<PurchaseRequestVO[]>([])
const total = ref(0) // 列表的总页数
const itemsTotal = ref(0) // 分行的总页数
const wholeOrderTotal = ref(0) // 整单总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  code: undefined,
  // supplierId: undefined,
  productId: undefined,
  billTime: [],
  auditStatus: undefined,
  remark: undefined,
  applicant: undefined,
  creator: undefined,
  inboundStatus: undefined,
  returnStatus: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
/** 选中操作 */
const selectionList = ref<PurchaseRequestVO[]>([])

// 对整单和分行的items-id获取做了处理
const getItemsId = () => {
  let ids: any = []
  if (wholeOrderEnable.value) {
    selectionList.value.forEach((item: any) => {
      if (!item?.items?.length) return
      item.items.forEach((item) => {
        ids.push(item.id)
      })
    })
  } else {
    ids = selectionList.value.map((item: any) => item.purchaseOrderId)
  }
  return ids
}

const summary = ref({})
/** 查询列表 */
const getList = async () => {
  selectionList.value = []
  loading.value = true
  try {
    const data = await PurchaseRequestApi.getPurchaseRequestPage(queryParams)
    wholeOrderList.value = wholeOrderMergeCompute(data.list, allOptions)
    itemsList.value = mergeItemsUpToList(data.list, 'items', { id: 'purchaseOrderId' })

    // itemsList.value = mergeItemsToList(data.list, {
    //   id: 'purchaseOrderId',
    //   orderStatus: 'itemsOrderStatus',
    //   offStatus: 'itemsOffStatus'
    // })
    // 后续需要补充itemsTotal
    itemsTotal.value = data.itemsTotal || data.total
    wholeOrderTotal.value = data.total

    list.value = wholeOrderEnable.value ? wholeOrderList.value : itemsList.value
    total.value = wholeOrderEnable.value ? wholeOrderTotal.value : itemsTotal.value

    summary.value = data.summary || {}
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
    await PurchaseRequestApi.deletePurchaseRequest(ids)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
    selectionList.value = selectionList.value.filter((item) => !ids.includes(item.id))
  } catch {}
}

/** 审核/反审核操作 */
const handleUpdateStatus = async (row: any, reviewed: boolean) => {
  const { id: requestId, items = [] } = row
  /**
      1、提交审核状态太多-直接出现
      2、很多情况都会出现 审核按钮 只要不是已审核就出现
      3、已审核状态 出现 反审核按钮
   */
  // 执行审核操作
  if (reviewed) {
    openForm('audit', requestId)
    return
  }
  try {
    // 审核的二次确认
    await message.confirm(`确定反审核该申请吗？`)
    // 发起审核
    await PurchaseRequestApi.updatePurchaseRequestAuditStatus({
      requestId,
      reviewed,
      pass: true,
      items: items.map((item) => {
        return {
          id: item.id
          // pass: item.approvedQty
        }
      })
    })
    message.success('反审核成功')
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
    const data = await PurchaseRequestApi.exportPurchaseRequest(queryParams)
    download.excel(data, '采购申请.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

const handleSelectionChange = (rows: PurchaseRequestVO[]) => {
  selectionList.value = rows
}

const getSearchFormData = () => {
  return queryParams
}
const searchFormOptions = useSearchForm(handleQuery)

const mergeLoading = ref(false)
const mergePurchase = async () => {
  // 5已审核
  const auditType = 5
  const allAudit = selectionList.value.every((item: any) => item.auditStatus === auditType)
  if (!allAudit) {
    message.error('选中行存在未审核单据，请检查')
    return
  }

  let items: any = []
  // // 如果不是审核状态的要进行剔除
  // const selectList: any = cloneDeep(
  //   selectionList.value.filter((item: any) => item.auditStatus === auditType)
  // )
  const selectList: any = cloneDeep(selectionList.value)

  selectList.forEach((item) => {
    if (!item?.items?.length) return
    const { applicant, applicantId, applicationDept, applicationDeptId } = item
    item?.items.forEach((a) => {
      a.applicant = applicant
      a.applicantId = applicantId
      a.applicationDept = applicationDept
      a.applicationDeptId = applicationDeptId
      // 默认下单数量=未订购数量
      a.orderQuantity = a.unOrderCount
      if (!notEmpty(a.containerRate)) {
        a.containerRate = 1
      }
    })
  })

  // 整单数据
  if (wholeOrderEnable.value) {
    selectList.forEach((item) => {
      if (!item?.items?.length) return
      items.push(...item.items)
    })
  }
  // 分行数据 需要去重行id相同的
  else {
    selectList.forEach((item) => {
      if (!item?.items?.length) return
      const purchaseOrderId = item.purchaseOrderId
      const target = item.items.find((a) => a.id === purchaseOrderId)
      if (target) {
        items.push(target)
      }
    })
  }

  const data = { items }
  openForm('merge', undefined, data)
  // mergeLoading.value = false
}

/** 关闭/启用申请单 */
const handleSubmitAuditBatch = async () => {
  try {
    await message.exportConfirm('是否确认提交审核？')

    // 整单和分行都统一做去重处理 都是取申请单id
    let ids: any = Array.from(new Set(selectionList.value.map((item) => item.id)))
    await PurchaseRequestApi.submitPurchaseAudit(ids)
    message.success('提交审核成功')
    // 刷新列表
    await getList()
  } catch (e) {
    console.log('提交审核报错', e)
  }
}

const handleUpdateStatusEnableBatch = async (enable: boolean) => {
  /**
    手动关闭 3
    已关闭 2
    开启 1
   */
  // 前端无法穷尽所有情况，所以取后端校验作为告警信息
  try {
    const text = enable ? '开启' : '关闭'
    await message.exportConfirm('是否确认' + text)
    const itemIds = getItemsId()

    await PurchaseRequestApi.updatePurchaseRequestStatusEnable({ itemIds, enable })
    message.success(text + '成功')
    // 刷新列表
    await getList()
  } catch (e) {
    console.log('开启关闭报错', e)
  }
}

// const enableBtnDisabled = computed(() => {
//   if (!selectionList.value?.length) return true
//   if (wholeOrderEnable.value) {
//     return selectionList.value.every((item: any) => item.offStatus * 1 === 1)
//   } else {
//     return selectionList.value.every((item: any) => item.itemsOffStatus * 1 === 1)
//   }
// })

// const closeBtnDisabled = computed(() => {
//   if (!selectionList.value?.length) return true
//   if (wholeOrderEnable.value) {
//     return selectionList.value.every((item: any) => item.offStatus * 1 !== 1)
//   } else {
//     return selectionList.value.every((item: any) => item.itemsOffStatus * 1 !== 1)
//   }
// })

const disabledBtn = computed(() => selectionList.value.length === 0)

const tableFieldKey = '/srm/purchase-request/page'
const { createTableFiledOptions, tableFieldOptions, tableFieldConfirm } = useWholeOrderTableField(
  wholeOrderEnable,
  tableOptions,
  tableFieldKey,
  allOptions
)

const clearCache = () => {
  clearTableFieldConfig(tableFieldKey)
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
  wholeOrderTotal,
  createTableFiledOptions
)

const oneSelectDisabledBtn = computed(() => selectionList.value.length !== 1)

// 只有分行没有整单 wholeOrderTotalKey, itemsTotalKey
const { getWholeOrderSelectSummaries } = createWholeOrderSelectSummaries(
  wholeOrderEnable,
  [
    { itemsKey: 'itemsUnOrderCount', itemsTotalKey: 'sumUnOrderCount' }, //
    { itemsKey: 'itemsOrderClosedQty', itemsTotalKey: 'sumOrderClosedQty' }, // sumOrderClosedQty-产品已订购数量
    { itemsKey: 'itemsInboundClosedQty', itemsTotalKey: 'sumInboundClosedQty' }, // sumInboundClosedQty入库数量

    { itemsKey: 'itemsQty', itemsTotalKey: 'sumQty' }, // sumQty-申请数量
    { itemsKey: 'itemsApprovedQty', itemsTotalKey: 'sumApprovedQty' }, // sumApprovedQty-批准数量
    { itemsKey: 'itemsReferenceUnitPrice', itemsTotalKey: 'sumReferenceUnitPrice' }, // sumReferenceUnitPrice-参考单价合计
    { itemsKey: 'itemsGrossPrice', itemsTotalKey: 'sumGrossPrice' }, // sumGrossPrice-含税单价
    { itemsKey: 'itemsTax', itemsTotalKey: 'sumTax' }, // sumTax-税额
    { itemsKey: 'itemsGrossTotalPrice', itemsTotalKey: 'sumGrossTotalPrice' } // sumGrossTotalPrice-价税合计
  ].map((item) => {
    return {
      itemsColumnKey: item.itemsKey,
      itemsKey: item.itemsKey,
      itemsTotalKey: item.itemsTotalKey,
      formatter: transformDecimal3
    }
  }),
  selectionList,
  summary
)

/** 初始化 **/
onMounted(async () => {
  getList()
  createTableFiledOptions()
})
// TODO 芋艿：可优化功能：列表界面，支持导入
// TODO 芋艿：可优化功能：详情界面，支持打印
</script>
