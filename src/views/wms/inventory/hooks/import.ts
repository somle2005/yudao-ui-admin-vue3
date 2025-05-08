import * as CustomerApi from '@/api/crm/customer'
import { InventoryBinApi } from '@/api/wms/inventory-bin'

export const useImport = (refreshDetail, operateImportFormData, formData, inventoryId) => {
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
  const importUrlFn = (importData) => {
    const fnMap = {
      [importMap.create]: () => {
        importData.append('warehouseId', formData.value.warehouseId)
        return InventoryBinApi.parseInventoryProductBin(importData).then((res) => {
          operateImportFormData(res.data)
        })
      },
      [importMap.inventory]: () => {
        importData.append('inventoryId', inventoryId.value)
        return InventoryBinApi.importInventoryBinExcel(importData).then((res) => {
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
