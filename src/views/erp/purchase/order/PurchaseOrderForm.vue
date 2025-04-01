<template>
  <div style="display: contents">
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
            @click="openEnableList"
            style="margin-bottom: 10px"
            >选择申请项</el-button
          >

          <el-tabs v-model="subTabsName" class="-mt-15px -mb-10px" style="width: 100%">
            <el-tab-pane label="订单产品清单" name="item">
              <PurchaseOrderItemForm
                ref="itemFormRef"
                :items="formData.items"
                :disabled="itemsFormdisabled"
                :formType="formType"
              />
            </el-tab-pane>
          </el-tabs>
        </template>
      </SmForm>

      <template #footer>
        <el-button v-if="!auditType" @click="submitFormDB" type="primary" :disabled="formLoading">
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

    <!-- 可订单的申请列表 -->
    <EnableList ref="enableListRef" @success="addItem" />
  </div>
</template>
<script setup lang="ts">
import { PurchaseOrderApi, PurchaseOrderVO } from '@/api/erp/purchase/order'
import PurchaseOrderItemForm from './components/PurchaseOrderItemForm.vue'
import { SupplierVO } from '@/api/erp/purchase/supplier'
import { AccountVO } from '@/api/erp/finance/account'
import {
  getAccountList,
  getCurrencyList,
  getFinanceSubjectList,
  getSupplierList
} from '@/commonData'
import { FinanceSubjectVO } from '@/api/erp/finance/subject'
import {
  computeDiscountPriceAndTotalPrice,
  computeList,
  distinctList,
  filterObjKey,
  jsonToList,
  listToJson
} from '@/utils/transformData'
import { AUDIT_TYPE, TAX_PERCENT } from '@/utils/constant'
import { createDBFn } from '@/utils/decorate'
import EnableList from './components/EnableList.vue'
import download from '@/utils/download'
import { addRules } from '@/components/SmForm/src/utils'
import { DICT_TYPE, getStrDictOptions } from '@/utils/dict'
import { useSupplierChange } from '@/utils/operate/purchase'
import { cloneDeep } from 'lodash-es'
import { InfoKeyOpenFormData } from './hooks/injectKeys'

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
    fileUrl: '',
    remark: undefined,
    items: [],
    completionJson: [],
    InspectionJson: []
  }
}

formData.value = initFormData()

provide(InfoKeyOpenFormData, formData)

const disabled = computed(() => formType.value === 'detail')
const formRef = ref() // 表单 Ref
const supplierList = ref<SupplierVO[]>([]) // 供应商列表
const accountList = ref<AccountVO[]>([]) // 账户列表
const financeSubjectList = ref<FinanceSubjectVO[]>([])
const templateList = ref<any[]>([]) // 模板列表
const currencyList = getCurrencyList() // 币别列表

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

    // if (!val.discountPercent) {
    //   return
    // }

    // 编辑回显
    computeDiscountPriceAndTotalPrice(formRef, formData.value)
    // nextTick(() => {
    //   const formValue = formRef.value.getFormData()
    //   formValue.discountPrice = formData.value.discountPrice
    //   formValue.totalPrice = formData.value.totalPrice
    // })

    // if (val.discountPercent) {
    //   const totalPrice = val.items.reduce((prev, curr) => prev + curr.totalPrice, 0)
    //   const discountPrice = erpPriceMultiply(totalPrice, val.discountPercent / 100.0) || 0
    //   formData.value.discountPrice = discountPrice
    //   formData.value.totalPrice = totalPrice - discountPrice
    // }
  },
  { deep: true }
)

const auditType = computed(() => formType.value === 'audit')
const itemsFormdisabled = computed(() =>
  ['audit', 'detail', 'merge', 'generateContract'].includes(formType.value)
)
const supplierChange = useSupplierChange(supplierList, formRef)
const createRequestFormOptions = () => {
  const list = [
    {
      type: 'input',
      label: '单据编号',
      prop: 'no',
      placeholder: '请输入单据编号',
      attrs: {
        style: { width: '100%' },
        clearable: true
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
        },
        onChange: supplierChange
      },
      children: supplierList
    },

    {
      type: 'select',
      placeholder: '请选择采购公司',
      prop: 'purchaseCompanyId',
      label: '采购公司',
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
      type: 'input',
      label: '付款条款',
      prop: 'paymentTerms',
      placeholder: '请输入付款条款',
      attrs: {
        type: 'textarea',
        style: { width: '100%' },
        clearable: true
      }
    },

    {
      type: 'select',
      placeholder: '请选择币种',
      prop: 'currencyName',
      label: '币种',
      attrs: {
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        },
        onChange: (val) => {
          const item = currencyList.value.find((item) => item.label === val)
          if (item) {
            const formData = getFormData()
            formData.currencyId = item.id
          }
        }
      },
      children: currencyList
    },
    {
      type: 'select',
      placeholder: '请选择装运港',
      prop: 'portOfLoading',
      label: '装运港',
      attrs: {
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: getStrDictOptions(DICT_TYPE.ERP_PORT_OF_LOADING)
    },
    {
      type: 'select',
      placeholder: '请选择目的港',
      prop: 'portOfDischarge',
      label: '目的港',
      attrs: {
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: getStrDictOptions(DICT_TYPE.ERP_PORT_OF_DISCHARGE)
    },
    // {
    //   type: 'date-picker',
    //   placeholder: '请选择结算日期',
    //   prop: 'settlementDate',
    //   label: '结算日期',
    //   attrs: {
    //     clearable: true,
    //     type: 'date',
    //     'value-format': 'x',
    //     class: '!w-1/1',
    //     style: {
    //       width: '100%'
    //     }
    //   }
    // },

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
      colConfig: { span: 24 },
      prop: 'fileUrl',
      label: '附件',
      slot: 'fileUrl'
    },
    {
      colConfig: { span: 24 },
      slot: 'items',
      formItemConfig: {
        class: 'purchase-request-items'
      }
    },

    {
      type: 'input-number',
      placeholder: '请输入优惠率',
      prop: 'discountPercent',
      label: '优惠率%',
      attrs: {
        'controls-position': 'right',
        min: 0,
        precision: 2,
        style: {
          width: '100%'
        }
      }
    },
    {
      type: 'input-number',
      prop: 'discountPrice',
      label: '付款优惠',
      attrs: {
        disabled: true,
        'controls-position': 'right',
        min: 0,
        precision: 2,
        style: {
          width: '100%'
        }
      }
    },
    {
      type: 'input-number',
      prop: 'totalPrice',
      label: '优惠后金额',
      attrs: {
        disabled: true,
        'controls-position': 'right',
        min: 0,
        precision: 2,
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
        style: {
          width: '100%'
        }
      }
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
    }
  ]

  addRules(list, ['purchaseCompanyId', 'paymentTerms', 'supplierId', 'currencyName'])
  return list
}
const requestFormOptions = ref(createRequestFormOptions())

const createAuditFormOptions = (formOptions, auditType) => {
  const index = formOptions.findIndex((item) => item.prop === 'fileUrl') + 1
  const obj: any = {
    type: 'input',
    label: '审核意见',
    prop: 'reviewComment',
    placeholder: '请输入审核意见',
    colConfig: { span: 24 },
    attrs: {
      style: { width: '100%' },
      clearable: true
    }
  }
  formOptions.splice(index, 0, obj)
  formOptions.forEach((item) => {
    if (item.prop && item.prop !== 'reviewComment') {
      if (item.attrs) {
        item.attrs!.disabled = auditType
      } else {
        item.attrs = {
          disabled: auditType
        }
      }
    }
  })
  return formOptions
}

const updateFormOptions = (formOptions) => {
  const index = formOptions.findIndex((item) => item.prop === 'fileUrl') + 1
  const obj: any = {
    type: 'input',
    label: '审核意见',
    prop: 'reviewComment',
    colConfig: { span: 24 },
    attrs: {
      style: { width: '100%' },
      clearable: true,
      disabled: true
    }
  }
  formOptions.splice(index, 0, obj)
  return formOptions
}

const createDetailFormOptions = (formOptions) => {
  formOptions.forEach((item) => {
    if (item.attrs) {
      item.attrs!.disabled = true
    } else {
      item.attrs = {
        disabled: true
      }
    }
  })
  return formOptions
}

const createMergeFormOptions = (formOptions) => {
  // 优惠后金额-totalPrice-追加其他金额 otherPrice
  const obj: any = {
    type: 'input-number',
    placeholder: '请输入其他金额',
    prop: 'otherPrice',
    label: '其他金额',
    attrs: {
      'controls-position': 'right',
      min: 0,
      precision: 2,
      style: {
        width: '100%'
      }
    }
  }
  const options = formOptions.filter((item) => item.prop !== 'purchaseCompanyId')
  const index = options.findIndex((item) => item.prop === 'totalPrice') + 1
  options.splice(index, 0, obj)
  options.forEach((item) => {
    if (item.prop === 'depositPrice') {
      item.attrs!.disabled = true
    }
  })
  return options
}

const createGenerateContractFormOptions = (formOptions) => {
  // 优惠后金额-totalPrice-追加其他金额 otherPrice
  const obj: any = {
    type: 'input-number',
    placeholder: '请输入其他金额',
    prop: 'otherPrice',
    label: '其他金额',
    attrs: {
      'controls-position': 'right',
      min: 0,
      precision: 2,
      style: {
        width: '100%'
      }
    }
  }
  const options = formOptions
  const index = options.findIndex((item) => item.prop === 'totalPrice') + 1
  options.splice(index, 0, obj)

  // 全都disabled-下面附件带-采购合同模板
  options.forEach((item) => {
    if (item.attrs) {
      item.attrs!.disabled = true
    } else {
      item.attrs = {
        disabled: true
      }
    }
  })

  // 删除items清单列表之前的选项
  const itemsIndex = options.findIndex((item) => item.slot === 'items')
  options.splice(0, itemsIndex)

  const printOptions = [
    {
      type: 'input',
      placeholder: '请选择签订地点',
      label: '签订地点',
      prop: 'signingPlace',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'date-picker',
      placeholder: '请选择订立日期',
      prop: 'signingDate',
      label: '订立日期',
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
      type: 'select',
      placeholder: '请选择甲方',
      prop: 'partyAId',
      label: '甲方',
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
      type: 'select',
      placeholder: '请选择乙方',
      prop: 'partyBId',
      label: '乙方',
      attrs: {
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: financeSubjectList
    },

    // {
    //   type: 'select',
    //   placeholder: '请选择币种',
    //   prop: 'currencyName',
    //   label: '币种',
    //   attrs: {
    //     filterable: true,
    //     clearable: true,
    //     style: {
    //       width: '100%'
    //     },
    //     onChange: (val) => {
    //       const item = currencyList.value.find((item) => item.label === val)
    //       if (item) {
    //         const formData = getFormData()
    //         formData.currencyId = item.id
    //       }
    //     }
    //   },
    //   children: currencyList
    // },
    {
      type: 'select',
      placeholder: '请选择采购合同模板',
      prop: 'templateName',
      label: '采购合同模板',
      attrs: {
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: templateList
    },
    {
      type: 'input',
      label: '付款条款',
      prop: 'paymentTerms',
      placeholder: '请输入付款条款',
      attrs: {
        type: 'textarea',
        style: { width: '100%' },
        clearable: true
      }
    }
  ]

  addRules(printOptions)

  return printOptions.concat(options)
}

const operateAudit = (type) => {
  const map = {
    detail: () => {
      requestFormOptions.value = createDetailFormOptions(createRequestFormOptions())
    },
    create: () => {
      requestFormOptions.value = createRequestFormOptions()
    },
    audit: () => {
      requestFormOptions.value = createAuditFormOptions(createRequestFormOptions(), auditType)
    },
    update: () => {
      requestFormOptions.value = updateFormOptions(createRequestFormOptions())
    },
    merge: () => {
      requestFormOptions.value = createMergeFormOptions(createRequestFormOptions())
    },
    generateContract: () => {
      dialogTitle.value = '生成采购合同'
      requestFormOptions.value = createGenerateContractFormOptions(createRequestFormOptions())
    }
  }
  const fn = map[type]
  if (fn) {
    fn()
    return
  }
}

const getFormData = () => {
  return formData.value
}

// 合并 合并入库时列表勾选中传递的items数据
const mergeSelectItemsData = (formData, data) => {
  // count-数量要能够修改不能超过原始值
  data.items.forEach((item) => {
    item.originCount = item.count
  })
  formData.items = data.items
}

/** 打开弹窗 */
const open = async (type: string, id?: number, data?: any) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  operateAudit(type)
  resetForm()

  if (type === 'create') {
    PurchaseOrderApi.getPurchaseOrderNo().then((res) => {
      const modelValue = formRef.value.getFormData()
      modelValue.no = res
    })
  }

  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await PurchaseOrderApi.getPurchaseOrder(id)
      if (!formData.value?.items?.length) {
        formData.value.items = []
      }
      formData.value.items = jsonToList(formData.value.items, ['inspectionJson', 'completionJson'])
      formData.value.items.forEach((item) => {
        item.originCount = item.count
      })

      if (type === 'merge') {
        dialogTitle.value = '合并入库'
        const inFormData = getFormData()
        mergeSelectItemsData(inFormData, data)
      }
      // 主动触发表单数据回显
      formRef.value.initForm()
    } finally {
      formLoading.value = false
    }
  }

  getCurrencyList(currencyList)
  // 加载供应商列表
  getSupplierList(supplierList)
  // 加载账户列表
  getAccountList(accountList)
  getFinanceSubjectList(financeSubjectList)
  PurchaseOrderApi.getPurchaseOrderTemplateList().then((res) => {
    templateList.value = res.map((item) => {
      return {
        label: item,
        value: item
      }
    })
  })

  // const defaultAccount = accountList.value.find((item) => item.defaultStatus)
  // if (defaultAccount) {
  //   formData.value.accountId = defaultAccount.id
  // }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 打开【可入库的订单列表】弹窗 */
const enableListRef = ref() // 可入库的订单列表 Ref
const openEnableList = () => {
  enableListRef.value.open()
}

const auditBtnType = ref(AUDIT_TYPE.agree)

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  formData.value.items = itemFormRef.value.formData

  // 校验表单
  await formRef.value.validate()
  await itemFormRef.value.validate()

  // 提交请求
  formLoading.value = true
  try {
    let data = formData.value as unknown as PurchaseOrderVO as any
    if (itemFormRef?.value?.formData) {
      data.items = cloneDeep(itemFormRef.value.formData)
    }

    // 详情-新增-编辑-内部有兜底转化[]为'[]'-主要是详情获取jsonToList进行了转化-所以这里也不进行判断-进行转化
    const mapList = [
      {
        targetKey: 'totalInspectionPassCount',
        computeKey: 'inspectionPassCount',
        listKey: 'inspectionJson'
      },
      {
        targetKey: 'totalCompletionPassCount',
        computeKey: 'finishCount',
        listKey: 'completionJson'
      }
    ]
    // 需要深度拷贝不然同时并发 数组会转换成字符串然后报错
    const items: any = computeList(mapList, cloneDeep(data.items))
    data.items = listToJson(items, ['inspectionJson', 'completionJson'])

    if (formType.value === 'create') {
      await PurchaseOrderApi.createPurchaseOrder(data)
      message.success(t('common.createSuccess'))
    } else if (formType.value === 'audit') {
      await PurchaseOrderApi.updatePurchaseOrderAuditStatus({
        reviewed: true,
        pass: auditBtnType.value === AUDIT_TYPE.agree,
        orderIds: [data.id],
        reviewComment: data.reviewComment
      })
      message.success(t('common.updateSuccess'))
    } else if (formType.value === 'update') {
      await PurchaseOrderApi.updatePurchaseOrder(data)
      message.success(t('common.updateSuccess'))
    } else if (formType.value === 'detail') {
      await PurchaseOrderApi.updateJsonPurchaseOrder(data)
      message.success(t('common.updateSuccess'))
    } else if (formType.value === 'merge') {
      const { items } = data
      const queryData: any = filterObjKey(
        {
          ...data,
          itemIds: items.map((item) => item.id) as number[]
        },
        [
          'noTime',
          'supplierId',
          'address',
          'settlementDate',
          'accountId',
          'discountPercent',
          'otherPrice',
          'fileUrl',
          'remark',
          'itemIds',
          'currencyName',
          'currencyId'
        ]
      )
      await PurchaseOrderApi.mergePurchaseOrder(queryData)
      message.success('合并入库成功')
    } else if (formType.value === 'generateContract') {
      data.orderId = data.id
      const queryData: any = filterObjKey(data, [
        'templateName',
        'orderId',
        'signingPlace',
        'signingDate',
        'currencyName',
        'currencyId',
        'partyAId',
        'partyBId',
        'paymentTerms'
      ])
      const downLoadData = await PurchaseOrderApi.generatePurchaseOrderContract(queryData)
      download.pdf(downLoadData, '采购合同.pdf')
      message.success('生成采购合同成功')
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

const changeAuditBtnType = (type = '') => {
  auditBtnType.value = type
  submitForm()
}
const submitFormDB = createDBFn(changeAuditBtnType)

/** 重置表单 */
const resetForm = () => {
  formData.value = initFormData()
  formRef.value?.resetFields()
}

const addItem = (selectionList) => {
  nextTick(() => {
    const items = formData.value.items
    const selectList = selectionList.map((item: any) => {
      const {
        purchaseApplyItemId,
        approvedQty,
        actTaxPrice,
        taxPercent = TAX_PERCENT,
        taxPrice,
        warehouseId,
        expectArrivalDate,
        no,
        applicantId,
        applicationDeptId,
        applicant,
        applicationDept,
        declaredType,
        declaredTypeEn,
        productId,
        productBarCode,
        productName,
        productUnitName,
        barCode,
        productPrice
      } = item
      const obj = {
        purchaseApplyItemId,
        count: approvedQty || 0,
        actTaxPrice,
        taxPercent,
        taxPrice, //税额需要动态计算
        warehouseId,
        expectArrivalDate,
        deliveryTime: expectArrivalDate,
        erpPurchaseRequestItemNo: no,
        applicantId,
        applicationDeptId,
        departmentName: applicationDept, // 采购订单详情返回 departmentName-applicantName
        applicantName: applicant,
        declaredType,
        declaredTypeEn,
        productId,
        productName,
        productBarCode,
        productUnitName,
        barCode,
        productPrice
        // productPrice: actTaxPrice
      }
      return obj
    })
    formData.value.items = distinctList(items, selectList, 'purchaseApplyItemId')
  })
}
</script>
<style lang="scss" scoped>
@use '../../../../styles/comonForm.scss' as *;
</style>
