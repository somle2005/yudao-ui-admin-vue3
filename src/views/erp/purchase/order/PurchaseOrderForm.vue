<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1200">
    <SmForm
      class="-mb-15px"
      ref="formRef"
      isCol
      label-width="150px"
      v-model="formData"
      v-loading="formLoading"
      :options="requestFormOptions"
      :getModelValue="getFormData"
      :disabled="disabled"
    >
      <!-- <template #primaryImageUrl="{ scope, model }">
      <UploadImg v-model="model[scope.prop]" />
    </template> -->
      <!-- <template #action>
      <div class="moreBtnList">
        <el-button type="primary" @click="handleQuery"> 确定</el-button>
      </div>
    </template> -->
      <!-- <template #items="{ scope, model }"> 
       {{ console.log(scope, model, '打印scope-model') }}  -->

      <template #fileUrl="{ model }">
        <UploadFile :is-show-tip="false" v-model="model.fileUrl" :limit="1" />
      </template>

      <template #items>
        <el-button type="primary" @click="selectApplicantItem" style="margin-bottom: 10px"
          >选择申请项</el-button
        >

        <el-tabs v-model="subTabsName" class="-mt-15px -mb-10px" style="width: 100%">
          <el-tab-pane label="订单产品清单" name="item">
            <PurchaseOrderItemForm ref="itemFormRef" :items="formData.items" :disabled="disabled" />
            <!-- <ItemsForm ref="itemFormRef" :items="formData.items" :formType="formType" /> -->
          </el-tab-pane>
        </el-tabs>
      </template>
    </SmForm>

    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading" v-if="!disabled">
        确 定
      </el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>

  <Dialog title="采购申请项" v-model="applicantItemDialog" width="1000">
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
      </SmTable>
    </ContentWrap>
    <template #footer>
      <el-button @click="addApplicantItem" type="primary"> 确 定 </el-button>
      <el-button @click="applicantItemDialog = false">取 消</el-button>
    </template>
  </Dialog>

  <!-- 可订单的申请列表 -->
  <!-- <PurchaseRequestOrderEnableList
    ref="purchaseRequestOrderEnableListRef"
    @success="handlePurchaseRequestChange"
  /> -->
</template>
<script setup lang="ts">
import { PurchaseOrderApi, PurchaseOrderVO } from '@/api/erp/purchase/order'
import PurchaseOrderItemForm from './components/PurchaseOrderItemForm.vue'
import { SupplierApi, SupplierVO } from '@/api/erp/purchase/supplier'
import { erpPriceInputFormatter, erpPriceMultiply } from '@/utils'
import { AccountApi, AccountVO } from '@/api/erp/finance/account'
import { PurchaseRequestVO } from '@/api/erp/purchase/request'
import { getAccountList, getFinanceSubjectList, getSupplierList } from '@/commonData'
import { FinanceSubjectVO } from '@/api/erp/finance/subject'
import { DICT_TYPE } from '@/utils/dict'
import { useApplicantTable } from './hooks/useApplicantTable'
import { distinctList } from '@/utils/transformData'

let {
  queryParams,
  list,
  tableOptions,
  loading,
  total,
  selectionList,
  handleSelectionChange,
  getList,
  selectApplicantItem,
  applicantItemDialog
} = useApplicantTable()

/** ERP 销售订单表单 */
defineOptions({ name: 'PurchaseOrderForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改；detail - 详情

const formData: any = ref({})

const initFormData = () => {
  return {
    id: undefined,
    no: undefined,
    noTime: undefined,
    supplierId: undefined,
    accountId: undefined,
    settlementDate: undefined,
    orderTime: undefined,
    depositPrice: undefined,
    fileUrl: undefined,
    remark: undefined,
    items: []
  }
}

formData.value = initFormData()

const formRules = reactive({
  supplierId: [{ required: true, message: '供应商不能为空', trigger: 'blur' }],
  orderTime: [{ required: true, message: '订单时间不能为空', trigger: 'blur' }]
})
const disabled = computed(() => formType.value === 'detail')
const formRef = ref() // 表单 Ref
const supplierList = ref<SupplierVO[]>([]) // 供应商列表
const accountList = ref<AccountVO[]>([]) // 账户列表
const financeSubjectList = ref<FinanceSubjectVO[]>([])

/** 子表的表单 */
const subTabsName = ref('item')
const itemFormRef = ref()

/** 计算 discountPrice、totalPrice 价格 */
watch(
  () => formData.value,
  (val) => {
    if (!val) {
      return
    }
    // const totalPrice = val.items.reduce((prev, curr) => prev + curr.totalPrice, 0)
    // const discountPrice =
    //   val.discountPercent != null ? erpPriceMultiply(totalPrice, val.discountPercent / 100.0) : 0
    // formData.value.discountPrice = discountPrice
    // formData.value.totalPrice = totalPrice - discountPrice
  },
  { deep: true }
)

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await PurchaseOrderApi.getPurchaseOrder(id)
    } finally {
      formLoading.value = false
    }
  }
  // 加载供应商列表
  // supplierList.value = await SupplierApi.getSupplierSimpleList()
  getSupplierList(supplierList)
  // 加载账户列表
  getAccountList(accountList)
  // accountList.value = await AccountApi.getAccountSimpleList()
  getFinanceSubjectList(financeSubjectList)
  // const defaultAccount = accountList.value.find((item) => item.defaultStatus)
  // if (defaultAccount) {
  //   formData.value.accountId = defaultAccount.id
  // }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 打开【可入库的订单列表】弹窗 */
const purchaseRequestOrderEnableListRef = ref() // 可入库的订单列表 Ref
const openPurchaseRequestOrderEnableList = () => {
  purchaseRequestOrderEnableListRef.value.open()
}

const handlePurchaseRequestChange = (request: PurchaseRequestVO) => {
  // 将申请单设置到订单
  formData.value.requestId = request.id
  formData.value.requestNo = request.no
  formData.value.accountId = request.accountId
  formData.value.remark = request.remark
  formData.value.fileUrl = request.fileUrl
  // 将申请单设置到订单项
  request.items.forEach((item) => {
    item.totalCount = item.count
    item.count = item.totalCount - item.orderCount
    item.requestItemId = item.id
    item.id = undefined
  })
  formData.value.items = request.items.filter((item) => item.count > 0)
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  await itemFormRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    let data = formData.value as unknown as PurchaseOrderVO
    if (itemFormRef?.value?.formData) {
      data.items = itemFormRef.value.formData
    }
    if (formType.value === 'create') {
      await PurchaseOrderApi.createPurchaseOrder(data)
      message.success(t('common.createSuccess'))
    } else {
      await PurchaseOrderApi.updatePurchaseOrder(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = initFormData()
  formRef.value?.resetFields()
}

const requestFormOptions = ref([
  {
    type: 'input',
    label: '单据编号',
    prop: 'no',
    placeholder: '保存时自动生成',
    attrs: {
      style: { width: '100%' },
      clearable: true,
      disabled: true
    }
  },
  {
    type: 'date-picker',
    placeholder: '请选择单据日期',
    prop: 'noTime',
    label: '单据日期',
    attrs: {
      clearable: true,
      type: 'date',
      'value-format': 'x',
      class: '!w-1/1',
      style: {
        width: '100%'
      }
    }
    // rules: [
    //   {
    //     required: true,
    //     message: '单据日期不能为空',
    //     trigger: 'blur'
    //   }
    // ]
  },
  {
    type: 'select',
    placeholder: '请选择供应商',
    prop: 'supplierId',
    label: '供应商',
    attrs: {
      filterable: true,
      clearable: true,
      style: {
        width: '100%'
      }
    },
    children: supplierList
  },
  {
    type: 'select',
    placeholder: '请选择结算账户',
    prop: 'accountId',
    label: '结算账户',
    attrs: {
      filterable: true,
      clearable: true,
      style: {
        width: '100%'
      }
    },
    children: accountList
  },

  {
    type: 'select',
    placeholder: '请选择财务主体',
    prop: 'purchaseEntityId',
    label: '财务主体',
    attrs: {
      filterable: true,
      clearable: true,
      style: {
        width: '100%'
      }
    },
    children: financeSubjectList
  },

  {
    type: 'date-picker',
    placeholder: '请选择结算日期',
    prop: 'settlementDate',
    label: '结算日期',
    attrs: {
      clearable: true,
      type: 'date',
      'value-format': 'x',
      class: '!w-1/1',
      style: {
        width: '100%'
      }
    }
  },
  {
    type: 'input-number',
    placeholder: '请输入定金金额',
    prop: 'depositPrice',
    label: '定金金额',
    attrs: {
      'controls-position': 'right',
      min: 0,
      precision: 2,
      // class: '!w-1/1',
      style: {
        width: '100%'
      }
    }
  },

  {
    type: 'input',
    label: '收货地址',
    prop: 'address',
    placeholder: '请输入收货地址',
    attrs: {
      style: { width: '100%' },
      clearable: true
    }
  },
  {
    type: 'input',
    label: '付款条款',
    prop: 'paymentTerms',
    placeholder: '请输入付款条款',
    attrs: {
      style: { width: '100%' },
      clearable: true
    }
  },
  {
    type: 'input',
    label: '备注',
    prop: 'remark',
    placeholder: '请输入备注',
    attrs: {
      type: 'textarea',
      style: { width: '100%' },
      clearable: true
    }
  },
  {
    // colConfig: { span: 24 },
    prop:"fileUrl",
    label: '附件',
    slot: 'fileUrl'
  },
  {
    colConfig: { span: 24 },
    slot: 'items',
    formItemConfig: {
      class: 'purchase-request-items'
    }
  }
])
const getFormData = () => {
  return formData.value
}

const addApplicantItem = () => {
  applicantItemDialog.value = false
  nextTick(() => {
    const items = formData.value.items
    const selectList = selectionList.value.map((item: any) => {
      const {
        erpPurchaseRequestItemId,
        productId,
        productBarCode,
        productName,
        approveCount,
        actTaxPrice,
        taxPercent,
        taxPrice,
        warehouseId,
        expectArrivalDate,
        no
      } = item
      const obj = {
        erpPurchaseRequestItemId,
        productId,
        productName,
        productBarCode,
        count: approveCount || 0,
        actTaxPrice,
        taxPercent,
        taxPrice, //税额需要动态计算
        warehouseId,
        deliveryTime: expectArrivalDate,
        erpPurchaseRequestItemNo: no
      }
      return obj
    })
    formData.value.items = distinctList(items, selectList, 'erpPurchaseRequestItemId')
  })
}
</script>
<style lang="scss" scoped>
@use '../../../../styles/comonForm.scss' as *;
</style>
