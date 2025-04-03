import { WarehouseApi as WmsWarehouseApi, WarehouseVO as WmsWarehouseVO } from '@/api/wms/warehouse'

interface SelectProp {
  value: number
  label: string
  type: string
}

//  ref<(SupplierProductVO & SelectProp)[]>([])

// 获取WMS仓库下拉列表
export const getWMSWarehouseList = (data?: any) => {
  const warehouseList = ref<WmsWarehouseVO[]>([]) // 账户列表
  // 加载账户列表
  WmsWarehouseApi.getWarehouseSimpleList().then((res) => {
    warehouseList.value = res.map((item) => {
      item.label = item.name
      item.value = item.id
      return item
    })
    if (data) {
      data.value = warehouseList.value
    }
  })
  return warehouseList
}
