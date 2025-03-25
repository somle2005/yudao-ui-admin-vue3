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
    return
  }

  requireList.forEach((prop) => {
    const target = list.find((item) => item.prop === prop) as any
    if (!target) return
    target.rules = [
      {
        required: true,
        message: `${target.label}不能为空`,
        trigger: 'blur'
      }
    ]
  })
}

export const useFormData = () => {
  const formOptions = ref<FormOptions[]>([])
  return {
    formOptions,
    addRules
  }
}


