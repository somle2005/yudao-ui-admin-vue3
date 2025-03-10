export interface TableOptions {
  // 字段名称
  prop?: string
  // 表头
  label: string
  // 对应列的宽度
  // width?: string | number
  width?: string
  // 对应列的最小宽度
  // minWidth?: string | number
  minWidth?: string 
  // 对齐方式
  align?: 'left' | 'center' | 'right'
  // 自定义列模板的插槽名
  slot?: string
  // 是否是操作项
  action?: boolean
  // 是否可以编辑
  editable?: boolean
  // 用来格式化内容
  formatter?: (row: any, column: any, cellValue: any, index: number) => VNode | string
  // 文字是否换行 需要开启slot
  wrap?: boolean
  [key: string]: any
}
