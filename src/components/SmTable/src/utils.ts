import { TableOptions } from './types'

// 把驼峰转换成横杠连接
export const toLine = (value: string) => {
  return value.replace(/(A-Z)g/, '-$1').toLocaleLowerCase()
}

export const transformTableOptions = (
  fieldMap: { [key: string]: any },
  config?: { [key: string]: any }
) => {
  const tableOption: Array<TableOptions> = []

  for (const key in fieldMap) {
    const obj: TableOptions = {
      prop: key,
      label: fieldMap[key],
      align: 'center',
      width: '100px'
    }
    if (config?.noWidth) {
      obj.width = undefined
    }
    if (fieldMap[key] instanceof Object) {
      Object.assign(obj, fieldMap[key])
    }
    tableOption.push(obj)
  }
  return tableOption
}

export const dealTableField = (data, tableOptions) => {
  // 传递过来的数据已经排好序了
  const list = data.filter((item) => item.isEnable)
  const filterData: any = []
  list.forEach((item) => {
    const source = tableOptions.find((option) => option.prop === item.prop)
    if (!source) return
    const obj = Object.assign(source, item)
    filterData.push(obj)
  })
  // console.log(data,'获取原先传递的数据格式-tableOptions数据', tableOptions)
  // console.log(filterData,'filterData')
  return filterData
}

export const useTableData = () => {
  const tableOptions = ref<TableOptions[]>([])
  const allTableOptions = ref<TableOptions[]>([])

  return {
    allTableOptions,
    tableOptions,
    transformTableOptions,
    dealTableField
  }
}
