export const useImport = (template: { url: any; name: string }) => {
  const smImportFileRef = ref()
  const templateObj = ref(template)
  /** 导入按钮操作 */
  const handleImport = async () => {
    smImportFileRef.value.open()
  }
  return {
    smImportFileRef,
    templateObj,
    handleImport
  }
}
