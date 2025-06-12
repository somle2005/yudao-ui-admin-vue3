export const useRules = () => {
  const planQtyRuleList = [
    { required: true, message: '数量不能为空', trigger: 'blur' },
    {
      validator: function (rule, value, callback, source, options) {
        const { pickQty, availableQty } = rule.row
        const flag = pickQty > availableQty
        if (flag) {
          callback(new Error('已选择数不能超过可用库存数量'))
        } else {
          //校验通过
          callback()
        }
      },
      trigger: 'blur'
    }
  ]

  const createPlanQtyRuleList = (row: any) => {
    return [
      planQtyRuleList[0],
      {
        ...planQtyRuleList[1],
        row
      }
    ] as any[]
  }

  return {
    planQtyRuleList,
    createPlanQtyRuleList
  }
}
