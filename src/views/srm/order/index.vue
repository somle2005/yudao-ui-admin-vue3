<template>
  <!-- <'7-审核撤销,6-审核不通过,5-已审核,4-审核中,3-未审核,2-已提交,1-草稿, btnManage-createStr1创建' -->

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
          v-hasPermi="['srm:purchase-order:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['srm:purchase-order:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>

        <el-button
          :disabled="disabledBtn"
          type="primary"
          plain
          @click="handleUpdateStatusEnableBatch(true)"
          v-hasPermi="['srm:purchase-order:enable']"
        >
          开启
        </el-button>

        <el-button
          :disabled="disabledBtn"
          plain
          @click="handleUpdateStatusEnableBatch(false)"
          v-hasPermi="['srm:purchase-order:enable']"
        >
          关闭
        </el-button>

        <el-button
          :disabled="disabledBtn || !isSubmitAuditBatch(selectionList)"
          type="primary"
          plain
          @click="handleSubmitAuditBatch"
          v-hasPermi="['srm:purchase-order:submit-audit']"
        >
          提交审核
        </el-button>
        <el-dropdown
          :disabled="oneSelectDisabledBtn"
          class="ml-10px"
          split-button
          type="primary"
          v-hasPermi="['srm:purchase-order:review']"
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
          :disabled="disabledBtn || !isMerge(selectionList)"
          class="ml-10px"
          type="primary"
          plain
          @click="mergeOrder"
          v-hasPermi="['srm:purchase-order:merge']"
        >
          合并到货
        </el-button>

        <el-button
          :disabled="oneSelectDisabledBtn"
          type="primary"
          plain
          @click="generateContractOrder"
          v-hasPermi="['srm:purchase-order:generate-contract']"
        >
          生成采购合同
        </el-button>

        <el-switch
          v-model="wholeOrderEnable"
          active-text="整单"
          class="ml-10px"
          @change="handleWholeOrderEnable"
        />

        <!-- <el-button
          type="danger"
          plain
          @click="handleDelete(selectionList.map((item) => item.id))"
          v-hasPermi="['srm:purchase-order:delete']"
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
      <template #currencyId="{ scope }">
        <dict-tag :type="DICT_TYPE.CURRENCY_CODE" :value="scope.row.currencyId || ''" />
      </template>

      <template #operate="{ scope }">
        <el-button
          link
          @click="openForm('detail', scope.row.id)"
          v-hasPermi="['srm:purchase-order:query']"
        >
          详情
        </el-button>
        <!-- 编辑	草稿，驳回  0-2-->
        <el-button
          link
          type="primary"
          @click="openForm('update', scope.row.id)"
          v-hasPermi="['srm:purchase-order:update']"
          :disabled="!isUpdate(scope.row.auditStatus)"
        >
          编辑
        </el-button>
        <!-- <el-button
          link
          type="primary"
          @click="handleUpdateStatus(scope.row, true)"
          v-hasPermi="['srm:purchase-order:review']"
          v-if="[3].includes(scope.row.auditStatus)"
        >
          审核
        </el-button>
        <el-button
          link
          type="danger"
          @click="handleUpdateStatus(scope.row, false)"
          v-hasPermi="['srm:purchase-order:review']"
          v-if="scope.row.auditStatus === 5"
        >
          反审核
        </el-button> -->
        <!-- 删除-草稿 1 -->
        <el-button
          link
          type="danger"
          @click="handleDelete([scope.row.id])"
          v-hasPermi="['srm:purchase-order:delete']"
        >
          删除
        </el-button>
      </template>
    </SmTable>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <PurchaseOrderForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { DICT_TYPE } from '@/utils/dict'
import { dateFormatter, dateFormatter2 } from '@/utils/formatTime'
import download from '@/utils/download'
import { PurchaseOrderApi, PurchaseOrderVO } from '@/api/srm/order'
import PurchaseOrderForm from './PurchaseOrderForm.vue'
import { useTableData } from '@/components/SmTable/src/utils'
import { useBatch } from './hooks/useBatch'
import { cloneDeep } from 'lodash-es'
import { mergeItemsToList, mergeItemsUpToList } from '@/utils/transformData'
import {
  useWholeOrder,
  useWholeOrderMergeCompute,
  createBranchOrder
} from '@/hooks/common/wholeOrder'
import { useSearchForm } from './hooks/search'
import { generateContract, mergeItems } from '@/utils/operate/srm'
import { isUpdate, isDelete, isSubmitAuditBatch, isMerge } from '@/utils/btnManager/srm'

const { tableOptions, transformTableOptions } = useTableData()

const { wholeOrderMergeCompute, WHOLE_ORDER_TYPE } = useWholeOrderMergeCompute()

// 带有items标记的都是整单不进行展示的-到时候直接进行遍历即可

// 字段是不是从items里面取麻烦标明一下 各个状态的字典值记得取一下
/**
 * 如果要支持整单计算 itemsList.value = mergeItemsUpToList(data.list, 'items', { qty: 'itemsQty1' })
 * 参照这个items是总数 itemsQty1是适配的分行数
 */
const fieldMap = {
  itemsId: {
    label: '行编号',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },
  code: '单据编码', // 采购单编号
  billTime: {
    label: '单据日期',
    formatter: dateFormatter2, // 年月日-金蝶
    width: '200px'
  },
  // 手动适配添加
  purchaseApplyCode: {
    label: '上游单据编码',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
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
  inboundStatus: {
    label: '入库状态',
    slot: 'inboundStatus',
    dictAttrs: { type: DICT_TYPE.SRM_STORAGE_STATUS }
  },
  // payStatus: {
  //   label: '付款状态',
  //   slot: 'payStatus',
  //   dictAttrs: { type: DICT_TYPE.SRM_PAYMENT_STATUS }
  // },
  offStatus: {
    label: '关闭状态',
    slot: 'offStatus',
    dictAttrs: { type: DICT_TYPE.SRM_OFF_STATUS }
  },

  // productCode: {
  //   label: '产品编码',
  //   wholeOrderEnable: WHOLE_ORDER_TYPE.items
  // },
  itemsProductCode: {
    label: '产品编码',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },
  itemsProductName: {
    label: '产品名称',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },
  itemsDeclaredType: {
    label: '海关品名',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },
  itemsDeclaredTypeEn: {
    label: '海关品名(英文)',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },

  // totalPrice最终合计价格  totalPrice = totalProductPrice + totalGrossPrice - discountPrice 最终合计价格
  totalPrice: {
    label: '成交金额',
    wholeOrderEnable: WHOLE_ORDER_TYPE.wholeOrder // 整单才进行展示
  },

  itemsExecuteStatus: {
    label: '行执行状态',
    slot: 'itemsExecuteStatus',
    dictAttrs: { type: DICT_TYPE.SRM_EXECUTE_STATUS },
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },
  itemsInboundStatus: {
    label: '行入库状态',
    slot: 'itemsInboundStatus',
    dictAttrs: { type: DICT_TYPE.SRM_STORAGE_STATUS },
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },
  // itemsPayStatus: {
  //   label: '行付款状态',
  //   slot: 'itemsPayStatus',
  //   dictAttrs: { type: DICT_TYPE.SRM_PAYMENT_STATUS },
  //   wholeOrderEnable: WHOLE_ORDER_TYPE.items
  // },
  itemsOffStatus: {
    label: '行关闭状态',
    slot: 'itemsOffStatus',
    dictAttrs: { type: DICT_TYPE.SRM_OFF_STATUS },
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },

  // 8:  '入库核销状态',

  // 海关品名
  itemsContainerRate: {
    label: '箱率',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },

  // deliveryDate: {
  //   label: '交货日期',
  //   formatter: dateFormatter2, // 年月日-金蝶
  //   width: '200px'
  // },
  itemsDeliveryTime: {
    label: '交货日期',
    formatter: dateFormatter2, // 年月日-金蝶
    width: '200px',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },
  // 总验货通过数-只有整单的时候才进行展示
  itemsTotalInspectionPassCount: {
    width: '250px',
    label: '总验货通过数',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },
  itemsTotalCompletionPassCount: {
    width: '250px',
    label: '总完工数',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },

  itemsWaitInCount: {
    label: '待收数量', // 待入库数量-待收数量
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
    // wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute // 需要整单合并计算的
  },
  itemsQty: {
    label: '下单数量', // 产品下单数量
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
    // wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute // 需要整单合并计算的
  },
  itemsInboundClosedQty: {
    label: '已入库数量', // 采购入库数量-已收数量
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
    // wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute // 需要整单合并计算的
  },
  itemsReturnCount: {
    label: '退货数量', // 采购退货数量
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
    // wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute // 整单展示
  },
  // items-returnCount-采购退货数量
  // currencyId: {
  //   label: '币种',
  //   slot: 'currencyId',
  //   wholeOrderEnable: WHOLE_ORDER_TYPE.items
  // },

  currencyName: '币种',
  // itemsCurrencyName: {
  //   label: '币种',
  //   wholeOrderEnable: WHOLE_ORDER_TYPE.items
  // },

  itemsPayPrice: {
    label: '已付款金额',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
    // wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute // 需要整单合并计算的
  },

  itemsGrossPrice: {
    label: '含税单价',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
    // wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute // 需要整单合并计算的
  },
  itemsTax: {
    label: '税额',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
    // wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute // 需要整单合并计算的
  },
  itemsGrossTotalPrice: {
    label: '价税合计',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
    // wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute // 需要整单合并计算的
  },

  // 取后端总的税额无法进行分行展示数据了
  // tax: {
  //   label:'税额',
  //   wholeOrderEnable: 'items',
  // }, // items
  // totalGrossPrice: {
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

  auditor: '审核人',
  auditTime: {
    label: '审核时间',
    formatter: dateFormatter, // 年月日-金蝶
    width: '200px'
  },

  auditAdvice: '审核意见',

  operate: {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '220px'
  }
}

const allOptions = transformTableOptions(fieldMap, { noComputePropList: [] })
const wrapList = [
  'code',
  'supplierName',
  'code',
  'auditAdvice',
  'productName',
  'remark',
  'declaredType',
  'declaredTypeEn',
  'purchaseApplyCode',
  'fromPortName',
  'toPortName'
]
allOptions.forEach((item: any) => {
  if (wrapList.includes(item.prop)) {
    item.slot = item.prop
    item.wrap = true
    item.width = '200px'
  }
})

tableOptions.value = createBranchOrder(cloneDeep(allOptions))

/** Srm 销售订单列表 */
defineOptions({ name: 'SrmPurchaseOrder' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const wholeOrderEnable = ref(false)
const loading = ref(true) // 列表的加载中
const list = ref<PurchaseOrderVO[]>([]) // 列表的数据
const itemsList = ref<PurchaseOrderVO[]>([])
const wholeOrderList = ref<PurchaseOrderVO[]>([])
const total = ref(0) // 列表的总页数
const itemsTotal = ref(0) // 分行的总页数
const wholeOrderTotal = ref(0) // 整单总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  code: undefined,
  supplierId: undefined,
  productId: undefined,
  billTime: [],
  auditStatus: undefined,
  remark: undefined,
  creator: undefined,
  inboundStatus: undefined,
  returnStatus: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    // const bodyData = getMainItemBodyData({
    //   queryParams,
    //   mainQueryList: ['code', 'supplierId', 'auditStatus', 'inboundStatus'],
    //   itemQueryList: ['productId', 'orderCode']
    // })
    // bodyData.itemQuery.inboundStatus = queryParams.itemsInboundStatus
    const data = await PurchaseOrderApi.getPurchaseOrderPage(queryParams)

    // data.list.forEach((item) => {
    //   if (!item?.items?.length) return
    //   item.items.forEach((a) => {
    //     if (a.product) {
    //       a.productName = a.product.name
    //       a.productCode = a.product.code
    //     }
    //     // const purchaseRequestItem = a.purchaseRequestItem
    //     // if (purchaseRequestItem) {
    //     //   const { creator, departmentName } = purchaseRequestItem
    //     //   item.PRItemCreator = creator
    //     //   item.PRItemDepartmentName = departmentName
    //     // }
    //     // const { applicantName, departmentName } = a
    //     // item.itemApplicantName = applicantName
    //     // item.itemDepartmentName = departmentName
    //   })
    // })

    // 修改前
    // itemsList.value = mergeItemsToList(data.list, {
    //   id: 'rowItemsId',
    //   status: 'rowStatus',
    //   // orderStatus: 'rowOrderStatus', 无该状态
    //   offStatus: 'rowOffStatus',
    //   executeStatus: 'rowExecuteStatus',
    //   inboundStatus: 'rowInStatus',
    //   payStatus: 'rowPayStatus'
    //   // currencyName: 'itemCurrencyName',
    // })

    // 修改后
    // itemsList.value = mergeItemsToList(data.list, {
    //   id: 'itemsId',
    //   status: 'itemsStatus',
    //   // orderStatus: 'rowOrderStatus', 无该状态
    //   offStatus: 'itemsOffStatus',
    //   executeStatus: 'itemsExecuteStatus',
    //   inboundStatus: 'itemsInboundStatus',
    //   payStatus: 'itemsPayStatus'
    //   // currencyName: 'itemsCurrencyName',
    // })

    wholeOrderList.value = wholeOrderMergeCompute(data.list, allOptions)
    itemsList.value = mergeItemsUpToList(data.list, 'items', {
      purchaseApplyCode: 'purchaseApplyCode'
    })

    /**
     * 整单的时候才对mergeCompute进行合并计算-展示合并计算的
     * 如果是分行的时候就要展示分行的
     * 这样的话比如采购到货的时候 既要展示分行又要展示合并计算的逻辑就行不通了。
     * 所以要满足这种就得加字段-涉及到options联动-设置表格 通过字段名进行区分
     */
    // itemsList.value = wholeOrderMergeCompute(itemsList.value, allOptions)

    // 后续需要补充itemsTotal
    itemsTotal.value = data.itemsTotal || data.total
    wholeOrderTotal.value = data.total

    list.value = wholeOrderEnable.value ? wholeOrderList.value : itemsList.value
    total.value = wholeOrderEnable.value ? wholeOrderTotal.value : itemsTotal.value
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
    await PurchaseOrderApi.deletePurchaseOrder(ids)
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
    const data = await PurchaseOrderApi.exportPurchaseOrder(queryParams)
    download.excel(data, '采购订单.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 选中操作 */
const selectionList = ref<PurchaseOrderVO[]>([])
const handleSelectionChange = (rows: PurchaseOrderVO[]) => {
  selectionList.value = rows
}

const { oneSelectDisabledBtn, disabledBtn, handleUpdateStatusEnableBatch, handleSubmitAuditBatch } =
  useBatch(selectionList, getList, wholeOrderEnable)

/** 审核/反审核操作 */
const handleUpdateStatus = async (row: any, reviewed: boolean) => {
  const { id, items = [] } = row
  /**
      1、提交审核状态太多-直接出现
      2、很多情况都会出现 审核按钮 只要不是已审核就出现
      3、已审核状态 出现 反审核按钮
   */
  // 执行审核操作
  if (reviewed) {
    openForm('audit', id)
    return
  }
  try {
    // 审核的二次确认
    await message.confirm(`确定反审核该申请吗？`)
    // 发起审核
    // await PurchaseRequestApi.updatePurchaseRequestStatus(id, status)
    await PurchaseOrderApi.updatePurchaseOrderAuditStatus({
      reviewed,
      pass: true,
      orderIds: [id]
    })
    message.success('反审核成功')
    // 刷新列表
    await getList()
  } catch {}
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

/** 初始化 **/
onMounted(async () => {
  getList()
})

const mergeOrder = async () => {
  mergeItems(wholeOrderEnable, selectionList, openForm, 'itemsId')
}

const generateContractOrder = async () => {
  generateContract(selectionList, openForm)
}

// TODO 芋艿：可优化功能：列表界面，支持导入
// TODO 芋艿：可优化功能：详情界面，支持打印
</script>
