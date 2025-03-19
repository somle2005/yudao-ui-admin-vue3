<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1000">
    <SmForm
      class="-mb-15px"
      ref="formRef"
      isCol
      label-width="150px"
      v-model="formData"
      v-loading="formLoading"
      :options="requestFormOptions"
      :getModelValue="getFormData"
    >
      <!-- <template #orderNo="{ model }">
        <el-input v-model="model.orderNo" readonly>
          <template #append>
            <el-button @click="openPurchaseOrderInEnableList">
              <Icon icon="ep:search" /> 选择
            </el-button>
          </template>
        </el-input>
      </template> -->

      <template #fileUrl="{ model, scope }">
        <UploadFile
          :disabled="scope?.attrs?.disabled"
          :is-show-tip="false"
          v-model="model.fileUrl"
          :limit="1"
        />
      </template>

      <template #items>
        <el-button
          :disabled="itemsFormdisabled"
          type="primary"
          @click="openAddItem"
          style="margin-bottom: 10px"
          >选择订单项</el-button
        >
        <el-tabs v-model="subTabsName" class="-mt-15px -mb-10px" style="width: 100%">
          <el-tab-pane label="入库产品清单" name="item">
            <PurchaseInItemForm
              ref="itemFormRef"
              :items="formData.items"
              :disabled="itemsFormdisabled"
            />
          </el-tab-pane>
        </el-tabs>
      </template>
    </SmForm>

    <template #footer>
      <el-button
        v-if="!auditType"
        @click="submitFormDB(AUDIT_TYPE.agree)"
        type="primary"
        :disabled="formLoading"
      >
        确 定
      </el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <template v-if="auditType">
        <el-button type="danger" :disabled="formLoading" @click="submitFormDB(AUDIT_TYPE.reject)">
          不同意</el-button
        >
        <el-button type="primary" :disabled="formLoading" @click="submitFormDB(AUDIT_TYPE.agree)">
          同意</el-button
        >
      </template>
    </template>
  </Dialog>

  <!-- 可入库的订单列表 -->
  <PurchaseInPaymentEnableList ref="addItemRef" @success="addItem" />
</template>
<script setup lang="ts">
import { PurchaseInApi, PurchaseInVO } from '@/api/erp/purchase/in'
import PurchaseInItemForm from './components/PurchaseInItemForm.vue'
import { AccountApi, AccountVO } from '@/api/erp/finance/account'
import { erpPriceInputFormatter, erpPriceMultiply } from '@/utils'
import PurchaseInPaymentEnableList from './components/PurchaseInPaymentEnableList.vue'
import { PurchaseOrderVO } from '@/api/erp/purchase/order'
import * as UserApi from '@/api/system/user'
import { SupplierApi, SupplierVO } from '@/api/erp/purchase/supplier'
import { AUDIT_TYPE } from '@/utils/constant'
import { createDBFn } from '@/utils/decorate'
import { useForm } from './hooks/useForm'
import { computeDiscountPriceAndTotalPrice, distinctList } from '@/utils/transformData'
import { useOutData } from './components/hooks/outdata'
import { id } from 'element-plus/es/locale'

const { addItemRef, openAddItem } = useOutData()

/** ERP 销售入库表单 */
defineOptions({ name: 'PurchaseInForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改；detail - 详情
const initFormData = () => {
  return {
    id: undefined,
    supplierId: undefined,
    accountId: undefined,
    inTime: undefined,
    remark: undefined,
    fileUrl: '',
    discountPercent: 0,
    discountPrice: 0,
    totalPrice: 0,
    otherPrice: 0,
    orderNo: undefined,
    items: [],
    no: undefined // 入库单号，后端返回
  }
}
const formData: any = ref(initFormData())
const formRules = reactive({
  supplierId: [{ required: true, message: '供应商不能为空', trigger: 'blur' }],
  inTime: [{ required: true, message: '入库时间不能为空', trigger: 'blur' }]
})
const disabled = computed(() => formType.value === 'detail')
const formRef = ref() // 表单 Ref
// const supplierList = ref<SupplierVO[]>([]) // 供应商列表
// const accountList = ref<AccountVO[]>([]) // 账户列表
// const userList = ref<UserApi.UserVO[]>([]) // 用户列表

let { auditType, itemsFormdisabled, requestFormOptions, operateAudit, initDialogData } =
  useForm(formType)

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
    // 编辑回显
    computeDiscountPriceAndTotalPrice(formRef, formData.value)
    // 计算
    // const totalPrice = val.items.reduce((prev, curr) => prev + curr.totalPrice, 0)
    // const discountPrice =
    //   val.discountPercent != null ? erpPriceMultiply(totalPrice, val.discountPercent / 100.0) : 0
    // formData.value.discountPrice = discountPrice
    // formData.value.totalPrice = totalPrice - discountPrice + val.otherPrice
  },
  { deep: true }
)

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  operateAudit(type)

  // 初始化弹窗接口数据
  initDialogData()

  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await PurchaseInApi.getPurchaseIn(id)
      // 主动触发表单数据回显
      formRef.value.initForm()
    } finally {
      formLoading.value = false
    }
  }

  // // 加载供应商列表
  // supplierList.value = await SupplierApi.getSupplierSimpleList()
  // // 加载用户列表
  // userList.value = await UserApi.getSimpleUserList()
  // // 加载账户列表
  // accountList.value = await AccountApi.getAccountSimpleList()
  // const defaultAccount = accountList.value.find((item) => item.defaultStatus)
  // if (defaultAccount) {
  //   formData.value.accountId = defaultAccount.id
  // }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

// const handlePurchaseOrderChange = (order: PurchaseOrderVO) => {
//   // 将订单设置到入库单
//   formData.value.orderId = order.id
//   formData.value.orderNo = order.no
//   formData.value.supplierId = order.supplierId
//   formData.value.accountId = order.accountId
//   formData.value.discountPercent = order.discountPercent
//   formData.value.remark = order.remark
//   formData.value.fileUrl = order.fileUrl
//   // 将订单项设置到入库单项
//   order.items.forEach((item) => {
//     item.totalCount = item.count
//     item.count = item.totalCount - item.inCount
//     item.orderItemId = item.id
//     item.id = undefined
//   })
//   formData.value.items = order.items.filter((item) => item.count > 0)
// }

const auditBtnType = ref(AUDIT_TYPE.agree)
/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  await itemFormRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as PurchaseInVO
    if (formType.value === 'create') {
      await PurchaseInApi.createPurchaseIn(data)
      message.success(t('common.createSuccess'))
    } else if (formType.value === 'update') {
      await PurchaseInApi.updatePurchaseIn(data)
      message.success(t('common.updateSuccess'))
    } else if (formType.value === 'audit') {
      await PurchaseInApi.updatePurchaseInAuditStatus({
        reviewed: true,
        pass: auditBtnType.value === AUDIT_TYPE.agree,
        inId: data.id,
        reviewComment: data.reviewComment
      })
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

const changeAuditBtnType = (type) => {
  auditBtnType.value = type
  submitForm()
}
const submitFormDB = createDBFn(changeAuditBtnType)

const getFormData = () => {
  return formData.value
}

/** 重置表单 */
const resetForm = () => {
  // formData.value = {
  //   id: undefined,
  //   supplierId: undefined,
  //   accountId: undefined,
  //   inTime: undefined,
  //   remark: undefined,
  //   fileUrl: undefined,
  //   discountPercent: 0,
  //   discountPrice: 0,
  //   totalPrice: 0,
  //   otherPrice: 0,
  //   items: []
  // }
  formData.value = initFormData()
  nextTick(() => {
    formRef.value?.resetFields()
  })
}

const addItem = (selectionList: any[]) => {
  // reconciliationStatus 对账状态(false:未对账 ，true:已对账) 看看是不是要加上
  nextTick(() => {
    const items = formData.value.items
    const itemIdKey = 'orderItemId'
    const selectList = selectionList.map((item: any) => {
      /**
       * 采购入库需要 orderNo 采购订单编号
       * orderItemId 采购订单项编号
       * warehouseId 仓库编号
       * productId 产品编号 productBarCode 单位 unitName unitId model型号规格 可能要从product对象里面取list数据转化一下
       * 外部有  productUnitId  productPrice 产品单价
        count 产品数量
        taxPercent 税率，百分比
        taxPrice 税额
        actTaxPrice 含税单价
        allAmount 价税合计
        remark 备注

        settlementDate 结算日期 和order一致
        containerRate 箱率

        和丁哥确认下带过来的这个是否可变
        applicantId-申请人id
        applicantName-申请人名称

        applicationDeptId-申请部门id
        applicationDeptName-申请部门名称

       */
      // 采购订单分页需带出数据
      const {
        no,
        rowItemsId, //list记得转化
        productId,
        productName,
        productBarCode,
        productUnitId, // 列表要转化取item-product里面数据
        productUnitName, //列表要转化取item-product里面数据
        model, // //列表要转化取item-product里面数据

        productPrice,
        count,

        taxPercent,
        taxPrice,
        actTaxPrice,
        allAmount,
        remark,
        settlementDate,
        containerRate,

        warehouseId,
        expectArrivalDate,

        currencyId,
        applicantId,
        applicantName,
        applicationDeptId,
        departmentName
      } = item

      /**
       * 采购入库需要的数据和回显name数据
       * 无法带出的内容有 exchangeRate-source
       */
      const obj = {
        orderNo: no,
        [itemIdKey]: rowItemsId, //list记得转化
        productId,
        productName,
        productBarCode,
        productUnitName, //列表要转化取item-product里面数据
        productUnitId, // 列表要转化取item-product里面数据
        model, // //列表要转化取item-product里面数据

        productPrice,
        count,
        taxPercent,
        taxPrice,
        actTaxPrice,
        allAmount,
        remark,
        settlementDate,
        containerRate,

        warehouseId,
        expectArrivalDate,

        currencyId,
        applicantId,
        applicantName,
        applicationDeptId,
        applicationDeptName: departmentName
        // productPrice: actTaxPrice
      }
      return obj
    })
    formData.value.items = distinctList(items, selectList, itemIdKey)
  })
}
</script>
<style lang="scss" scoped>
@use '../../../../styles/comonForm.scss' as *;
</style>
