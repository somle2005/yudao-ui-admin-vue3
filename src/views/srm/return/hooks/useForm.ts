import { getAccountList, getSupplierList } from '@/commonData'
import { addDisabled } from '@/components/SmForm/src/utils'

export const useForm = (formType) => {
  const accountList = ref<any[]>([]) // 账户列表
  const supplierList = ref([])

  const auditType = computed(() => formType.value === 'audit')
  const itemsFormdisabled = computed(
    () => formType.value === 'audit' || formType.value === 'detail'
  )

  /**
   * 必填项 单据编码(后端生成)-单据日期-供应商-币别-汇率-单位-数量-含税单价
   * 这里只有单据日期-供应商是必填项其余都是非必填项 - 其余都在items里面作为必填项了
   */
  const createRequestFormOptions = () => {
    const list = [
      {
        type: 'input',
        label: '单据编码',
        prop: 'code',
        placeholder: '保存时自动生成',
        attrs: {
          style: { width: '100%' },
          clearable: true,
          disabled: true
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
        placeholder: '请选择退货日期',
        prop: 'returnTime',
        label: '退货日期',
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

      // {
      //   type: 'input-number',
      //   placeholder: '请输入优惠率',
      //   prop: 'discountPercent',
      //   label: '优惠率%',
      //   attrs: {
      //     'controls-position': 'right',
      //     min: 0,
      //     precision: 2,
      //     style: {
      //       width: '100%'
      //     }
      //   }
      // },
      // {
      //   type: 'input-number',
      //   prop: 'discountPrice',
      //   label: '付款优惠',
      //   attrs: {
      //     disabled: true,
      //     'controls-position': 'right',
      //     min: 0,
      //     precision: 2,
      //     style: {
      //       width: '100%'
      //     }
      //   }
      // },
      // {
      //   type: 'input-number',
      //   prop: 'totalPrice',
      //   label: '优惠后金额',
      //   attrs: {
      //     disabled: true,
      //     'controls-position': 'right',
      //     min: 0,
      //     precision: 2,
      //     style: {
      //       width: '100%'
      //     }
      //   }
      // },
      // {
      //   type: 'input-number',
      //   prop: 'otherPrice',
      //   label: '其他金额',
      //   attrs: {
      //     'controls-position': 'right',
      //     min: 0,
      //     precision: 2,
      //     style: {
      //       width: '100%'
      //     }
      //   }
      // },
      // {
      //   type: 'select',
      //   placeholder: '请选择结算账户',
      //   prop: 'accountId',
      //   label: '结算账户',
      //   attrs: {
      //     filterable: true,
      //     clearable: true,
      //     style: {
      //       width: '100%'
      //     }
      //   },
      //   children: accountList
      // }
    ]

    const requireList = ['returnTime','supplierId']
    requireList.forEach((prop) => {
      const target = list.find((item) => item.prop === prop) as any
      if (!target) return
      target.rules = [
        {
          required: true,
          message: `${target.label}不能为空`,
          trigger: 'blur'
        }
      ]
    })
    return list
  }
  const requestFormOptions = ref({})

  const createAuditFormOptions = (formOptions, auditType) => {
    const index = formOptions.findIndex((item) => item.prop === 'fileUrl') + 1
    const obj: any = {
      type: 'input',
      label: '审核意见',
      prop: 'auditAdvice',
      placeholder: '请输入审核意见',
      colConfig: { span: 24 },
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    }
    formOptions.splice(index, 0, obj)
    formOptions.forEach((item) => {
      if (item.prop && item.prop !== 'auditAdvice') {
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
      prop: 'auditAdvice',
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

  const detailFormOptions = (formOptions) => {
    addDisabled(formOptions)
    return formOptions
  }

  const operateAudit = (type) => {
    const map = {
      detail: () => {
        requestFormOptions.value = detailFormOptions(createRequestFormOptions())
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
    getSupplierList(supplierList)
    getAccountList(accountList)
  }

  return {
    auditType,
    itemsFormdisabled,
    requestFormOptions,
    operateAudit,
    initDialogData
  }
}
