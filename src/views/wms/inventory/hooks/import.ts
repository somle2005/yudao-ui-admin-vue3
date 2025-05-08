import * as CustomerApi from '@/api/crm/customer'
import { InventoryBinApi } from '@/api/wms/inventory-bin'

export const useImport = (refreshDetail, operateImportFormData) => {
  const message = useMessage() // 消息弹窗

  const templateObj = ref({
    url: CustomerApi.importCustomerTemplate,
    name: '客户导入模版.xls'
  })

  const importMap = {
    inventory: 'inventory',
    create: 'create'
  }
  let importType = ''
  const smImportFileRef = ref()
  /** 导入按钮操作 */
  const handleImport = async (type: string) => {
    try {
      importType = type
      // templateObj进行操作处理-对导入模板和name进行处理
      const fnMap = {
        [importMap.create]: () => {
          templateObj.value = {
            url: CustomerApi.importCustomerTemplate,
            name: '导入盘点产品模板.xls'
          }
        },
        [importMap.inventory]: () => {
          templateObj.value = {
            url: CustomerApi.importCustomerTemplate,
            name: '导入盘点结果模板.xls'
          }
        }
      }
      fnMap[importType]()

      await message.exportConfirm('导入会覆盖已有数据')
      smImportFileRef.value.open()
    } catch (e) {
      console.log(e, '报错')
    }
  }
  const importUrlFn = (formData) => {
    const fnMap = {
      [importMap.create]: () => {
        return InventoryBinApi.importInventoryProductExcel(formData).then((res) => {
          operateImportFormData(res)
          console.log(res, '进行处理')
        })
      },
      [importMap.inventory]: () => {
        return InventoryBinApi.importInventoryBinExcel(formData).then((res) => {
          refreshDetail()
          console.log(res, '进行处理')
        })
      }
    }
    return fnMap[importType]()
  }

  return {
    importMap,
    templateObj,
    smImportFileRef,
    handleImport,
    importUrlFn
  }
}
