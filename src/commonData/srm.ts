import { PaymentTermApi } from '@/api/srm/payment-term'

// 获取付款条款
export const getPaymentTermsList = (data?) => {
  const paymentTermList = ref<any[]>([])
  PaymentTermApi.getPaymentTermSimpleList().then((res: any) => {
    paymentTermList.value = res.map((item) => {
      const { paymentTermCn, paymentTermEnForeign, paymentTermCnForeign } = item
      item.label = paymentTermCn
      item.value = paymentTermCn
      // item.value = item.id
      item.children = [
        { label: paymentTermEnForeign, value: paymentTermEnForeign },
        { label: paymentTermCnForeign, value: paymentTermCnForeign },
        { label: paymentTermCn, value: paymentTermCn },
      ]
      return item
    })
    if (data) {
      data.value = paymentTermList.value
    }
  })
  return paymentTermList
}
