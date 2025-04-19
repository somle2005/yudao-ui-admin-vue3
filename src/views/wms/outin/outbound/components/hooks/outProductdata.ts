export const useOutProductdata = () => {
  /** 打开【可入库的订单列表】弹窗 */
  const addProductItemRef = ref() // 可入库的订单列表 Ref
  const openAddProductItem = (warehouseId) => {
    addProductItemRef.value.open(warehouseId)
  }
  return {
    addProductItemRef,
    openAddProductItem
  }
}
