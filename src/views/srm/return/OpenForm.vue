<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
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
          v-if="showAddBtn"
          :disabled="addBtnDisabled"
          type="primary"
          @click="openAddItem(formData.supplierId)"
          style="margin-bottom: 10px"
          >选择到货项</el-button
        >
        <el-tabs v-model="subTabsName" class="-mt-15px -mb-10px" style="width: 100%">
          <el-tab-pane label="退货产品清单" name="item">
            <ItemForm
              ref="itemFormRef"
              :warehouseId="formData.fromWarehouseId"
              :items="formData.items"
              :disabled="itemsFormdisabled"
              :formType="formType"
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
  <EnableList ref="addItemRef" @success="addItem" />
</template>
<script setup lang="ts">
import ItemForm from './components/ItemForm.vue'
import { erpPriceInputFormatter, erpPriceMultiply } from '@/utils'
import EnableList from './components/EnableList.vue'
import { AUDIT_TYPE, TAX_PERCENT } from '@/utils/constant'
import { createDBFn } from '@/utils/decorate'
import { useForm } from './hooks/useForm'
import {
  computeDiscountPriceAndTotalPrice,
  distinctList,
  filterListObjKey,
  filterObjKey
} from '@/utils/transformData'
import { useOutData } from './components/hooks/outdata'
import { PurchaseReturnApi, PurchaseReturnVO } from '@/api/srm/return'
import { cloneDeep } from 'lodash-es'

const { addItemRef, openAddItem } = useOutData()

/** ERP 采购退货表单 */
defineOptions({ name: 'OpenForm' })

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
    code: undefined // 入库单号，后端返回
  }
}
const formData: any = ref(initFormData())

// 供应商必填
const addBtnDisabled = computed(() => !formData.value.supplierId)
const showAddBtn = computed(() => !['audit', 'detail'].includes(formType.value))

const disabled = computed(() => formType.value === 'detail')
const formRef = ref() // 表单 Ref

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
      formData.value = await PurchaseReturnApi.getPurchaseReturn(id)

      // if (formData.value?.items?.length) {
      //   formData.value.items.forEach((a) => {
      //     if (a.product) {
      //       a.productId = a.product.id // 防止后端不放外面
      //       a.productName = a.product.name
      //       a.productCode = a.product.code
      //       a.productUnitName = a.product.unitName
      //       a.productUnitId = a.product.unitId
      //     }
      //   })
      // }

      // 主动触发表单数据回显
      formRef.value.initForm()
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

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
    let data = cloneDeep(formData.value) as unknown as PurchaseReturnVO as any
    data = filterObjKey(data, [
      'id',
      'code',
      'accountId',
      'returnTime',
      'discountPercent',
      'otherPrice',
      'supplierId',
      'fileUrl',
      'remark',
      'items'
    ])

    data.items = filterListObjKey(data.items, [
      'id',
      'arriveItemId',
      'qty',
      'remark',
      'applicantId',
      'applicationDeptId',
      'actualQty'
    ])
    if (formType.value === 'create') {
      await PurchaseReturnApi.createPurchaseReturn(data)
      message.success(t('common.createSuccess'))
    } else if (formType.value === 'update') {
      await PurchaseReturnApi.updatePurchaseReturn(data)
      message.success(t('common.updateSuccess'))
    } else if (formType.value === 'audit') {
      await PurchaseReturnApi.updatePurchaseReturnAuditStatus({
        ids: [data.id],
        reviewed: true,
        pass: auditBtnType.value === AUDIT_TYPE.agree,
        auditAdvice: data.auditAdvice
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
  formData.value = initFormData()
  nextTick(() => {
    formRef.value?.resetFields()
  })
}

const addItem = (selectionList: any[]) => {
  // reconciliationStatus 对账状态(false:未对账 ，true:已对账) 看看是不是要加上
  nextTick(() => {
    const items = formData.value.items
    const itemIdKey = 'arriveItemId'
    const selectList = selectionList.map((item: any) => {
      // 采购订单分页需带出数据
      const {
        code,
        arriveCode,
        itemsId, //list记得转化
        productId,
        productName,
        productCode,
        productUnitId, // 列表要转化取item-product里面数据
        productUnitName, //列表要转化取item-product里面数据
        // model, // //列表要转化取item-product里面数据

        productPrice,
        qty,
        actualQty,

        taxRate = TAX_PERCENT,
        tax,
        grossPrice,
        grossTotalPrice,
        itemsRemark,
        containerRate,

        warehouseId,
        warehouseName,
        // expectArrivalDate,
        source,

        currencyId,
        currencyName,
        applicantId,
        applicantName,
        applicationDeptId,
        applicationDeptName,
        declaredType,
      } = item

      /**
       * 采购入库需要的数据和回显name数据
       * 无法带出的内容有 exchangeRate-source
       */
      const obj = {
        // orderNo: code,
        arriveCode,
        [itemIdKey]: itemsId, //list记得转化
        productId,
        productName,
        productCode,
        code,
        productUnitName, //列表要转化取item-product里面数据
        productUnitId, // 列表要转化取item-product里面数据
        // model, // //列表要转化取item-product里面数据

        productPrice,
        qty:actualQty || 0,
        originCount: actualQty || 0,
        actualQty,

        taxRate,
        tax,
        grossPrice,
        grossTotalPrice,
        remark: itemsRemark,
        containerRate,

        warehouseId,
        warehouseName,
        // expectArrivalDate,
        source,

        currencyId,
        currencyName,
        applicantId,
        applicantName,
        applicationDeptId,
        applicationDeptName,
        declaredType,
      }
      return obj
    })
    // const itemsList = distinctList(items, selectList, itemIdKey)
    // 采购退货因为是整单单选 -所以直接进行覆盖就可以了
    const itemsList: any = selectList
    const model = formRef.value.getFormData()
    if (itemsList?.length) {
      model.discountPercent = itemsList[0].discountPercent
      model.otherPrice = itemsList[0].otherPrice
      model.accountId = itemsList[0].accountId
    } else {
      model.discountPercent = undefined
      model.otherPrice = undefined
      model.accountId = undefined
    }
    formData.value.items = itemsList
  })
}
</script>
