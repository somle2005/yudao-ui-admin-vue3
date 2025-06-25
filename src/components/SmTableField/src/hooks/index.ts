import { addFieldProp, getTableFieldOptions } from '../utils'
/**
    对比差异修改补充
  
    字段之间的映射覆盖逻辑统一取 映射转化 这次是取值转化为key 齿轮配置项转化为表格配置项 覆盖已经存在的配置 保留原有配置(不用做) 
    tableOptions表格配置直接取值即可 tableFieldOptions组件内部watch到会自己进行转化
    diff差异对比
    1、本地有新增修改-
    2、新加prop字段

    tableOptions为本地内容最新(必须全量在)
    data为线上保存数据为补充 对比差异 覆盖 (本地可能新增对象属性-新增对象或者删除对象)
*/

const createDiffTableOptions = (tableOptions, data) => {
  try {
    const diffList: any = []
    tableOptions.value.forEach((item) => {
      const targetItem = data.find((a) => a.prop === item.prop)
      if (targetItem) {
        // 线上覆盖线下-线下有新增不会覆盖
        Object.assign(item, targetItem)
        diffList.push(item)
      } else {
        // 找不到说明是新增项或者prop字段修改了 sort为1排序前列
        diffList.push(item)
      }
    })
    return addFieldProp(diffList)
  } catch (e) {
    console.log(e, '报错了')
  }
}

export const useTableField = (tableOptions: any, tableFieldKey: string) => {
  const tableFieldOptions = ref<any[]>([])

  const createTableFiledOptions = async () => {
    const data = await getTableFieldOptions(tableFieldKey)
    if (data.length) {
      // 对比之后还需要排序否则顺序会错乱
      tableOptions.value = createDiffTableOptions(tableOptions, data)?.sort(
        (a, b) => a.sort - b.sort
      ) as any[]
    }
    tableFieldOptions.value = addFieldProp(tableOptions.value)
  }

  const tableFieldConfirm = (restoreValue, data: any[]) => {
    tableOptions.value = restoreValue
    tableFieldOptions.value = data
  }
  return {
    createTableFiledOptions,
    tableFieldOptions,
    tableFieldConfirm
  }
}
