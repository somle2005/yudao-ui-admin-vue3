import { TableOptions } from './types'

// 把驼峰转换成横杠连接
export const toLine = (value: string) => {
  return value.replace(/(A-Z)g/, '-$1').toLocaleLowerCase()
}

const resolveConfig = (tableOption, config) => {
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
  const { allWrap, wrapList, noWidthList = [], allWrapIgnoreList = [] } = config

  const allWrapDeal = (allWrap, item) => {
    if (!allWrap) return
    allWrapIgnoreList.push(...['operate'])
    if (allWrapIgnoreList.includes(item.prop)) return
    const propertyList = ['dictAttrs', 'formatter']
    const flag = propertyList.some((a) => item[a])
    if (flag) return

    item.slot = item.prop
    item.wrap = true
    if (!item.noWidth) {
      item.width = '200px'
    }
  }

  const wrapListDeal = (wrapList, item) => {
    if (!wrapList) return
    item.slot = item.prop
    item.wrap = true
    if (!item.noWidth) {
      item.width = '200px'
    }
  }

  const noWidthListDeal = (noWidthList, item) => {
    if (!noWidthList) return
    if (noWidthList.includes(item.prop)) {
      item.width = undefined
    }
  }

  tableOption.forEach((item) => {
    allWrapDeal(allWrap, item)
    wrapListDeal(wrapList, item)
    noWidthListDeal(noWidthList, item)
  })

  // if (allWrap) {
  //   tableOption.forEach((item) => {
  //     allWrapIgnoreList.push(...['operate'])
  //     if (allWrapIgnoreList.includes(item.prop)) return
  //     const propertyList = ['dictAttrs', 'formatter']
  //     const flag = propertyList.some((a) => item[a])
  //     if (flag) return

  //     item.slot = item.prop
  //     item.wrap = true
  //     if (!item.noWidth) {
  //       item.width = '200px'
  //     }
  //   })
  // }

  // if (wrapList) {
  //   tableOption.forEach((item) => {
  //     if (wrapList.includes(item.prop)) {
  //       item.slot = item.prop
  //       item.wrap = true
  //       if (!item.noWidth) {
  //         item.width = '200px'
  //       }
  //     }
  //   })
  // }

  // if (noWidthList) {
  //   tableOption.forEach((item) => {
  //     if (noWidthList.includes(item.prop)) {
  //       item.width = undefined
  //     }
  //   })
  // }
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

  resolveConfig(tableOption, config)

  return tableOption
}

export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const assignItem = (item: { [key: string]: any }, parentItem, itemKey: string) => {
  for (const key in item) {
    // key首字母大写
    // parentItem[itemKey + key[0].toUpperCase() + key.slice(1)] = item[key]
    parentItem[itemKey + capitalize(key)] = item[key]
  }
}

export const getItemProp = (list: any[], itemKeyList: string[]) => {
  list.forEach((item) => {
    itemKeyList.forEach((key) => {
      const targetItem = item[key]
      if (!targetItem) return
      assignItem(targetItem, item, key)
    })
  })
  return list
}

export const transformCapitalizeList = (item: any, prop: string, keyList: string[]) => {
  if (!item[prop]) return
  try {
    keyList.forEach((key) => {
      const val = item[prop][key]
      item[prop + capitalize(key)] = val
    })
  } catch (e) {
    console.log(e, `报错了${prop}`)
  }
}

export const getItemPropList = (list: any[], propList: any[]) => {
  try {
    list.forEach((item) => {
      propList.forEach((propItem) => {
        const { prop, keyList } = propItem
        // 取出list[prop]中keyList对应属性 转化成首字母大写
        transformCapitalizeList(item, prop, keyList)
      })
    })
    return list
  } catch (e) {
    console.log(e, '报错了')
  }
}

export const useTableData = () => {
  const tableOptions = ref<TableOptions[]>([])
  const allTableOptions = ref<TableOptions[]>([])

  return {
    allTableOptions,
    tableOptions,
    transformTableOptions,
    getItemProp,
    getItemPropList
  }
}
