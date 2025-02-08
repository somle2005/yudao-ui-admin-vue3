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
      <el-form-item label="申请单号" prop="no">
        <el-input
          v-model="queryParams.no"
          placeholder="请输入申请单号"
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
      <el-form-item label="申请时间" prop="requestTime">
        <el-date-picker
          v-model="queryParams.requestTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <!-- <el-form-item label="供应商" prop="supplierId">
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
      </el-form-item> -->
      <el-form-item label="申请人" prop="creator">
        <el-select
          v-model="queryParams.applicant"
          clearable
          filterable
          placeholder="请选择申请人"
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
      <!-- <el-form-item label="创建人" prop="creator">
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
      </el-form-item> -->
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
      <!-- <el-form-item label="备注" prop="remark">
        <el-input
          v-model="queryParams.remark"
          placeholder="请输入备注"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item> -->
      <!-- <el-form-item label="入库数量" prop="inStatus">
        <el-select
          v-model="queryParams.inStatus"
          placeholder="请选择入库数量"
          clearable
          class="!w-240px"
        >
          <el-option label="未入库" value="0" />
          <el-option label="部分入库" value="1" />
          <el-option label="全部入库" value="2" />
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="退货数量" prop="returnStatus">
        <el-select
          v-model="queryParams.returnStatus"
          placeholder="请选择退货数量"
          clearable
          class="!w-240px"
        >
          <el-option label="未退货" value="0" />
          <el-option label="部分退货" value="1" />
          <el-option label="全部退货" value="2" />
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button type="primary" plain @click="openForm('create')">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>

        <!-- <el-button
          type="danger"
          plain
          @click="handleDelete(selectionList.map((item) => item.id))"
          :disabled="selectionList.length === 0"
        >
          <Icon icon="ep:delete" class="mr-5px" /> 删除
        </el-button> -->

        <!-- <el-button
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
          type="danger"
          plain
          @click="handleDelete(selectionList.map((item) => item.id))"
          v-hasPermi="['erp:purchase-request:delete']"
          :disabled="selectionList.length === 0"
        >
          <Icon icon="ep:delete" class="mr-5px" /> 删除
        </el-button> -->
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <!-- <ContentWrap>
    <el-table
      v-loading="loading"
      :data="list"
      :stripe="true"
      :show-overflow-tooltip="true"
      @selection-change="handleSelectionChange"
    >
      <el-table-column width="30" label="选择" type="selection" />
      <el-table-column min-width="180" label="申请单号" align="center" prop="no" />
      <el-table-column label="产品信息" align="center" prop="productNames" min-width="200" />
      <!~~ <el-table-column label="供应商" align="center" prop="supplierName" /> ~~>
      <el-table-column
        label="申请时间"
        align="center"
        prop="requestTime"
        :formatter="dateFormatter2"
        width="120px"
      />
      <el-table-column label="申请人" align="center" prop="applicantName" />
      <!~~ <el-table-column label="创建人" align="center" prop="creatorName" /> ~~>
      <el-table-column
        label="总数量"
        align="center"
        prop="totalCount"
        :formatter="erpCountTableColumnFormatter"
      />
      <!~~ <el-table-column
        label="入库数量"
        align="center"
        prop="inCount"
        :formatter="erpCountTableColumnFormatter"
      />
      <el-table-column
        label="退货数量"
        align="center"
        prop="returnCount"
        :formatter="erpCountTableColumnFormatter"
      />
      <el-table-column
        label="金额合计"
        align="center"
        prop="totalProductPrice"
        :formatter="erpPriceTableColumnFormatter"
      />
      <el-table-column
        label="含税金额"
        align="center"
        prop="totalPrice"
        :formatter="erpPriceTableColumnFormatter"
      />
      <el-table-column
        label="支付订金"
        align="center"
        prop="depositPrice"
        :formatter="erpPriceTableColumnFormatter"
      /> ~~>
      <el-table-column label="状态" align="center" fixed="right" width="90" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.ERP_AUDIT_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="220">
        <template #default="scope">
          <el-button
            link
            @click="openForm('detail', scope.row.id)"
            v-hasPermi="['erp:purchase-request:query']"
          >
            详情
          </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['erp:purchase-request:update']"
            :disabled="scope.row.status === 20"
          >
            编辑
          </el-button>
          <el-button
            link
            type="primary"
            @click="handleUpdateStatus(scope.row.id, 20)"
            v-hasPermi="['erp:purchase-request:update-status']"
            v-if="scope.row.status === 10"
          >
            审批
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleUpdateStatus(scope.row.id, 10)"
            v-hasPermi="['erp:purchase-request:update-status']"
            v-else
          >
            反审批
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete([scope.row.id])"
            v-hasPermi="['erp:purchase-request:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!~~ 分页 ~~>
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>-->

  <!-- 列表 -->
  <ContentWrap>
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
    >
      <template #status="{ scope }">
        <dict-tag :type="DICT_TYPE.ERP_AUDIT_STATUS" :value="scope.row.status || ''" />
      </template>

      <template #orderStatus="{ scope }">
        <dict-tag :type="DICT_TYPE.SRP_ORDER_STATUS" :value="scope.row.orderStatus || ''" />
      </template>

      <template #offStatus="{ scope }">
        <dict-tag :type="DICT_TYPE.ERP_OFF_STATUS" :value="scope.row.offStatus || ''" />
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

        <el-button
          link
          type="primary"
          @click="handleUpdateStatus(scope.row.id, 20,true)"
          v-hasPermi="['erp:purchase-request:audit-status']"
          v-if="![5,20].includes(scope.row.status)"
        >
          审核
        </el-button>

        <el-button
          link
          type="danger"
          @click="handleUpdateStatus(scope.row.id,5,false)"
          v-hasPermi="['erp:purchase-request:audit-status']"
          v-if="scope.row.status === 20"
        >
          反审核
        </el-button>



        <el-button
          link
          type="primary"
          @click="handleUpdateStatusEnable(scope.row.id, scope.row.purchaseOrderId, true)"
          v-hasPermi="['erp:purchase-request:enable']"
          v-if="scope.row.offStatus !== 1"
        >
          开启
        </el-button>

        <el-button
          link
          type="danger"
          @click="handleUpdateStatusEnable(scope.row.id, scope.row.purchaseOrderId, false)"
          v-hasPermi="['erp:purchase-request:enable']"
           v-if="scope.row.offStatus === 1"
        >
          关闭
        </el-button>



        <!-- <el-button
          link
          @click="openForm('detail', scope.row.id)"
          v-hasPermi="['erp:purchase-request:query']"
        >
          详情
        </el-button>
        <el-button
          link
          type="primary"
          @click="openForm('update', scope.row.id)"
          v-hasPermi="['erp:purchase-request:update']"
          :disabled="scope.row.status === 20"
        >
          编辑
        </el-button>

        <el-button
          link
          type="primary"
          @click="handleUpdateStatus(scope.row.id, 20)"
          v-hasPermi="['erp:purchase-request:update-status']"
          v-if="scope.row.status === 10"
        >
          审批
        </el-button>

        <el-button
          link
          type="danger"
          @click="handleUpdateStatus(scope.row.id, 10)"
          v-hasPermi="['erp:purchase-request:update-status']"
          v-else
        >
          反审批
        </el-button>
        <el-button
          link
          type="danger"
          @click="handleDelete([scope.row.id])"
          v-hasPermi="['erp:purchase-request:delete']"
        >
          删除
        </el-button> -->
      </template>
    </SmTable>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <PurchaseRequestForm ref="formRef" @success="getList" />
  <!-- v-model="formData" -->
  <!-- :modelValue="formData"
  @update:model-value="updateModelValue" -->
  <Dialog width="1400" :title="dialogTitle" v-model="dialogVisible">
    <SmForm
      class="-mb-15px"
      ref="smFormRef"
      isCol
      label-width="150px"
      v-model="formData"
      v-loading="formLoading"
      :options="requestFormOptions"
      :getModelValue="getFormData"
    >
      <!-- <template #primaryImageUrl="{ scope, model }">
        <UploadImg v-model="model[scope.prop]" />
      </template> -->
      <!-- <template #action>
        <div class="moreBtnList">
          <el-button type="primary" @click="handleQuery"> 确定</el-button>
        </div>
      </template> -->

      <template #items="{ scope, model }">
        {{ console.log(scope, model, '打印scope-model') }}
        <el-tabs v-model="subTabsName" class="-mt-15px -mb-10px" style="width: 100%">
          <el-tab-pane label="申请产品清单" name="item">
            <itemsForm ref="itemFormRef" :items="formData.items" :formType="formType"  />
            <!-- <PurchaseRequestItemForm ref="itemFormRef" :items="formData.items" :disabled="disabled" /> -->
          </el-tab-pane>
        </el-tabs>
      </template>
    </SmForm>
    <div class="moreBtnList">
      <el-button @click="dialogVisible = false"> 取消</el-button>
      <el-button type="primary" :disabled="formLoading" @click="submitForm"> 确定</el-button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter, dateFormatter2 } from '@/utils/formatTime'
import download from '@/utils/download'
import { PurchaseRequestApi, PurchaseRequestVO } from '@/api/erp/purchase/request'
import PurchaseRequestForm from './PurchaseRequestForm.vue'
import { ProductApi, ProductVO } from '@/api/erp/product/product'
import { UserVO } from '@/api/system/user'
import * as UserApi from '@/api/system/user'
import { erpCountTableColumnFormatter, erpPriceTableColumnFormatter } from '@/utils'
import { useTableData } from '@/components/SmTable/src/utils'
import { mergeItemsToList } from '@/utils/transformData'
import { usePurchaseRequestForm } from './hooks'
// import { SupplierApi, SupplierVO } from '@/api/erp/purchase/supplier'
import itemsForm from './itemsForm.vue'

const { tableOptions, transformTableOptions } = useTableData()

/**
1-单据日期-有-requestTime
2-单据编号-有-no
3-申请人-有-applicant
4-申请部门-有-applicationDept
5-审核状态-有-status
6-订购状态-有-orderStatus
7-关闭状态-有-offStatus

8-未订购数量-有-(在items里面-unOrderCount)
9-已订购数量-有-(在items里面-orderCount)
10-已入库数量-有-(在items里面-inQty)
11-行采购状态-(文档无描述)-(在items里面-行采购状态-orderStatus)
// 12-行关闭状态-(文档无描述)-完全没有-后端说不要
13-商品编码-无-完全没有-后端barCode
14-商品名称-有-(在items里面-productName)
15-单位。-有-(在items里面-productUnitName)
16-申请数量-有-(在items里面-后端无返回-count)
17-批准数量-有-(在items里面-approveCount)
18-参考单价-(文档无描述)-(在items里面-referenceUnitPrice)
19-含税单价-有-(在items里面-actTaxPrice)
20-税额-(文档无描述)-(在items里面-taxPrice)
21-价税合计-有-(在items里面-allAmount)
22-制单人-creator
23-制单时间-createTime
24-审核人-auditor
25-审核时间-auditTime
 */

const fieldMap = {
  requestTime: {
    label: '单据日期',
    formatter: dateFormatter2, // 年月日-金蝶
    width: '180px'
  },
  no: {
    label: '单据编号',
    width: '200px'
  },
  applicant: '申请人',
  applicationDept: '申请部门',
  status: {
    label: '审核状态',
    slot: 'status'
  },
  orderStatus: {
    label: '订购状态',
    slot: 'orderStatus'
  },
  offStatus: {
    label: '关闭状态',
    slot: 'offStatus'
  },

  unOrderCount: '未订购数量',
  orderCount: '已订购数量',
  inQty: '已入库数量',
  // 改造别名
  rowOrderStatus: '行采购状态',
  barCode: '商品编码',
  productName: '商品名称',
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
    formatter: dateFormatter, // 时间可能要转化
    width: '180px'
  },
  auditor: '审核人',
  auditTime: {
    label: '审核时间',
    formatter: dateFormatter, // 时间可能要转化
    width: '180px'
  },

  operate: {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    // action: true,
    width: '250px'
  }
}
tableOptions.value = transformTableOptions(fieldMap)

/** ERP 采购申请列表 */
defineOptions({ name: 'ErpPurchaseRequest' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<PurchaseRequestVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
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

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await PurchaseRequestApi.getPurchaseRequestPage(queryParams)
    // list.value = data.list
    list.value = mergeItemsToList(data.list, {
      id: 'purchaseOrderId',
      orderStatus: 'rowOrderStatus'
    })
    // 后续需要补充itemsTotal
    total.value = data.itemsTotal || data.total
  } finally {
    loading.value = false

    // var testData = [
    //   {
    //     id: 32561,
    //     no: 'string',
    //     applicant: 'string',
    //     applicantName: '芋道',
    //     applicationDept: 'string',
    //     requestTime: '2019-08-24T14:15:22.123Z',
    //     status: 2,
    //     offStatus: 1,
    //     orderStatus: 1,
    //     auditor: 'string',
    //     auditTime: '2019-08-24T14:15:22.123Z',
    //     createTime: '2019-08-24T14:15:22.123Z',
    //     items: [
    //       {
    //         id: 11756,
    //         warehouseId: 3113,
    //         productId: 3113,
    //         productPrice: 100,
    //         count: 100,
    //         remark: '随便',
    //         orderStatus: '行状态成功'
    //       },
    //       {
    //         id: 117561,
    //         warehouseId: 31131,
    //         productId: 31131,
    //         productPrice: 1001,
    //         count: 1001,
    //         remark: '随便1',
    //         orderStatus: '行状态失败'
    //       }
    //     ],
    //     productNames: 'string',
    //     totalCount: 100
    //   }
    // ]
    // list.value = mergeItemsToList(testData, {
    //   id: 'purchaseOrderId',
    //   orderStatus: 'rowOrderStatus'
    // })
    // total.value = 2
    // console.log('list.value', list.value)
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
// const openForm = (type: string, id?: number) => {
//   formRef.value.open(type, id)
// }

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
const handleUpdateStatus = async (requestId: number, status: number,reviewed: boolean) => {
  /**
    已审核 20
    审核不通过 14
    未审核 10
    反审核 5
    (只要不是已审核或者反审核)-10(出现审核)
    已审核-20(出现反审核)
   */
  // 执行审核操作
  if(reviewed) {
    openForm('audit', requestId)
    return
  }
  try {
    // 审核的二次确认
    await message.confirm(`确定${status === 20 ? '审核' : '反审核'}该申请吗？`)
    // 发起审核
    // await PurchaseRequestApi.updatePurchaseRequestStatus(id, status)
    await PurchaseRequestApi.updatePurchaseRequestAuditStatus({requestId, reviewed})
    message.success(`${status === 20 ? '审核' : '反审核'}成功`)
    // 刷新列表
    await getList()
  } catch {}
}

/** 关闭/启用申请单 */
const handleUpdateStatusEnable =  async (requestId:number,itemId:number[],enable:boolean) => {
  /**
    手动关闭 3
    已关闭 2
    开启 1
   */
   try {
    // 开启的二次确认
    await message.confirm(`确定${enable ? '开启' : '关闭'}该申请吗？`)
    // 发起开启
    // await PurchaseRequestApi.updatePurchaseRequestStatus(id, status)
    await PurchaseRequestApi.updatePurchaseRequestStatusEnable({requestId, itemId ,enable})
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

/** 选中操作 */
const selectionList = ref<PurchaseRequestVO[]>([])
const handleSelectionChange = (rows: PurchaseRequestVO[]) => {
  selectionList.value = rows
}

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

const resetFormData = () => {
  return reactive({
    requestTime: undefined,
    applicant: undefined,
    applicationDept: undefined,
    supplierId: undefined,
    deliveryDelivery: '',
    items: [] as any
    // productId: undefined,
    // barCode: undefined
  })
}
// eslint-disable-next-line prefer-const
let formData = resetFormData()

const getResetFormData = () => {
  formData = resetFormData()
}

const getFormData = () => {
  return formData
}

let {
  dialogTitle,
  dialogVisible,
  openForm,
  requestFormOptions,
  smFormRef,
  submitForm,
  subTabsName,
  itemFormRef,
  formLoading,
  formType
} = usePurchaseRequestForm({ getResetFormData, getFormData, successCallback: getList })


</script>
<style lang="scss" scoped>
.moreBtnList {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}
:global(.purchase-request-items .el-form-item__content) {
  margin-left: 0 !important;
}
</style>
