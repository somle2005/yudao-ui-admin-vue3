/**
 * 配置必填-参数选填
 */

/**
 * 全量传入可以非必填
 * originName 原字段名称
 * prop 表格对应的prop 参照elementPlus
 * width 宽度
 * isEnable 字段是否开启
 * sort 排列顺序第一个从0开始依次递增
 */
interface TableOptionsProps {
  originName?: string
  prop?: string
  width?: string | number
  isEnable?: boolean
  sort?: number
  fixed?: string
}

/**
 * configList已经匹配务必 必填指定
 * originName 原字段名称
 * prop 表格对应的prop 参照elementPlus
 * width 宽度
 * isEnable 字段是否开启
 * sort 排列顺序第一个从0开始依次递增
 */
interface TableOptionsConfigProps {
  originName: string
  prop: string
  width: string | number
  isEnable: boolean
  sort: number
  fixed: string
}

/**
 * 用于外部传入映射组件内部字段
 * originName 原字段名称
 * prop 表格对应的prop 参照elementPlus
 * width 宽度
 * isEnable 字段是否开启
 * sort 排列顺序第一个从0开始依次递增
 */
interface TableOptionsConfig {
  originName: string
  prop: string
  width: string
  isEnable: string
  sort: string
  fixed: string
}
