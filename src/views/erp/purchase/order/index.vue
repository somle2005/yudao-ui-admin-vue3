<template>
  <!-- <doc-alert title="【采购】采购订单、入库、退货" url="https://doc.iocoder.cn/erp/purchase/" /> -->

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
          v-hasPermi="['erp:purchase-order:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['erp:purchase-order:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>

        <el-button
          :disabled="disabledBtn"
          type="primary"
          plain
          @click="handleUpdateStatusEnableBatch(true)"
          v-hasPermi="['erp:purchase-order:enable']"
        >
          开启
        </el-button>

        <el-button
          :disabled="disabledBtn"
          plain
          @click="handleUpdateStatusEnableBatch(false)"
          v-hasPermi="['erp:purchase-order:enable']"
        >
          关闭
        </el-button>

        <el-button
          :disabled="disabledBtn"
          type="primary"
          plain
          @click="handleSubmitAuditBatch"
          v-hasPermi="['erp:purchase-order:submitAudit']"
        >
          提交审核
        </el-button>

        <el-button
          :disabled="disabledBtn"
          type="primary"
          plain
          @click="mergeOrder"
          v-hasPermi="['erp:purchase-order:merge']"
        >
          合并入库
        </el-button>

        <el-button
          :disabled="generateContractDisabledBtn"
          type="primary"
          plain
          @click="generateContractOrder"
          v-hasPermi="['erp:purchase-order:generateContract']"
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
          v-hasPermi="['erp:purchase-order:delete']"
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
          v-hasPermi="['erp:purchase-order:query']"
        >
          详情
        </el-button>
        <el-button
          link
          type="primary"
          @click="openForm('update', scope.row.id)"
          v-hasPermi="['erp:purchase-order:update']"
        >
          编辑
        </el-button>
        <el-button
          link
          type="primary"
          @click="handleUpdateStatus(scope.row, true)"
          v-hasPermi="['erp:purchase-order:audit']"
          v-if="![5].includes(scope.row.auditStatus)"
        >
          审核
        </el-button>
        <el-button
          link
          type="danger"
          @click="handleUpdateStatus(scope.row, false)"
          v-hasPermi="['erp:purchase-order:audit']"
          v-if="scope.row.auditStatus === 5"
        >
          反审核
        </el-button>
        <el-button
          link
          type="danger"
          @click="handleDelete([scope.row.id])"
          v-hasPermi="['erp:purchase-order:delete']"
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
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter, dateFormatter2 } from '@/utils/formatTime'
import download from '@/utils/download'
import { PurchaseOrderApi, PurchaseOrderVO } from '@/api/erp/purchase/order'
import PurchaseOrderForm from './PurchaseOrderForm.vue'
import { ProductApi, ProductVO } from '@/api/erp/product/product'
import { UserVO } from '@/api/system/user'
import * as UserApi from '@/api/system/user'
import { SupplierApi, SupplierVO } from '@/api/erp/purchase/supplier'
import { useTableData } from '@/components/SmTable/src/utils'
import { useBatch } from './hooks/useBatch'
import { cloneDeep } from 'lodash-es'
import { mergeItemsToList } from '@/utils/transformData'
import {
  useWholeOrder,
  useWholeOrderMergeCompute,
  createBranchOrder
} from '@/hooks/common/wholeOrder'
import { useSearchForm } from './hooks/search'
import { generateContract, mergeItems } from '@/utils/operate/purchase'

const { tableOptions, transformTableOptions } = useTableData()

const { wholeOrderMergeCompute, WHOLE_ORDER_TYPE } = useWholeOrderMergeCompute()

// 带有items标记的都是整单不进行展示的-到时候直接进行遍历即可

// 字段是不是从items里面取麻烦标明一下 各个状态的字典值记得取一下
const fieldMap = {
  no: '单据编号', // 采购单编号
  noTime: {
    label: '单据日期',
    formatter: dateFormatter2, // 年月日-金蝶
    width: '200px'
  },
  erpPurchaseRequestItemNo: '源单单号', 
  supplierName: '供应商',

  auditStatus: {
    label: '审核状态',
    slot: 'auditStatus',
    dictAttrs: { type: DICT_TYPE.ERP_AUDIT_STATUS }
  },

  executeStatus: {
    label: '执行状态',
    slot: 'executeStatus',
    dictAttrs: { type: DICT_TYPE.ERP_EXECUTE_STATUS }
  },
  inStatus: {
    label: '入库状态',
    slot: 'inStatus',
    dictAttrs: { type: DICT_TYPE.ERP_STORAGE_STATUS }
  },
  payStatus: {
    label: '付款状态',
    slot: 'payStatus',
    dictAttrs: { type: DICT_TYPE.ERP_PAYMENT_STATUS }
  },
  offStatus: {
    label: '关闭状态',
    slot: 'offStatus',
    dictAttrs: { type: DICT_TYPE.ERP_OFF_STATUS }
  },

  // productBarCode: {
  //   label: 'SKU',
  //   wholeOrderEnable: WHOLE_ORDER_TYPE.items
  // },
  barCode: {
    label: 'SKU',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },
  productName: {
    label: '产品名称',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },
  declaredType: {
    label: '报关品名',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },

  // totalPrice最终合计价格  totalPrice = totalProductPrice + totalTaxPrice - discountPrice 最终合计价格
  totalPrice: {
    label: '成交金额',
    wholeOrderEnable: WHOLE_ORDER_TYPE.wholeOrder // 整单才进行展示
  },

  rowExecuteStatus: {
    label: '行执行状态',
    slot: 'rowExecuteStatus',
    dictAttrs: { type: DICT_TYPE.ERP_EXECUTE_STATUS },
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },
  rowInStatus: {
    label: '行入库状态',
    slot: 'rowInStatus',
    dictAttrs: { type: DICT_TYPE.ERP_STORAGE_STATUS },
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },
  rowPayStatus: {
    label: '行付款状态',
    slot: 'rowPayStatus',
    dictAttrs: { type: DICT_TYPE.ERP_PAYMENT_STATUS },
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },
  rowOffStatus: {
    label: '行关闭状态',
    slot: 'rowOffStatus',
    dictAttrs: { type: DICT_TYPE.ERP_OFF_STATUS },
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },

  // 8:  '入库核销状态',

  // 报关品名
  containerRate: {
    label: '箱率',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },

  // deliveryDate: {
  //   label: '交货日期',
  //   formatter: dateFormatter2, // 年月日-金蝶
  //   width: '200px'
  // },
  deliveryTime: {
    label: '交货日期',
    formatter: dateFormatter2, // 年月日-金蝶
    width: '200px',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },
  // 总验货通过数-只有整单的时候才进行展示
  totalInspectionPassCount: {
    width: '250px',
    label: '总验货通过数',
    wholeOrderEnable: WHOLE_ORDER_TYPE.wholeOrder
  },
  totalCompletionCount: {
    width: '250px',
    label: '总完工数',
    wholeOrderEnable: WHOLE_ORDER_TYPE.wholeOrder
  },

  waitInCount: {
    label: '待收数量', // 待入库数量
    wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute // 需要整单合并计算的
  },
  count: {
    label: '下单数量', // 产品下单数量
    wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute // 需要整单合并计算的
  },
  inCount: {
    label: '已收数量', // 采购入库数量
    wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute // 需要整单合并计算的
  },
  returnCount: {
    label: '退货数量', // 采购退货数量
    wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute // 整单展示
  },
  // items-returnCount-采购退货数量
  // currencyId: {
  //   label: '币种',
  //   slot: 'currencyId',
  //   wholeOrderEnable: WHOLE_ORDER_TYPE.items
  // },

  // currencyName: '币种',
  itemCurrencyName: {
    label: '币种',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },

  payPrice: {
    label: '已付款金额',
    wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute // 需要整单合并计算的
  },

  actTaxPrice: {
    label: '含税单价',
    wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute // 需要整单合并计算的
  },
  taxPrice: {
    label: '税额',
    wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute // 需要整单合并计算的
  },
  allAmount: {
    label: '价税合计',
    wholeOrderEnable: WHOLE_ORDER_TYPE.mergeCompute // 需要整单合并计算的
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

  applicantName: {
    label: '申请人',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },
  departmentName: {
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

  reviewComment: '审核意见',

  operate: {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '220px'
  }
}

const allOptions = transformTableOptions(fieldMap)
const wrapList = [
  'no',
  'supplierName',
  'barCode',
  'reviewComment',
  'productName',
  'remark',
  'declaredType',
  'erpPurchaseRequestItemNo'
]
allOptions.forEach((item: any) => {
  if (wrapList.includes(item.prop)) {
    item.slot = item.prop
    item.wrap = true
    item.width = '200px'
  }
})

tableOptions.value = createBranchOrder(cloneDeep(allOptions))

/** ERP 销售订单列表 */
defineOptions({ name: 'ErpPurchaseOrder' })

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
  no: undefined,
  supplierId: undefined,
  productId: undefined,
  noTime: [],
  status: undefined,
  remark: undefined,
  creator: undefined,
  inStatus: undefined,
  returnStatus: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const productList = ref<ProductVO[]>([]) // 产品列表
const supplierList = ref<SupplierVO[]>([]) // 供应商列表
const userList = ref<UserVO[]>([]) // 用户列表

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await PurchaseOrderApi.getPurchaseOrderPage(queryParams)

    // data.list.forEach((item) => {
    //   if (!item?.items?.length) return
    //   item.items.forEach((a) => {
    //     if (a.product) {
    //       a.productName = a.product.name
    //       a.productBarCode = a.product.barCode
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

    wholeOrderList.value = wholeOrderMergeCompute(data.list, allOptions)

    itemsList.value = mergeItemsToList(data.list, {
      id: 'rowItemsId',
      status: 'rowStatus',
      orderStatus: 'rowOrderStatus',
      offStatus: 'rowOffStatus',
      executeStatus: 'rowExecuteStatus',
      inStatus: 'rowInStatus',
      payStatus: 'rowPayStatus',
      currencyName: 'itemCurrencyName',
    })
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
    download.excel(data, '销售订单.xls')
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

const {
  generateContractDisabledBtn,
  disabledBtn,
  handleUpdateStatusEnableBatch,
  handleSubmitAuditBatch
} = useBatch(selectionList, getList, wholeOrderEnable)

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
  // // 加载列表 产品、仓库列表、供应商
  // const [list1, product, supplier, user] = await Promise.all([
  //   getList(),
  //   ProductApi.getProductSimpleList(),
  //   SupplierApi.getSupplierSimpleList(),
  //   UserApi.getSimpleUserList()
  // ])
  // productList.value = product
  // supplierList.value = supplier
  // userList.value = user
})

const mergeOrder = async () => {
  mergeItems(wholeOrderEnable, selectionList, openForm, 'rowItemsId')
}

const generateContractOrder = async () => {
  generateContract(selectionList, openForm)
}

// TODO 芋艿：可优化功能：列表界面，支持导入
// TODO 芋艿：可优化功能：详情界面，支持打印
</script>
