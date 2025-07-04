import { cloneDeep } from "lodash-es"

export const useJsonList = (formRef,formData) => {
  const dialogVisible = ref(false) // 弹窗的是否展示
  const currentRow: any = {}

  /** 打开弹窗 */
  const open = async (row: any, parentFormData: any, index: number, type: string) => {
    formData.value = cloneDeep(row[type])
    currentRow.index = index
    currentRow.type = type
    currentRow.parentFormData = parentFormData
    dialogVisible.value = true
  }

  const addJsonList = async () => {
    await formRef.value?.validate()
    const { index, type, parentFormData } = currentRow
    parentFormData.value[index][type] = formData.value
    dialogVisible.value = false
  }
  return {
    dialogVisible,
    open,
    addJsonList
  }
}
