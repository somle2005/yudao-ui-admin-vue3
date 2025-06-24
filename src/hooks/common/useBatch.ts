export const useBatchChange = (formData) => {
  /** 选中操作 */
  const selectionList = ref<any[]>([])
  const handleSelectionChange = (rows: any[]) => {
    selectionList.value = rows
  }

  // 添加唯一id标记-用索引做唯一值
  const addSelectionId = (data: any) => {
    data.forEach((item, index) => {
      item.selectionId = index
    })
  }

  const batchChange = (row: any, val: any, prop: string) => {
    if (!formData.value.length) return
    if (!selectionList.value?.length) return
    // 修改项必须在选中项内
    const inSelect = selectionList.value.some((item) => item.selectionId === row.selectionId)
    if (!inSelect) return

    selectionList.value.forEach((item) => {
      const targetItem = formData.value.find((a) => a.selectionId === item.selectionId)
      if (targetItem) {
        targetItem[prop] = val
      }
    })
  }
  return {
    addSelectionId,
    handleSelectionChange,
    batchChange
  }
}
