import { getAccountList, getSupplierList } from '@/commonData'
import { RECONCILIATION_STSTUS } from '../constant'

export const useForm = (formType) => {
  const supplierList = ref<any[]>([]) // 供应商列表
  const accountList = ref<any[]>([]) // 账户列表
  // const userList = ref<any[]>([])

  const auditType = computed(() => formType.value === 'audit')
  const itemsFormdisabled = computed(
    () => formType.value === 'audit' || formType.value === 'detail'
  )

  const createRequestFormOptions = () => {
    return [
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

      // {
      //   prop: 'orderNo',
      //   label: '关联订单',
      //   slot: 'orderNo'
      // },

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
        type: 'date-picker',
        placeholder: '请选择入库时间',
        prop: 'inTime',
        label: '入库时间',
        attrs: {
          clearable: true,
          type: 'date',
          'value-format': 'x',
          class: '!w-1/1',
          style: {
            width: '100%'
          }
        },
        rules: [
          {
            required: true,
            message: '入库日期不能为空',
            trigger: 'blur'
          }
        ]
      },

      // {
      //   type: 'input',
      //   label: '收货地址',
      //   prop: 'address',
      //   placeholder: '请输入收货地址',
      //   attrs: {
      //     style: { width: '100%' },
      //     clearable: true
      //   }
      // },
      // {
      //   type: 'input',
      //   label: '付款条款',
      //   prop: 'paymentTerms',
      //   placeholder: '请输入付款条款',
      //   attrs: {
      //     style: { width: '100%' },
      //     clearable: true
      //   }
      // },
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
      },
      // {
      //   type: 'input-number',
      //   placeholder: '请输入定金金额',
      //   prop: 'depositPrice',
      //   label: '定金金额',
      //   attrs: {
      //     'controls-position': 'right',
      //     min: 0,
      //     precision: 2,
      //     style: {
      //       width: '100%'
      //     }
      //   }
      // },
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
        placeholder: '请选择对账状态',
        prop: 'reconciliationStatus',
        label: '对账状态',
        attrs: {
          filterable: true,
          clearable: true,
          style: {
            width: '100%'
          }
        },
        children: RECONCILIATION_STSTUS
      }
    ]
  }
  const requestFormOptions = ref({})

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

  const operateAudit = (type) => {
    const map = {
      detail: () => {
        // requestFormOptions.value = createDetailFormOptions(createRequestFormOptions())
      },
      create: () => {
        requestFormOptions.value = createRequestFormOptions()
      },
      audit: () => {
        requestFormOptions.value = createAuditFormOptions(createRequestFormOptions(), auditType)
      },
      update: () => {
        requestFormOptions.value = updateFormOptions(createRequestFormOptions())
      }
    }
    const fn = map[type]
    if (fn) {
      fn()
      return
    }
  }

  const initDialogData = () => {
    getAccountList(accountList)
    getSupplierList(supplierList)
  }

  return {
    auditType,
    itemsFormdisabled,
    requestFormOptions,
    operateAudit,
    initDialogData
  }
}
