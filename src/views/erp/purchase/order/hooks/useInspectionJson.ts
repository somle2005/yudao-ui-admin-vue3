export const useInspectionJson = () => {
  const inspectionJsonFormRef = ref()
  const inspectionJsonTabsName = ref('inspectionJson')

  return {
    inspectionJsonFormRef,
    inspectionJsonTabsName
  }
}
