// 可配置的表单

import { type RuleItem } from './rule'
// import { CSSProperties } from "vue"
import { type ValidateFieldsError } from 'async-validator'
interface Callback {
  (isValid?: boolean, invalidFields?: ValidateFieldsError): void
}

// 表单每一项的配置选项
export interface FormOptions {
  // 表单项显示的元素
  type?:
    | 'cascader'
    | 'checkbox'
    | 'checkbox-group'
    | 'checkbox-button'
    | 'color-picker'
    | 'date-picker'
    | 'input'
    | 'input-number'
    | 'radio'
    | 'radio-group'
    | 'radio-button'
    | 'rate'
    | 'select'
    | 'option'
    | 'slider'
    | 'switch'
    | 'time-picker'
    | 'time-select'
    | 'transfer'
    | 'upload'
    | 'editor'
    | 'tree-select'
  // 表单项的值
  value?: any
  // 表单项label
  label?: string
  // 表单项的标识
  prop?: string
  // 表单项的验证规则
  rules?: RuleItem[]
  // 表单项的占位符
  placeholder?: string
  slot?: string
  // 表单元素特有的属性
  // 不同表单元素例如 date-picker属性配置差距会很大所以any &联合很麻烦自己看官方文档
  attrs?: {
    [key: string]: any
  }
  events?: {
    [key: string]: any
  }
  // attrs?: {
  //   // css样式
  //   style?: CSSProperties,
  //   clearable?: boolean,
  //   showPassword?: boolean,
  //   disabled?: boolean,
  // },
  // 表单项的子元素
  // children?: FormOptions[]
  children?: any
  // 处理上传组件的属性和方法
  uploadAttrs?: {
    action?: string
    headers?: object
    method?: 'post' | 'put' | 'patch'
    multiple?: boolean
    data?: any
    name?: string
    withCredentials?: boolean
    showFileList?: boolean
    drag?: boolean
    accept?: string
    thumbnailMode?: boolean
    fileList?: any[]
    listType?: 'text' | 'picture' | 'picture-card'
    autoUpload?: boolean
    disabled?: boolean
    limit?: number
  },
  isCol?: boolean // 是否开启栅格化布局
  colConfig?: {
    [key: string]: any
  },
  // el-form-item的配置
  formItemConfig?: {
    [key: string]: any
  },
}

export interface ValidateFieldCallback {
  (message?: string, invalidFields?: ValidateFieldsError): void
}

export interface FormInstance {
  registerLabelWidth(width: number, oldWidth: number): void
  deregisterLabelWidth(width: number): void
  autoLabelWidth: string | undefined
  emit: (evt: string, ...args: any[]) => void
  labelSuffix: string
  inline?: boolean
  model?: Record<string, unknown>
  size?: string
  showMessage?: boolean
  labelPosition?: string
  labelWidth?: string
  rules?: Record<string, unknown>
  statusIcon?: boolean
  hideRequiredAsterisk?: boolean
  disabled?: boolean
  validate: (callback?: Callback) => Promise<boolean>
  resetFields: () => void
  clearValidate: (props?: string | string[]) => void
  validateField: (props: string | string[], cb: ValidateFieldCallback) => void
}
