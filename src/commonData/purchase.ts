// 获取付款条款
export const getPaymentTermsList = (data?) => {
  const list = [
    { label: '这是付款条款', value: 1 },
    { label: '这是付款条款2', value: 2 },
    { label: '这是付款条款3', value: 3 }
  ]
  if (data) {
    data.value = list
  }
  return ref(list)
}
