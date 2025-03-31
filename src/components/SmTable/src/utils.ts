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
    if (fieldMap[key] instanceof Object) {
      Object.assign(obj, fieldMap[key])
      // 打赏自动设置宽度的标记
      if (!fieldMap.width) {
        obj.noWidth = true
      }
      // 只能对时间字段-时间戳进行排序
      if (fieldMap[key].formatter) {
        obj.sortable = true
      }
    }
    tableOption.push(obj)
  }
  // 有些是计算属性computed 需要拿到接口后才能拿到 所以 暂定1200
  // const totalWidth = tableOption.reduce((prev, cur) => {
  //   let curWidth = 0
  //   if(cur?.width) {
  //     curWidth = Number(cur.width.replace('px', ''))
  //   }
  //   return prev + curWidth
  // },0)
  if (window.innerWidth > 1200 && config?.noWidth) {
    tableOption.forEach((item) => {
      if (!item.noWidth) {
        item.width = undefined
      }
    })
  }
  return tableOption
}

export const useTableData = () => {
  const tableOptions = ref<TableOptions[]>([])
  const allTableOptions = ref<TableOptions[]>([])

  return {
    allTableOptions,
    tableOptions,
    transformTableOptions
  }
}
