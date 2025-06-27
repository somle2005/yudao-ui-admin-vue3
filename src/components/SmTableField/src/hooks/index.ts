import { addWholeOrderProp, switchWholeOrderOptions } from '@/hooks/common/wholeOrder'
import { addFieldProp, getTableFieldOptions, WHOLE_ORDER_SAVE_DATA_MAP } from '../utils'
/**
    对比差异修改补充
  
    字段之间的映射覆盖逻辑统一取 映射转化 这次是取值转化为key 齿轮配置项转化为表格配置项 覆盖已经存在的配置 保留原有配置(不用做) 
    tableOptions表格配置直接取值即可 tableFieldOptions组件内部watch到会自己进行转化
    diff差异对比
    1、本地有新增修改-
    2、新加prop字段

    tableOptions为本地内容最新(必须全量在)
    data为线上保存数据为补充 对比差异 覆盖 (本地可能新增对象属性-新增对象或者删除对象)
    初始化用addFieldProp方法即可不用排序sort用本地默认顺序即可
*/

const createDiffTableOptions = (tableOptions, data) => {
  try {
    const diffList: any = []
    unref(tableOptions).forEach((item) => {
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
    // 对比之后还需要排序否则顺序会错乱
    return addFieldProp(diffList)?.sort((a, b) => a.sort - b.sort)
  } catch (e) {
    console.log(e, '报错了')
  }
}

export const useTableField = (tableOptions: any, tableFieldKey: string) => {
  const tableFieldOptions = ref<any[]>([])

  // 过滤isEnable为false的
  const filterOptions = (data: any[]) => {
    return data.filter((item) => item.isEnable)
  }

  const createTableFiledOptions = async () => {
    const data = await getTableFieldOptions(tableFieldKey)
    // 一开始默认取初始表格配置项-如果有接口值就取接口值
    let diffTableOptions: any = tableOptions.value  
    if (data.length) {
      // 对比之后还需要排序否则顺序会错乱
      diffTableOptions = createDiffTableOptions(tableOptions, data)
      tableOptions.value = filterOptions(diffTableOptions)
    }
    // 全量必须都在数据
    tableFieldOptions.value = addFieldProp(diffTableOptions)
  }

  const tableFieldConfirm = (restoreValue, data: any[]) => {
    tableOptions.value = filterOptions(restoreValue)
    tableFieldOptions.value = data
  }
  return {
    createTableFiledOptions,
    tableFieldOptions,
    tableFieldConfirm
  }
}

/**
 *  整单分行-SmTableField 都是展示各自状态下完整的allOptions数据
 *  但是生成 列表tableOptions的时候借助 switchWholeOrderOptions(wholeOrderEnable, tableOptions, allOptions) 根据状态切换表单
 */
export const useWholeOrderTableField = (
  wholeOrderEnable,
  tableOptions: any,
  tableFieldKey: string,
  allOptions
) => {
  const tableFieldOptions = ref<any[]>([])

  const createTableFiledOptions = async () => {
    const data = await getTableFieldOptions(tableFieldKey)
    // 处理接口空数据-或者初始化空数据情况
    const resolveEmpty = () => {
      // 顺序不能变因为默认isEnable-true 但是addWholeOrderProp根据状态处理可能就是false
      tableFieldOptions.value = addWholeOrderProp(wholeOrderEnable, addFieldProp(allOptions))
    }
    if (data) {
      // 可能一开始什么都没有设置过-那需要用初始化的值
      // const { itemsList = [], wholeOrderList = [] } = data
      const itemsList = data[WHOLE_ORDER_SAVE_DATA_MAP.itemsList]
      const wholeOrderList = data[WHOLE_ORDER_SAVE_DATA_MAP.wholeOrderList]

      let diffTableOptions: any = []

      // 如果是空数组还需要处理一下
      const tableFieldList = wholeOrderEnable.value ? wholeOrderList : itemsList
      // 空数组就不进行下一步操作了 说明没有进行保持过-依旧使用外部自己原来的数据不做处理
      if (!tableFieldList?.length) {
        resolveEmpty()
        return
      }

      // 对比差异的是全量 allOptions
      // 需要做处理区分整单-分行下需要启用的内容 enable-或者其他prop字段
      const wholeOrderAllOptions = addWholeOrderProp(wholeOrderEnable, allOptions)

      diffTableOptions = createDiffTableOptions(wholeOrderAllOptions, tableFieldList)

      // tableFieldOptions 是独立的-完整的
      tableFieldOptions.value = addFieldProp(diffTableOptions)

      // 切换tableOptions-是过滤过的不完整数据
      switchWholeOrderOptions(wholeOrderEnable, tableOptions, diffTableOptions)
    } else {
      resolveEmpty()
    }

    // 无数据就不用切换-保持外部初始数据即可
    // tableFieldOptions.value = addFieldProp(tableOptions.value)
  }

  // 拿到数据要处理
  const tableFieldConfirm = (restoreValue, data: any[]) => {
    // tableOptions.value = restoreValue
    switchWholeOrderOptions(wholeOrderEnable, tableOptions, restoreValue)
    tableFieldOptions.value = data
  }
  return {
    createTableFiledOptions,
    tableFieldOptions,
    tableFieldConfirm
  }
}
