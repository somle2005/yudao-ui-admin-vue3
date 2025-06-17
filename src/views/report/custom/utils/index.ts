import { getDept } from '@/utils/cache'
import { DICT_TYPE, getDictOptions } from '@/utils/dict'

export const createMapStyle = (key: string) => {
  try {
    const dictOptions = getDictOptions(DICT_TYPE.REPORT_MAP)

    const dict = dictOptions.find((item) => item.label === key)
    if (!dict) {
      return ref({
        width: '100%',
        height: '1200px'
      })
    }
    const height = dict.value + 'px'
    return ref({
      width: '100%',
      height
    })
  } catch (e) {
    console.log(e, '查询地图字典报错')
  }
}

export const toUrl = (value: string): string => {
  const { deptName } = getDept()
  let valueStr = value
  // dept会包含至少 AOK 、CBD、HCD、EBD
  const deptList = ['AOK', 'CBD', 'HCD', 'EBD']
  if (deptName) {
    const item = deptList.find((item) => valueStr.includes(item))
    if (item) {
      valueStr = valueStr + '&dept=' + item
    }
  }
  console.log(valueStr,'valueStr-报表拼接url')
  return valueStr
}
