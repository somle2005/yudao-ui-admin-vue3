export const type = [
  {
    value: 'export',
    label: '报关'
  },
  {
    value: 'import',
    label: '清关'
  }
]

export const typeFind = (kind) => {
  return type.find((item) => item.value === kind)?.label || ''
}
