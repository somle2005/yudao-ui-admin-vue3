import { getRepeatMap } from '@/utils/judge'

export const isAbandon = (status: any) => {
  return [0, 2].includes(status) //草稿0 驳回2
}

export const addComment = (formOptions) => {
  const index = formOptions.findIndex((item) => item.slot === 'items')
  const obj: any = {
    type: 'input',
    placeholder: '请输入审核意见',
    prop: 'comment',
    label: '审核意见',
    attrs: {
      clearable: true,
      class: '!w-1/1',
      style: {
        width: '100%'
      }
    }
  }
  formOptions.splice(index, 0, obj)
  return formOptions
}

export const getBinIdRules = (formData) => {
  const binIdRuleList = [
    { required: true, message: '库位不能为空', trigger: 'blur' },
    {
      validator: function (rule, value, callback, source, options) {
        const productId = rule.row.productId
        const repeatMap = getRepeatMap(formData.value)!
        const hasRepeat = repeatMap[productId][value] > 1
        if (hasRepeat) {
          callback(new Error('相同产品库位不能重复'))
        } else {
          //校验通过
          callback()
        }
      },
      trigger: 'blur'
    }
  ]

  const createBinIdRule = (row: any) => {
    return [
      binIdRuleList[0],
      {
        ...binIdRuleList[1],
        row
      } 
    ] as any[]
  }

  return {
    binIdRuleList,
    createBinIdRule
  }
}
