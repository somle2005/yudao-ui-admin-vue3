import { PaymentTermApi } from '@/api/srm/payment-term'

// 获取付款条款
// export const getPaymentTermsList = (data?) => {
//   const paymentTermList = ref<any[]>([])
//   PaymentTermApi.getPaymentTermSimpleList().then((res: any) => {
//     paymentTermList.value = res.map((item) => {
//       const { paymentTermZh, paymentTermEnForeign, paymentTermZhForeign } = item
//       item.label = paymentTermZh
//       item.value = paymentTermZh
//       // item.value = item.id
//       item.children = [
//         { label: paymentTermEnForeign, value: paymentTermEnForeign },
//         { label: paymentTermZhForeign, value: paymentTermZhForeign },
//         { label: paymentTermZh, value: paymentTermZh },
//       ]
//       return item
//     })
//     if (data) {
//       data.value = paymentTermList.value
//     }
//   })
//   return paymentTermList
// }

// 获取付款条款
export const getPaymentTermsList = (data?: any) => {
  const paymentTermList = ref<any[]>([])
  PaymentTermApi.getPaymentTermSimpleList().then((res: any) => {
    paymentTermList.value = res.map((item) => {
      const { paymentTermZh } = item
      item.label = paymentTermZh
      item.value = paymentTermZh
      return item
    })
    if (data) {
      data.value = paymentTermList.value
    }
  })
  return paymentTermList
}
