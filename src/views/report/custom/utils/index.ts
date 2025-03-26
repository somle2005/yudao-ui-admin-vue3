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
