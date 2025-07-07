export const validateCnChart = (label) => {
  return {
    pattern: /^[\u4e00-\u9fa5]+$/,
    message: `${label}仅为中文`,
    trigger: 'blur'
  }
}
