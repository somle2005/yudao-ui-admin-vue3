import { PortInfoApi, PortInfoVO } from '@/api/tms/port-info'

interface SelectProp {
  value: number
  label: string
  type: string
}

// 港口信息列表
export const getPortInfoList = (data?: any, keyMap?: { [key: string]: any }) => {
  const portInfoList = ref<(PortInfoVO & SelectProp)[]>([])
  PortInfoApi.getPortInfoSimpleList().then((res) => {
    portInfoList.value = res.map((item) => {
      item.label = item.name
      item.value = item.id
      if (keyMap) {
        item.label = item[keyMap.label]
        item.value = item[keyMap.value]
      }
      return item
    })
    if (data) {
      data.value = portInfoList.value
    }
  })
  return portInfoList
}
