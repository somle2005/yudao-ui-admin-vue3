<template>
  <!-- <doc-alert title="【采购】采购订单、入库、退货" url="https://doc.iocoder.cn/erp/purchase/" /> -->

  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="单据编号" prop="no">
        <el-input
          v-model="queryParams.no"
          placeholder="请输入单据编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="产品" prop="productId">
        <el-select
          v-model="queryParams.productId"
          clearable
          filterable
          placeholder="请选择产品"
          class="!w-240px"
        >
          <el-option
            v-for="item in productList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="单据时间" prop="noTime">
        <el-date-picker
          v-model="queryParams.noTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="供应商" prop="supplierId">
        <el-select
          v-model="queryParams.supplierId"
          clearable
          filterable
          placeholder="请选择供供应商"
          class="!w-240px"
        >
          <el-option
            v-for="item in supplierList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建人" prop="creator">
        <el-select
          v-model="queryParams.creator"
          clearable
          filterable
          placeholder="请选择创建人"
          class="!w-240px"
        >
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="item.nickname"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-240px">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.ERP_AUDIT_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
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
          v-hasPermi="['erp:purchase-order:update-status']"
        >
          提交审核
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
      </el-form-item>
    </el-form>
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
      <template #status="{ scope }">
        <dict-tag :type="DICT_TYPE.COMMON_BOOLEAN_STATUS" :value="scope.row.status || ''" />
      </template>

      <template #auditStatus="{ scope }">
        <dict-tag :type="DICT_TYPE.ERP_AUDIT_STATUS" :value="scope.row.auditStatus || ''" />
      </template>

      <template #executeStatus="{ scope }">
        <dict-tag :type="DICT_TYPE.ERP_EXECUTE_STATUS" :value="scope.row.executeStatus || ''" />
      </template>

      <template #inStatus="{ scope }">
        <dict-tag :type="DICT_TYPE.ERP_STORAGE_STATUS" :value="scope.row.inStatus || ''" />
      </template>

      <template #offStatus="{ scope }">
        <dict-tag :type="DICT_TYPE.ERP_OFF_STATUS" :value="scope.row.offStatus || ''" />
      </template>

      <template #rowOffStatus="{ scope }">
        <dict-tag :type="DICT_TYPE.ERP_OFF_STATUS" :value="scope.row.rowOffStatus || ''" />
      </template>

      <template #operate="{ scope }">
        <!-- <el-button
          link
          @click="openForm('detail', scope.row.id)"
          v-hasPermi="['erp:purchase-order:query']"
        >
          详情
        </el-button> -->
        <el-button
          link
          type="primary"
          @click="openForm('update', scope.row.id)"
          v-hasPermi="['erp:purchase-order:update']"
          :disabled="scope.row.status === 20"
        >
          编辑
        </el-button>
        <el-button
          link
          type="primary"
          @click="handleUpdateStatus(scope.row.id, 20)"
          v-hasPermi="['erp:purchase-order:update-status']"
          v-if="![5].includes(scope.row.status)"
        >
          审核
        </el-button>
        <el-button
          link
          type="danger"
          @click="handleUpdateStatus(scope.row.id, 10)"
          v-hasPermi="['erp:purchase-order:update-status']"
          v-if="scope.row.status === 5"
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
import { dateFormatter2 } from '@/utils/formatTime'
import download from '@/utils/download'
import { PurchaseOrderApi, PurchaseOrderVO } from '@/api/erp/purchase/order'
import PurchaseOrderForm from './PurchaseOrderForm.vue'
import { ProductApi, ProductVO } from '@/api/erp/product/product'
import { UserVO } from '@/api/system/user'
import * as UserApi from '@/api/system/user'
import { erpCountTableColumnFormatter, erpPriceTableColumnFormatter } from '@/utils'
import { SupplierApi, SupplierVO } from '@/api/erp/purchase/supplier'
import { useTableData } from '@/components/SmTable/src/utils'
import { useBatch } from './hooks/useBatch'
import { cloneDeep } from 'lodash-es'
import { mergeItemsToList } from '@/utils/transformData'

const { tableOptions, transformTableOptions } = useTableData()

// 字段是不是从items里面取麻烦标明一下 各个状态的字典值记得取一下
const fieldMap = {
  no: '单据编号', // 采购单编号
  noTime: {
    label: '单据日期',
    formatter: dateFormatter2, // 年月日-金蝶
    width: '180px'
  },
  supplierName: '供应商',
  auditStatus: {
    label: '审核状态',
    slot: 'auditStatus'
  }, // AuditStatus

  executeStatus: {
    label: '执行状态',
    slot: 'executeStatus'
  },
  inStatus: {
    label: '入库状态',
    slot: 'inStatus'
  },
  offStatus: {
    label: '关闭状态',
    slot: 'offStatus'
  }, // items

  rowOffStatus: {
    label: '行关闭状态',
    slot: 'rowOffStatus'
  }, // items

  // 8:  '入库核销状态',

  taxPrice: '税额', // items
  allAmount: '价税合计', // items
  // 26: '已执行已入库数量',
  // 27: '已执行未入库数量',
  createUserName: '制单人', // items
  // 29: '制单时间',

  // 区分是不是整单iems里面数据再做区分

  operate: {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '220px'
  }
}

const branchOptions = transformTableOptions(fieldMap, { noWidth: true })
tableOptions.value = cloneDeep(branchOptions)

// tableOptions.value.forEach(item => {
//   if(item.width === '100px') {
//     item.width = '200px'
//   }
// })

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

    // const computeSum = (items: any[], key: string) => {
    //   if (!items?.length) return
    //   return items.reduce((prev, cur) => {
    //     if (cur[key]) {
    //       return cur[key] + prev
    //     }
    //     return prev
    //   }, 0)
    // }
    // wholeOrderList.value = cloneDeep(data.list).map((item) => {
    //   const keyList = ['count', 'approveCount', 'taxPrice', 'allAmount']
    //   keyList.forEach((key) => {
    //     item[key] = computeSum(item.items, key)
    //   })
    //   return item
    // })

    wholeOrderList.value = cloneDeep(data.list)
    itemsList.value = mergeItemsToList(data.list, {
      id: 'rowItemsId',
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

/** 审批/反审批操作 */
const handleUpdateStatus = async (id: number, status: number) => {
  try {
    // 审批的二次确认
    await message.confirm(`确定${status === 20 ? '审批' : '反审批'}该订单吗？`)
    // 发起审批
    await PurchaseOrderApi.updatePurchaseOrderStatus(id, status)
    message.success(`${status === 20 ? '审批' : '反审批'}成功`)
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

const { disabledBtn, handleUpdateStatusEnableBatch, handleSubmitAuditBatch } = useBatch(
  selectionList,
  getList,
  wholeOrderEnable
)

const createWholeOrder = (branchOptions) => {
  const map = {
    no: '单据编号', // 采购单编号
    noTime: '单据日期',
    supplierName: '供应商',
    auditStatus: '审核状态',
    executeStatus: '执行状态',
    inStatus: '入库状态',
    offStatus: '关闭状态',
    taxPrice: '税额', // items
    allAmount: '价税合计', // items
    createUserName: '制单人', // items

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

/** 初始化 **/
onMounted(async () => {
  await getList()
  // 加载产品、仓库列表、供应商
  productList.value = await ProductApi.getProductSimpleList()
  supplierList.value = await SupplierApi.getSupplierSimpleList()
  userList.value = await UserApi.getSimpleUserList()
})

// TODO 芋艿：可优化功能：列表界面，支持导入
// TODO 芋艿：可优化功能：详情界面，支持打印
</script>
