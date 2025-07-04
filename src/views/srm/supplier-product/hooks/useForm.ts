import { getProductList, getSupplierList } from '@/commonData'
import { addDisabled, addProperty } from '@/components/SmForm/src/utils'
import { SupplierVO } from '@/api/srm/supplier'
import { ProductVO } from '@/api/crm/product'
import { getIntDictOptions } from '@/utils/dict'

export const useForm = (formType) => {
  const productList = ref<ProductVO[]>([]) // 产品列表
  const supplierList = ref<SupplierVO[]>([]) // 供应商列表

  const requestFormOptions: any = ref([])

  const detailFormOptions = (formOptions) => {
    addDisabled(formOptions)
    return formOptions
  }

  const createRequestFormOptions = () => {
    const list = [
      {
        type: 'input',
        label: '供应商产品编码',
        prop: 'code',
        placeholder: '请输入供应商产品编码',
        attrs: {
          style: { width: '100%' },
          clearable: true
        }
      },
      {
        requiredFlag: true,
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

      // :label="`${item.code} | ${item.name}`"
      {
        requiredFlag: true,
        type: 'select',
        placeholder: '请选择产品编码',
        prop: 'productId',
        label: '产品编码',
        attrs: {
          filterable: true,
          clearable: true,
          style: {
            width: '100%'
          }
        },
        children: productList
      },

      {
        type: 'input-number',
        placeholder: '请输入包装长度(cm)',
        prop: 'packageLength',
        label: '包装长度(cm)',
        attrs: {
          controls: false,
          min: 0,
          precision: 2,
          style: {
            width: '100%'
          }
        }
      },

      {
        type: 'input-number',
        placeholder: '请输入包装宽度(cm)',
        prop: 'packageWidth',
        label: '包装宽度(cm)',
        attrs: {
          controls: false,
          min: 0,
          precision: 2,
          style: {
            width: '100%'
          }
        }
      },
      {
        type: 'input-number',
        placeholder: '请输入包装高度(cm)',
        prop: 'packageHeight',
        label: '包装高度(cm)',
        attrs: {
          controls: false,
          min: 0,
          precision: 2,
          style: {
            width: '100%'
          }
        }
      },
      {
        type: 'input-number',
        placeholder: '请输入包装重量(kg)',
        prop: 'packageHeight',
        label: '包装重量(kg)',
        attrs: {
          controls: false,
          min: 0,
          precision: 2,
          style: {
            width: '100%'
          }
        }
      },
      {
        type: 'input-number',
        placeholder: '请输入采购价格(元)',
        prop: 'purchasePrice',
        label: '采购价格(元)',
        attrs: {
          controls: false,
          min: 0,
          precision: 2,
          style: {
            width: '100%'
          }
        }
      },
      {
        type: 'select',
        placeholder: '请选择采购货币代码',
        prop: 'purchasePriceCurrencyCode',
        label: '采购货币代码',
        attrs: {
          filterable: true,
          clearable: true,
          style: {
            width: '100%'
          }
        },
        children: getIntDictOptions(DICT_TYPE.CURRENCY_CODE)
      },

      {
        type: 'input-number',
        placeholder: '请输入上次采购价格',
        prop: 'lastPurchasePrice',
        label: '上次采购价格',
        attrs: {
          controls: false,
          min: 0,
          precision: 2,
          style: {
            width: '100%'
          }
        }
      },
      {
        type: 'input-number',
        placeholder: '请输入税率',
        prop: 'taxRate',
        label: '税率',
        attrs: {
          controls: false,
          min: 0,
          precision: 2,
          style: {
            width: '100%'
          }
        }
      },
      {
        type: 'switch',
        placeholder: '是否默认供应商',
        prop: 'defaultSupplier',
        label: '税率',
        attrs: {
          style: {
            width: '100%'
          }
        }
      }
    ]
    addProperty(list)
    return list
  }

  const operateForm = (type, dialogTitle) => {
    const map = {
      detail: () => {
        requestFormOptions.value = detailFormOptions(createRequestFormOptions())
      },
      create: () => {
        requestFormOptions.value = createRequestFormOptions()
      },
      update: () => {
        requestFormOptions.value = createRequestFormOptions()
      }
    }
    map[type] && map[type]()
  }

  const initDialogData = () => {
    getProductList(productList)
    getSupplierList(supplierList)
  }

  return {
    requestFormOptions,
    operateForm,
    initDialogData
  }
}
