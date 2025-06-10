export const useOutData = () => {
  /** 打开【可入库的订单列表】弹窗 */
  const addItemRef = ref() // 可入库的订单列表 Ref
  const openAddItem = (supplierId) => {
    addItemRef.value.open(supplierId)
  }
  return {
    addItemRef,
    openAddItem
  }
}
