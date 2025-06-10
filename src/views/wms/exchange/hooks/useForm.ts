import { addDisabled, addProperty } from '@/components/SmForm/src/utils'
import { getIntDictOptions } from '@/utils/dict'
import { getExchangeWarehouseList } from '@/commonData/wms'
import { addAuditAdvice } from '../../common/utils'

export const useForm = (formType, formData) => {
  const exchangeWarehouseList = ref([])
  const requestFormOptions: any = ref([])

  const detailFormOptions = (formOptions) => {
    addDisabled(formOptions)
    return formOptions
  }

  const changeExchangeWarehouseList = (val) => {
    console.log(val, '选中了类型')
    getExchangeWarehouseList({ exchange: val }, exchangeWarehouseList)
  }

  const createRequestFormOptions = () => {
    const list = [
      // {
      //   type: 'input',
      //   label: '单据号',
      //   prop: 'code',
      //   placeholder: '请输入单据号',
      //   attrs: {
      //     style: { width: '100%' },
      //     clearable: true
      //   }
      // },
      {
        requiredFlag: true,
        type: 'select',
        placeholder: '请选择类型',
        prop: 'type',
        label: '类型',
        attrs: {
          filterable: true,
          clearable: true,
          style: {
            width: '100%'
          },
          onChange: changeExchangeWarehouseList
        },
        children: getIntDictOptions(DICT_TYPE.WMS_EXCHANGE_TYPE)
      },
      {
        requiredFlag: true,
        type: 'select',
        label: '调出仓库',
        prop: 'warehouseId',
        placeholder: '请选择调出仓库',
        attrs: {
          style: { width: '100%' },
          filterable: true,
          clearable: true
        },
        children: exchangeWarehouseList
      },
      {
        type: 'input',
        label: '备注',
        prop: 'remark',
        placeholder: '请输入备注',
        attrs: {
          style: { width: '100%' },
          clearable: true
        }
      },
      { 
        colConfig: { span: 24 },
        type: 'input',
        label: '必要条件',
        prop: 'tips',
        attrs: {
          disabled: true,
          style: { width: '100%' },
          clearable: true
        }
      },
      {
        colConfig: { span: 24 },
        slot: 'items',
        formItemConfig: {
          class: 'common-form-items'
        }
      }
    ]
    addProperty(list)
    return list
  }

  const auditFormOptions = (formOptions) => {
    addDisabled(formOptions)
    addAuditAdvice(formOptions, 'items', 'comment')
    return formOptions
  }

  const operateForm = (type, dialogTitle?) => {
    const map = {
      detail: () => {
        requestFormOptions.value = detailFormOptions(createRequestFormOptions())
      },
      create: () => {
        requestFormOptions.value = createRequestFormOptions()
      },
      update: () => {
        requestFormOptions.value = createRequestFormOptions()
      },
      audit: () => {
        requestFormOptions.value = auditFormOptions(createRequestFormOptions())
      }
    }
    map[type] && map[type]()
  }

  const initDialogData = () => {
    // getWMSWarehouseList(WMSWarehouseList)
  }
  const getFormData = () => {
    return formData.value
  }

  const itemsFormdisabled = computed(() => ['detail', 'audit'].includes(formType.value))
  const auditType = computed(() => ['audit'].includes(formType.value))
  const subTabsName = ref('itemForm')
  const itemFormRef = ref()

  return {
    changeExchangeWarehouseList,
    getFormData,
    requestFormOptions,
    operateForm,
    initDialogData,
    itemFormRef,
    subTabsName,
    itemsFormdisabled,
    auditType
  }
}
