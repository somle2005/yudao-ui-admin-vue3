/**
 * erpPurchaseRequestItemNo 采购申请单No 源单单号 统一修改成 purchaseApplyCode
 * 
 *   // 手动适配添加
  purchaseApplyCode: {
    label: '源单单号',
    wholeOrderEnable: WHOLE_ORDER_TYPE.items
  },

    
     整单的时候才对mergeCompute进行合并计算-展示合并计算的
     如果是分行的时候就要展示分行的
     这样的话比如采购到货的时候 既要展示分行又要展示合并计算的逻辑就行不通了。
     所以要满足这种就得加字段-涉及到options联动-设置表格 通过字段名进行区分
    itemsList.value = wholeOrderMergeCompute(itemsList.value, allOptions)

    
 **/
