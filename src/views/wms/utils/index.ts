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
