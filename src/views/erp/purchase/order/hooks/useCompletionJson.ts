export const useCompletionJson = () => {
  const completionJsonFormRef = ref()
  const completionJsonTabsName = ref('completionJson')

  return {
    completionJsonFormRef,
    completionJsonTabsName
  }
}
