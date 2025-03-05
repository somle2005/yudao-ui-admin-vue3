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
          v-hasPermi="['erp:purchase-request:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['erp:purchase-request:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>

        <el-button
          :disabled="disabledBtn"
          type="primary"
          plain
          @click="mergePurchase"
          :loading="mergeLoading"
          v-hasPermi="['erp:purchase-request:merge']"
        >
          合并采购
        </el-button>

        <el-button
          :disabled="disabledBtn"
          type="primary"
          plain
          @click="handleSubmitAuditBatch"
          v-hasPermi="['erp:purchase-request:audit']"
        >
          提交审核
        </el-button>

        <el-button
          :disabled="disabledBtn"
          type="primary"
          plain
          @click="handleUpdateStatusEnableBatch(true)"
          v-hasPermi="['erp:purchase-request:enable']"
        >
          开启
        </el-button>

        <el-button
          :disabled="disabledBtn"
          plain
          @click="handleUpdateStatusEnableBatch(false)"
          v-hasPermi="['erp:purchase-request:enable']"
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
        <dict-tag :type="DICT_TYPE.ERP_AUDIT_STATUS" :value="scope.row.status || ''" />
      </template>

      <template #orderStatus="{ scope }">
        <dict-tag :type="DICT_TYPE.ERP_ORDER_STATUS" :value="scope.row.orderStatus || ''" />
      </template>

      <template #offStatus="{ scope }">
        <dict-tag :type="DICT_TYPE.ERP_OFF_STATUS" :value="scope.row.offStatus || ''" />
      </template>

      <template #rowOrderStatus="{ scope }">
        <dict-tag :type="DICT_TYPE.ERP_ORDER_STATUS" :value="scope.row.rowOrderStatus || ''" />
      </template>

      <template #rowOffStatus="{ scope }">
        <dict-tag :type="DICT_TYPE.ERP_OFF_STATUS" :value="scope.row.rowOffStatus || ''" />
      </template>

      <template #operate="{ scope }">
        <!-- <el-button link @click="openForm('detail', scope.row.id)"> 详情 </el-button> -->
        <el-button
          link
          type="primary"
          @click="openForm('update', scope.row.id)"
          v-hasPermi="['erp:purchase-request:update']"
        >
          编辑
        </el-button>

        <el-button
          link
          type="danger"
          @click="handleDelete([scope.row.id])"
          v-hasPermi="['erp:purchase-request:delete']"
        >
          删除
        </el-button>

        <!-- <el-button
          link
          type="primary"
          @click="handleSubmitAudit([scope.row.id])"
          v-hasPermi="['erp:purchase-request:audit']"
        >
          提交审核
        </el-button> -->

        <el-button
          link
          type="primary"
          @click="handleUpdateStatus(scope.row, true)"
          v-hasPermi="['erp:purchase-request:audit']"
          v-if="![5].includes(scope.row.status)"
        >
          审核
        </el-button>

        <el-button
          link
          type="danger"
          @click="handleUpdateStatus(scope.row, false)"
          v-hasPermi="['erp:purchase-request:audit']"
          v-if="scope.row.status === 5"
        >
          反审核
        </el-button>

        <!-- <el-button
          link
          type="primary"
          @click="handleUpdateStatusEnable(scope.row, true)"
          v-hasPermi="['erp:purchase-request:enable']"
          v-if="scope.row.rowOffStatus * 1 !== 1"
        >
          开启
        </el-button>

        <el-button
          link
          type="danger"
          @click="handleUpdateStatusEnable(scope.row, false)"
          v-hasPermi="['erp:purchase-request:enable']"
          v-if="scope.row.rowOffStatus * 1 === 1"
        >
          关闭
        </el-button> -->
        <!-- <el-button
          type="primary"
          link
          @click="mergePurchaseOne(scope.row)"
          v-hasPermi="['erp:purchase-request:merge']"
          v-if="scope.row.rowOrderStatus !== 1"
        >
          采购
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
import { PurchaseRequestApi, PurchaseRequestVO } from '@/api/erp/purchase/request'
import PurchaseRequestForm from './PurchaseRequestForm.vue'
import { ProductApi, ProductVO } from '@/api/erp/product/product'
import { UserVO } from '@/api/system/user'
import * as UserApi from '@/api/system/user'
import { useTableData } from '@/components/SmTable/src/utils'
import { mergeItemsToList } from '@/utils/transformData'
import { useSearchForm } from './hooks/search'
import { cloneDeep } from 'lodash-es'

const { tableOptions, transformTableOptions } = useTableData()


const fieldMap = {
  requestTime: {
    label: '单据日期',
    formatter: dateFormatter2, // 年月日-金蝶
    width: '180px'
  },
  no: {
    label: '单据编号',
    width: '200px',
    slot: 'no',
    wrap: true
  },
  applicant: '申请人',
  applicationDept: '申请部门',
  status: {
    label: '审核状态',
    slot: 'status',
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

  unOrderCount: '未订购数量',
  orderCount: '已订购数量',
  inQty: '已入库数量',
  // 改造别名
  rowOrderStatus: {
    label: '行采购状态',
    slot: 'rowOrderStatus'
  },
  // 改造别名
  rowOffStatus: {
    label: '行关闭状态',
    slot: 'rowOffStatus'
  },
  barCode: '商品编码',
  productName: {
    label: '商品名称',
    slot: 'productName',
    width: '200px',
    wrap: true
  },
  productUnitName: '单位',
  count: '申请数量',
  approveCount: '批准数量',
  referenceUnitPrice: '参考单价',
  actTaxPrice: '含税单价',
  taxPrice: '税额',
  allAmount: '价税合计',

  creator: '制单人',
  createTime: {
    label: '制单时间',
    formatter: dateFormatter,
    width: '180px'
  },
  auditor: '审核人',
  auditTime: {
    label: '审核时间',
    formatter: dateFormatter,
    width: '180px'
  },
  expectArrivalDate: {
    label: '期望到货日期',
    formatter: dateFormatter,
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
const branchOptions = transformTableOptions(fieldMap)
tableOptions.value = cloneDeep(branchOptions)

const createWholeOrder = (branchOptions) => {
  const map = {
    requestTime: '单据日期',
    no: '单据编号',
    applicant: '申请人',
    applicationDept: '申请部门',
    status: '审核状态',
    orderStatus: '订购状态',
    offStatus: '关闭状态',
    unOrderCount: '未订购数量',
    orderCount: '已订购数量',
    inQty: '已入库数量',
    count: '申请数量',
    approveCount: '批准数量',
    taxPrice: '税额',
    allAmount: '价税合计',
    operate: '操作'
  }
  const arr: any = []
  branchOptions.forEach((item) => {
    if (item.prop && map[item.prop]) {
      arr.push(item)
    }
  })
  return arr
}

/** ERP 采购申请列表 */
defineOptions({ name: 'ErpPurchaseRequest' })

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
  no: undefined,
  // supplierId: undefined,
  productId: undefined,
  requestTime: [],
  status: undefined,
  remark: undefined,
  applicant: undefined,
  creator: undefined,
  inStatus: undefined,
  returnStatus: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const productList = ref<ProductVO[]>([]) // 产品列表
// const supplierList = ref<SupplierVO[]>([]) // 供应商列表
const userList = ref<UserVO[]>([]) // 用户列表
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

/** 查询列表 */
const getList = async () => {
  selectionList.value = []
  loading.value = true
  try {
    const data = await PurchaseRequestApi.getPurchaseRequestPage(queryParams)

    const computeSum = (items: any[], key: string) => {
      if (!items?.length) return
      return items.reduce((prev, cur) => {
        if (cur[key]) {
          return cur[key] + prev
        }
        return prev
      }, 0)
    }
    wholeOrderList.value = cloneDeep(data.list).map((item) => {
      const keyList = ['count', 'approveCount', 'taxPrice', 'allAmount']
      keyList.forEach((key) => {
        item[key] = computeSum(item.items, key)
      })
      return item
    })

    itemsList.value = mergeItemsToList(data.list, {
      id: 'purchaseOrderId',
      status: 'rowStatus',
      orderStatus: 'rowOrderStatus',
      offStatus: 'rowOffStatus'
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

const handleWholeOrderEnable = (val) => {
  if (val) {
    // 防止大屏宽度没有占满对最后四项做处理最后一项操作不做处理
    const options = createWholeOrder(cloneDeep(branchOptions))
    const len = options.length - 1
    const limit = len - 4

    for (let i = limit; i < len; i++) {
      options[i].width = undefined
    }

    tableOptions.value = options
    list.value = wholeOrderList.value
    total.value = wholeOrderTotal.value
  } else {
    tableOptions.value = cloneDeep(branchOptions)
    list.value = itemsList.value
    total.value = itemsTotal.value
  }
  selectionList.value = []
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
    // await PurchaseRequestApi.updatePurchaseRequestStatus(id, status)
    await PurchaseRequestApi.updatePurchaseRequestAuditStatus({
      requestId,
      reviewed,
      pass: true,
      items: items.map((item) => {
        return {
          id: item.id,
          pass: item.approveCount
        }
      })
    })
    message.success('反审核成功')
    // 刷新列表
    await getList()
  } catch {}
}

/** 关闭/启用申请单 */
const handleUpdateStatusEnable = async (row: any, enable: boolean) => {
  /**
    手动关闭 3
    已关闭 2
    开启 1
   */
  try {
    let itemIds: any = []
    const { items = [], purchaseOrderId } = row
    if (wholeOrderEnable.value) {
      itemIds = items.map((item) => item.id)
    } else {
      itemIds = [purchaseOrderId]
    }

    // 开启的二次确认
    await message.confirm(`确定${enable ? '开启' : '关闭'}该申请吗？`)
    // 发起开启
    // await PurchaseRequestApi.updatePurchaseRequestStatus(id, status)
    await PurchaseRequestApi.updatePurchaseRequestStatusEnable({ itemIds, enable })
    message.success(`${enable ? '开启' : '关闭'}成功`)
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
  const hasAudit = selectionList.value.some((item: any) => item.status === auditType)
  if (!hasAudit) {
    message.error('选中行未包含审核单据，请检查')
    return
  }

  let items: any = []
  // 如果不是审核状态的要进行剔除
  const selectList: any = selectionList.value.filter((item: any) => item.status === auditType)
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
  openForm('merge', 1, data)
  // mergeLoading.value = false
}

const mergePurchaseOne = async (item: any) => {
  try {
    await message.exportConfirm('是否确认采购申请单？')
    await PurchaseRequestApi.mergePurchaseRequestOne({ requestId: item.id })
    message.success('合并成功')
    // 刷新列表
    await getList()
  } catch (e) {
    console.log('单个合并报错', e)
  }
}

const handleSubmitAudit = async (ids: number[]) => {
  try {
    await message.exportConfirm('是否确认提交审核？')
    await PurchaseRequestApi.submitPurchaseAudit(ids)
    message.success('提交审核成功')
    // 刷新列表
    await getList()
  } catch (e) {
    console.log('提交审核报错', e)
  }
}

const handleSubmitAuditBatch = async () => {
  try {
    await message.exportConfirm('是否确认提交审核？')

    // 整单和分行都统一做去重处理 都是取申请单id
    let ids: any = Array.from(new Set(selectionList.value.map((item) => item.id)))

    // // 整单的时候用id做标记取出items里面所有的id
    // if (wholeOrderEnable.value) {
    //   selectList.forEach((item) => {
    //     if (!item?.items?.length) return
    //     item.items.forEach((item) => {
    //       ids.push(item.id)
    //     })
    //   })
    // } else {
    //   // 分行的时候用purchaseOrderId做标记取出id
    //   selectList.forEach((item) => {
    //     ids.push(item.purchaseOrderId)
    //   })
    // }

    await PurchaseRequestApi.submitPurchaseAudit(ids)
    message.success('提交审核成功')
    // 刷新列表
    await getList()
  } catch (e) {
    console.log('提交审核报错', e)
  }
}

const handleUpdateStatusEnableBatch = async (enable: boolean) => {
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
//     return selectionList.value.every((item: any) => item.rowOffStatus * 1 === 1)
//   }
// })

// const closeBtnDisabled = computed(() => {
//   if (!selectionList.value?.length) return true
//   if (wholeOrderEnable.value) {
//     return selectionList.value.every((item: any) => item.offStatus * 1 !== 1)
//   } else {
//     return selectionList.value.every((item: any) => item.rowOffStatus * 1 !== 1)
//   }
// })

const disabledBtn = computed(() => selectionList.value.length === 0)
/** 初始化 **/
onMounted(async () => {
  await getList()
  // 加载产品、仓库列表、供应商
  productList.value = await ProductApi.getProductSimpleList()
  // supplierList.value = await SupplierApi.getSupplierSimpleList()
  userList.value = await UserApi.getSimpleUserList()
})
// TODO 芋艿：可优化功能：列表界面，支持导入
// TODO 芋艿：可优化功能：详情界面，支持打印
</script>
