import { FormOptions } from "./types/types"

export const useFormData = () => {
  const formOptions = ref<FormOptions[]>([])
  return {
    formOptions
  }
}