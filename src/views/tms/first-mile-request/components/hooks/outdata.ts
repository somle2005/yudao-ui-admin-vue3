export const useOutData = () => {
  const addItemRef = ref()
  const openAddItem = () => {
    addItemRef.value.open()
  }
  return {
    addItemRef,
    openAddItem
  }
}
