import * as CustomerApi from '@/api/crm/customer'
import { StockCheckBinApi } from '@/api/wms/stock-check-bin'

export const useImport = (refreshDetail, operateImportFormData,operateImportFormDataResult, formData, inventoryId) => {
  const message = useMessage() // 消息弹窗

  const templateObj = ref({
    url: undefined as any,
    name: ''
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
          // wms:inbound-item:download-product-template
          templateObj.value = {
            url: StockCheckBinApi.downloadInventoryBinProductTemplate,
            name: '导入盘点产品模板.xls'
          }
        },
        [importMap.inventory]: () => {
          // wms:inbound-item:download-template
          templateObj.value = {
            url: StockCheckBinApi.downloadInventoryBinTemplate,
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
        return StockCheckBinApi.parseInventoryProductBin(importData).then((res) => {
          operateImportFormData(res.data)
        })
      },
      [importMap.inventory]: () => {
        importData.append('inventoryId', inventoryId.value)
        return StockCheckBinApi.importInventoryBinExcel(importData).then((res) => {
          operateImportFormDataResult(res.data)
          // refreshDetail()
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
