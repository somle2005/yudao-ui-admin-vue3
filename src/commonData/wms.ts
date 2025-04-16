import { WarehouseApi as WmsWarehouseApi, WarehouseVO as WmsWarehouseVO } from '@/api/wms/warehouse'
import { WarehouseBinApi, WarehouseBinVO } from '@/api/wms/warehouse-bin'
import { WarehouseZoneApi, WarehouseZoneVO } from '@/api/wms/warehouse-zone'

interface SelectProp {
  value: number
  label: string
  type: string
}

//  ref<(SupplierProductVO & SelectProp)[]>([])

// 获取WMS仓库下拉列表
export const getWMSWarehouseList = (data?: any) => {
  const warehouseList = ref<(WmsWarehouseVO & SelectProp)[]>([])

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

// 获得库区精简列表
export const getWarehouseZoneList = (data?: any) => {
  const warehouseZoneList = ref<(WarehouseZoneVO & SelectProp)[]>([])

  WarehouseZoneApi.getWarehouseZoneSimpleList().then((res) => {
    warehouseZoneList.value = res.map((item) => {
      item.label = item.name
      item.value = item.id
      return item
    })
    if (data) {
      data.value = warehouseZoneList.value
    }
  })
  return warehouseZoneList
}

// 获得库位精简列表
export const getWarehouseBinList = (data?: any, params?: any) => {
  const warehouseBinList = ref<(WarehouseBinVO & SelectProp)[]>([])

  WarehouseBinApi.getWarehouseBinSimpleList(params).then((res) => {
    warehouseBinList.value = res.map((item) => {
      item.label = item.name
      item.value = item.id
      return item
    })
    if (data) {
      data.value = warehouseBinList.value
    }
  })
  return warehouseBinList
}
