import { PurchaseRequestApi } from '@/api/srm/request'
import {
  getDeptTree,
  getUserList,
  getSupplierList,
  getCurrencyList,
  getFinanceSubjectList,
  getAccountList
} from '@/commonData'
import { cloneDeep } from 'lodash-es'
import { defaultProps } from '@/utils/tree'
import { FormOptions } from '@/components/SmForm/src/types/types'
import { AUDIT_TYPE } from '@/utils/constant'
import { FinanceSubjectVO } from '@/api/fms/company'
import { filterObjKey } from '@/utils/transformData'
import { getStrDictOptions } from '@/utils/dict'
import { useSupplierChange } from '@/utils/operate/srm'
import { PurchaseOrderApi } from '@/api/srm/order'
import { addRules } from '@/components/SmForm/src/utils'
import { getPaymentTermsList } from '@/commonData/srm'
import { getPortInfoList } from '@/commonData/tms'
import { useMergeOrderOptions } from '../../common/hooks'

/**

是否必填根据文档来

申请人-applicant-下拉框(数据来源-/system/user/simple-list)
申请部门-applicationDept-下拉框(数据来源-参照产品信息-部门下拉框)
单据日期-billTime-时间下拉单选(参照采购订单-订单时间)
供应商编号-supplierId-下拉框


items-商品信息-表格列(参照-采购订单-订单产品清单)

商品id-productId-下拉框
申请数量-qty-数字输入框(整数>0)
仓库编号-warehouseId-下拉框 (数据来源-仓库精简列表接口)
批准数量-approvedQty-数字输入框(整数>0)
含税单价-grossPrice-数字输入框(手动输入，价格保留小数点后两位。)
价税合计-grossTotalPrice-(显示在底部合计行-与含税单价联动，通过计算保持一致)
参考单价-referenceUnitPrice-数字输入框(整数>0)
税额，单位：元-taxPrice-(纯显示-保留小数点后两位   = 含税单价*税率   )
税率，百分比-taxRate-数字输入框(手动输入，保留小数点后两位。)


税额的计算


单价 * (1+税率) = 含税单价
单价 = 含税单价/ (1+税率)
税额 = 单价 * 税率
税额 = 含税单价 * (税率/(1+税率))


产品带出 产品编码产品编码-code-change事件赋予值联动即可

必填项

单据日期
申请人
申请部门
产品名称
产品编码
供应商编号
单位
申请数量
 */

const mergeDetail = (formData, detail, formType, smFormRef) => {
  for (const key in detail) {
    formData[key] = detail[key]
  }
  // formData.billTime = formatTime(formData.billTime)
  formData.items.forEach((item) => {
    // 批准数量默认值取申请数量
    if (formType === 'audit') {
      item.approvedQty = item.qty
    }
    // item.taxRate = item.taxRate * 100
  })

  nextTick(() => {
    const modelValue = smFormRef.value.getFormData()
    for (const key in formData) {
      modelValue[key] = formData[key]
    }
  })
  // modelValue.billTime = dayjs(1739016534000).format('YYYY-MM-DD HH:mm:ss')
}

// 合并 合并采购时列表勾选中传递的items数据
const mergeSelectItemsData = (formData, data, smFormRef) => {
  data.items.forEach((item) => {
    // item.taxRate = item.taxRate * 100
  })
  formData.items = data.items

  // formData.items.forEach((item) => {
  //   // 默认下单数量等于批准数量
  //   item.orderQuantity = item.approvedQty
  // })

  // nextTick(() => {
  //   const modelValue = smFormRef.value.getFormData()
  //   modelValue.items = formData.items
  // })
}

export const usePurchaseRequestForm = ({ getResetFormData, getFormData, emit }) => {
  const { t } = useI18n() // 国际化
  const message = useMessage() // 消息弹窗

  const dialogTitle = ref('')
  const dialogVisible = ref(false)

  const applicantList = ref([])
  const supplierProductList = ref([])
  const deptList = ref([])
  const supplierList = ref([])
  const financeSubjectList = ref<FinanceSubjectVO[]>([])

  const smFormRef = ref()

  /** 子表的表单 */
  const subTabsName = ref('item')
  const itemFormRef = ref()

  const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
  const formType = ref('') // 表单的类型：create - 新增；update - 修改；detail - 详情

  const requestFormOptions = ref<FormOptions[]>([])
  // 必填项 单据日期 申请人 申请部门
  const createRequestFormOptions = () => {
    return [
      {
        type: 'input',
        label: '单据编码',
        prop: 'code',
        placeholder: '请输入单据编码',
        attrs: {
          style: { width: '100%' },
          clearable: true
        }
      },
      {
        type: 'date-picker',
        placeholder: '请选择单据日期',
        prop: 'billTime',
        label: '单据日期',
        attrs: {
          clearable: true,
          type: 'date',
          // 'value-format': 'x',
          'value-format': 'x',
          class: '!w-1/1',
          style: {
            width: '100%'
          }
        }
      },
      {
        type: 'select',
        placeholder: '请选择申请人',
        prop: 'applicantId',
        label: '申请人',
        attrs: {
          filterable: true,
          clearable: true,
          style: {
            width: '100%'
          }
        },
        rules: [
          {
            required: true,
            message: '申请人不能为空',
            trigger: 'blur'
          }
        ],
        children: applicantList
      },
      {
        type: 'tree-select',
        placeholder: '请选择申请部门',
        prop: 'applicationDeptId',
        label: '申请部门',
        attrs: {
          filterable: true,
          clearable: true,
          data: deptList,
          props: defaultProps,
          'check-strictly': true,
          'node-key': 'id'
          // style: {
          //   width: '100%'
          // }
        },
        rules: [
          {
            required: true,
            message: '申请部门不能为空',
            trigger: 'blur'
          }
        ]
      },
      // {
      //   type: 'select',
      //   placeholder: '请选择建议供应商',
      //   prop: 'supplierId',
      //   label: '建议供应商',
      //   attrs: {
      //     filterable: true,
      //     clearable: true,
      //     style: {
      //       width: '100%'
      //     }
      //   },
      //   children: supplierList
      // },

      // {
      //   type: 'select',
      //   value: '',
      //   placeholder: '请选择产品',
      //   prop: 'productId',
      //   label: '产品',
      //   attrs: {
      //     clearable: true,
      //     filterable: true,
      //     style: {
      //       width: '100%'
      //     },
      //     onChange: (value) => {
      //       const productItem = productList1.value.find((item: any) => item.value === value)
      //       if (productItem) {
      //         const formData = getFormData()
      //         formData.code = productItem.code
      //         // const modelVal = smFormRef.value.getFormData()
      //         // modelVal.code = productItem.code
      //       }
      //     }
      //   },
      //   rules: [
      //     {
      //       required: true,
      //       message: '产品不能为空',
      //       trigger: 'blur'
      //     }
      //   ],
      //   children: productList1
      // },

      {
        type: 'input',
        label: '收货地址',
        prop: 'delivery',
        placeholder: '请输入收货地址',
        attrs: {
          style: { width: '100%' },
          clearable: true
        }
      },
      {
        colConfig: { span: 24 },
        slot: 'items',
        formItemConfig: {
          class: 'purchase-request-items'
        }
      }
    ] as FormOptions[]
  }
  requestFormOptions.value = createRequestFormOptions()

  const auditType = computed(() => formType.value === 'audit')
  const createAuditFormOptions = (formOptions, auditType) => {
    const index = formOptions.length - 1
    const obj: any = {
      type: 'input',
      label: '审核意见',
      prop: 'auditAdvice',
      placeholder: '请输入审核意见',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    }
    formOptions.splice(index, 0, obj)
    formOptions.forEach((item) => {
      if (item.prop && item.prop !== 'auditAdvice') {
        item.attrs!.disabled = auditType
      }
    })
    return formOptions
  }

  const supplierChange = useSupplierChange(supplierList, smFormRef)
  const paymentTermsList: any = ref([])

  const currencyList = ref([])
  const accountList = ref([])
  const portInfoList = ref([])

  const { mergeRequestOrderOptions: createMergeFormOptions } = useMergeOrderOptions(
    accountList,
    portInfoList,
    currencyList,
    financeSubjectList,
    supplierChange,
    supplierList,
    paymentTermsList,
    getFormData
  )

  const updateFormOptions = (formOptions) => {
    const index = formOptions.length - 1
    const obj: any = {
      type: 'input',
      label: '审核意见',
      prop: 'auditAdvice',
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
        item.attrs.disabled = true
      } else {
        item.attrs = {
          disabled: true
        }
      }
    })
    return formOptions
  }

  // 处理audit的逻辑
  const operateAudit = (type) => {
    const map = {
      create: () => {
        requestFormOptions.value = createRequestFormOptions()
      },
      audit: () => {
        requestFormOptions.value = createAuditFormOptions(createRequestFormOptions(), auditType)
      },
      merge: () => {
        getPortInfoList(portInfoList, { label: 'name', value: 'name' })
        getCurrencyList(currencyList)
        getAccountList(accountList)
        requestFormOptions.value = createMergeFormOptions() as any
      },
      update: () => {
        requestFormOptions.value = updateFormOptions(createRequestFormOptions())
      },
      detail: () => {
        requestFormOptions.value = createDetailFormOptions(createRequestFormOptions())
      }
    }
    const fn = map[type]
    if (fn) {
      fn()
      return
    }
  }

  const auditBtnType = ref(AUDIT_TYPE.reject)

  const getSelectData = (type) => {
    getSupplierList(supplierList)
    getFinanceSubjectList(financeSubjectList)
    if (type === 'create') {
      PurchaseRequestApi.getPurchaseRequestNo().then((res) => {
        const modelValue = smFormRef.value.getFormData()
        modelValue.code = res
      })
    }
    if (type === 'merge') {
      PurchaseOrderApi.getPurchaseOrderNo().then((res) => {
        const modelValue = smFormRef.value.getFormData()
        modelValue.code = res
      })
      getPaymentTermsList(paymentTermsList)
    }
    if (type !== 'merge') {
      getUserList(applicantList)
      getDeptTree(deptList)
    }
  }

  const openForm = async (type: string, id?: number, data?: any) => {
    getResetFormData()
    operateAudit(type)

    formType.value = type
    dialogTitle.value = t('action.' + type)
    dialogVisible.value = true

    getSelectData(type)

    if (type === 'merge') {
      dialogTitle.value = '合并采购'
      const formData = getFormData()
      mergeSelectItemsData(formData, data, smFormRef)
      return
    }

    // 修改时，设置数据
    if (id) {
      formLoading.value = true
      try {
        const formData = getFormData()
        const detailData = await PurchaseRequestApi.getPurchaseRequest(id)
        mergeDetail(formData, detailData, formType.value, smFormRef)
      } finally {
        formLoading.value = false
      }
    }
  }

  const submitForm = async () => {
    // catch会拿到错误数据 没有进入catch说明校验通过了
    try {
      const valida1 = await itemFormRef.value.validate()
      const valiad2 = await smFormRef.value.validate()
      if (!(valida1 && valiad2)) return

      // 提交请求
      formLoading.value = true

      // 税率拿到提交数据进行转换处理
      const data = cloneDeep(getFormData())
      data.items.forEach((item) => {
        // item.taxRate = item.taxRate / 100
        return item
      })

      if (formType.value === 'create') {
        await PurchaseRequestApi.createPurchaseRequest(data)
        message.success(t('common.createSuccess'))
      } else if (formType.value === 'audit') {
        await PurchaseRequestApi.updatePurchaseRequestAuditStatus({
          requestId: data.id,
          reviewed: true,
          pass: auditBtnType.value === AUDIT_TYPE.agree,
          items: data.items.map((item) => {
            return {
              id: item.id,
              approvedQty: item.approvedQty
            }
          }),
          auditAdvice: data.auditAdvice
        })
        message.success(t('common.updateSuccess'))
      } else if (formType.value === 'merge') {
        await PurchaseRequestApi.mergePurchaseRequest(data)
        message.success('合并采购成功')
      } else if (formType.value === 'update') {
        await PurchaseRequestApi.updatePurchaseRequest(data)
        message.success(t('common.updateSuccess'))
      }

      dialogVisible.value = false
      emit('success')
    } catch (e) {
      console.log(e, '报错了')
    } finally {
      formLoading.value = false
    }
  }

  return {
    dialogTitle,
    dialogVisible,
    openForm,
    requestFormOptions,
    smFormRef,
    submitForm,
    subTabsName,
    itemFormRef,
    formLoading,
    formType,
    applicantList,
    supplierProductList,
    auditBtnType,
    auditType
  }
}
