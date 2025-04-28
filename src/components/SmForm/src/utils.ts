import { FormOptions } from './types/types'

export const addRules = (list: any[], requireList?: any[]) => {
  // 空数组就是全部都是必填项
  if (!requireList?.length) {
    list.forEach((item) => {
      item.rules = [
        {
          required: true,
          message: `${item.label}不能为空`,
          trigger: 'blur'
        }
      ]
    })
    return list
  }

  requireList.forEach((prop) => {
    const target = list.find((item) => item.prop === prop) as any
    if (!target) return
    if (target.rules) return
    target.rules = [
      {
        required: true,
        message: `${target.label}不能为空`,
        trigger: 'blur'
      }
    ]
  })
  return list
}

export const useFormData = () => {
  const formOptions = ref<FormOptions[]>([])
  return {
    formOptions,
    addRules
  }
}

// 根据 例如requiredFlag属性进行对应的操作-这样 字段多次修改都统一处理了
export const addProperty = (list: any[]) => {
  list.forEach((item: any) => {
    if (item.requiredFlag && !item.rules) {
      item.rules = [
        {
          required: true,
          message: `${item.label}不能为空`,
          trigger: 'blur'
        }
      ]
    }
  })
  return list
}

export const addDisabled = (list: any[], disabledList?: any[]) => {
  // 空数组就是全部都是禁用项
  const resolveItem = (item: any) => {
    if (item.attrs) {
      item.attrs.disabled = true
    } else {
      item.attrs = {
        disabled: true
      }
    }
  }
  if (!disabledList?.length) {
    list.forEach((item) => {
      resolveItem(item)
    })
    return list
  }
  disabledList.forEach((prop) => {
    const target = list.find((item) => item.prop === prop) as any
    if (!target) return
    resolveItem(target)
  })
  return list
}
