import { TableOptions } from './types'

// 把驼峰转换成横杠连接
export const toLine = (value: string) => {
  return value.replace(/(A-Z)g/, '-$1').toLocaleLowerCase()
}

export const transformTableOptions = (fieldMap: { [key: string]: any }) => {
  const tableOption: Array<TableOptions> = []
  for (const key in fieldMap) {
    const obj: TableOptions = {
      prop: key,
      label: fieldMap[key],
      align: 'center'
    }
    if (fieldMap[key] instanceof Object) {
      Object.assign(obj, fieldMap[key])
    }
    tableOption.push(obj)
  }
  return tableOption
}
