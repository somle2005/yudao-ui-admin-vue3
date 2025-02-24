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
