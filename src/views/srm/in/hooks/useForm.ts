import { getAccountList, getSupplierList } from '@/commonData'
import { addDisabled } from '@/components/SmForm/src/utils'
import { RECONCILIATION_STSTUS } from '@/utils/constant'
import { SRM_OPERATE_MAP } from '../../common/constant'
import { useInOptions } from '../../common/hooks'

export const useForm = (formType) => {
  const supplierList = ref<any[]>([]) // 供应商列表
  const accountList = ref<any[]>([]) // 账户列表
  // const userList = ref<any[]>([])

  const auditType = computed(() => formType.value === 'audit')
  const itemsFormdisabled = computed(
    () => formType.value === 'audit' || formType.value === 'detail'
  )

  /**
   * 必填项 单据编码(后端生成)-单据日期-供应商-币别-汇率-单位-数量-含税单价
   * 这里只有单据日期-供应商是必填项其余都是非必填项 - 其余都在items里面作为必填项了
   */

  const { createRequestFormOptions } = useInOptions(supplierList, accountList)

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

  const payRevokeFormOptions = () => {
    // addDisabled(formOptions)
    const formOptions = [
      {
        colConfig: { span: 24 },
        slot: 'items',
        formItemConfig: {
          class: 'purchase-request-items'
        }
      }
    ]
    return formOptions
  }

  const detailFormOptions = (formOptions) => {
    addDisabled(formOptions)
    return formOptions
  }

  const operateAudit = (type, dialogTitle) => {
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
      },
      [SRM_OPERATE_MAP.pay]: () => {
        dialogTitle.value = SRM_OPERATE_MAP.pay
        // requestFormOptions.value = detailFormOptions(createRequestFormOptions())
        requestFormOptions.value = payRevokeFormOptions()
      },
      [SRM_OPERATE_MAP.revokePay]: () => {
        dialogTitle.value = SRM_OPERATE_MAP.revokePay
        requestFormOptions.value = payRevokeFormOptions()
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
