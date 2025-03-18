const message = useMessage() // 消息弹窗
export const mergeItems = async (
  wholeOrderEnable,
  selectionList,
  openForm,
  rowIdKey,
  auditStatusKey = 'auditStatus'
) => {
  // 5已审核
  const auditType = 5
  const hasAudit = selectionList.value.some((item: any) => item[auditStatusKey] === auditType)
  if (!hasAudit) {
    message.error('选中行未包含审核单据，请检查')
    return
  }

  const items: any = []
  // 如果不是审核状态的要进行剔除
  const selectList: any = selectionList.value.filter((item: any) => item[auditStatusKey] === auditType)
  // 整单数据
  if (wholeOrderEnable.value) {
    selectList.forEach((item) => {
      if (!item?.items?.length) return
      items.push(...item.items)
    })
  }
  // 分行数据 需要去重行id相同的
  else {
    selectList.forEach((item) => {
      if (!item?.items?.length) return
      // const purchaseOrderId = item.purchaseOrderId
      // const target = item.items.find((a) => a.id === purchaseOrderId)
      const rowId = item[rowIdKey]
      const target = item.items.find((a) => a.id === rowId)
      if (target) {
        items.push(target)
      }
    })
  }

  /**
    不同的订单项-优惠率怎么处理 单据日期-供应商编号应该用哪一个 supplierId-供应商编号
    金蝶只带出第一个订单项的数据 其余让用户自己去修改
   */

  const data = { items }
  openForm('merge', selectList[0].id, data)
  // mergeLoading.value = false
}
