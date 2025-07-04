import { isValRepeat } from '@/utils/judge'
import { reduceVal } from '@/utils/transformData'

export const getProductIdRules = (formData, formType) => {
  const productIdRuleList = [
    { required: true, message: '产品不能为空', trigger: 'blur' },
    {
      validator: function (rule, value, callback, source, options) {
        // 非合并状态下进行判定
        if (formType === 'merge') {
          callback()
          return
        }
        const productId = rule.row.productId
        const hasRepeat = isValRepeat(formData.value, productId, 'productId')
        if (hasRepeat) {
          callback(new Error('明细行产品不能重复'))
        } else {
          //校验通过
          callback()
        }
      },
      trigger: 'blur'
    }
  ]

  const createProductIdRule = (row: any) => {
    return [
      productIdRuleList[0],
      {
        ...productIdRuleList[1],
        row
      }
    ] as any[]
  }

  return {
    productIdRuleList,
    createProductIdRule
  }
}

// item[key]每次拿最新值-防止值固定化
export const getReduceMaxRules = (
  formData,
  item,
  maxMap: { maxLabel: string; maxKey: string },
  reduceList: { label: string; reduceKey: string }[]
) => {
  const createReduceMaxRules = (curProp: string) => {
    const reduceMaxRules = [
      {
        validator: function (rule, value, callback, source, options) {
          const { maxLabel, maxKey } = maxMap
          const max = item[maxKey]

          // 校验当前prop即可
          const reduceItem = reduceList.find((item) => item.reduceKey === curProp)!
          const { label, reduceKey } = reduceItem
          const sumVal = reduceVal(reduceKey, unref(formData))
          if (sumVal > max) {
            callback(new Error(`${label}合计数量不能超过${maxLabel}`))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]

    return reduceMaxRules
  }

  return {
    createReduceMaxRules
  }
}
