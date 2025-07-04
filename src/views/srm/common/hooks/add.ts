import { SupplierProductApi } from '@/api/srm/supplier-product'

export const useSupplierProductList = (formTypeList: string[], openFormData) => {
  // !['create', 'update']
  const canSupplierProductList = (props, formData, supplierId) => {
    /**
     * 新增状态下进行处理-大量空值处理 供应商-supplierId 清单行productId处理
     * 缓存机制要加上防止重复请求-参照这个函数canSourceBinList
     * 不进行空值处理-如果带上后用户删除了这个产品后者删除了主单供应商 因为用户是可以自己手动输入含税价格的
     */

    if (!formTypeList.includes(props.formType)) return
    if (!supplierId) return
    const batchlist: any = []
    formData.value.forEach((item) => {
      if (item.productId) {
        batchlist.push({
          supplierId,
          productId: item.productId
        })
      }
    })
    if (!batchlist?.length) return
    // 有产品变更删除-用户没有输入有效值大于0的值 才会对值进行覆盖
    SupplierProductApi.getBatchSupplierProductDefaultLastPrice(batchlist)
      .then((res) => {
        const items = res.items
        const copyFormData = unref(formData)
        const resolveVal = (item) => {
          const { productId, taxRate, lastPrice } = item
          for (let i = 0; i < copyFormData.length; i++) {
            const targetItem = copyFormData[i]
            if (targetItem.productId === productId) {
              if (taxRate !== null) {
                targetItem.taxRate = taxRate
              }
              if (lastPrice !== null) {
                targetItem.grossPrice = lastPrice
              }
            }
          }
        }
        if (items?.length) {
          items.forEach((item) => {
            resolveVal(item)
          })
        }
      })
      .catch((e) => {
        console.log(e, '报错了')
      })
  }

  // 单选
  const canOneSupplierProductList = (props, row: any) => {
    if (!formTypeList.includes(props.formType)) return
    const supplierId = openFormData.value.supplierId
    const productId = row.productId
    if (!supplierId || !productId) return
    const batchlist = [{ supplierId, productId }]
    // 有产品变更删除-用户没有输入有效值大于0的值 才会对值进行覆盖
    SupplierProductApi.getBatchSupplierProductDefaultLastPrice(batchlist)
      .then((res) => {
        const items = res.items
        if (items?.length) {
          const { taxRate, lastPrice } = items[0]
          if (taxRate !== null) {
            row.taxRate = taxRate
          }
          if (lastPrice !== null) {
            row.grossPrice = lastPrice
          }
        }
      })
      .catch((e) => {
        console.log(e, '报错了')
      })
  }

  return {
    canSupplierProductList,
    canOneSupplierProductList
  }
}
