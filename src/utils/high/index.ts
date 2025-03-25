import { createDBFn } from '@/utils/decorate'
export const insertSearchVal = (data: any) => {
  const inputSearch = (e) => {
    const val = e.target.value
    if (val) {
      const flag = data.value.some((item: any) => item.label === val)
      if (flag) return
      data.value.unshift({
        label: val,
        value: val
      })
    }
  }
  const inputSearchDB = createDBFn(inputSearch, 1000)
  return inputSearchDB
}

export const changeValLimit = (row: any, prop: string, min: number, val: any) => {
  if (!val) {
    row[prop] = min
  }
}

export const updateModelValue = (
  val,
  row,
  list,
  targetKey = 'id',
  transFormMap: { [key: string]: string },
  fn?: (val: any, row: any, list: any[]) => void
) => {
  try {
    if (!list?.length) return
    const item = list.find((item) => item[targetKey] === val)
    if (item) {
      for (const key in transFormMap) {
        row[key] = item[transFormMap[key]]
      }
    }
    // 处理额外-调用接口拿其他值的复杂场景
    if (fn) fn(val,row,list)
  } catch (e) {
    console.log(e, '报错')
  }
}
