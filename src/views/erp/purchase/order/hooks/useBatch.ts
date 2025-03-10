import { PurchaseOrderApi } from '@/api/erp/purchase/order'

export const useBatch = (selectionList, getList, wholeOrderEnable) => {
  const message = useMessage() // 消息弹窗

  // 对整单和分行的items-id获取做了处理
  const getBatchId = () => {
    let ids: any = []
    if (wholeOrderEnable.value) {
      selectionList.value.forEach((item: any) => {
        if (item?.items?.length) {
          item.items.forEach((a: any) => {
            ids.push({ id: a.id })
          })
        }
      })
    } else {
      ids = selectionList.value.map((item: any) => {
        return { id: item.purchaseApplyItemId }
      })
    }
    return ids
  }

  const handleUpdateStatusEnableBatch = async (enable: boolean) => {
    // 前端无法穷尽所有情况，所以取后端校验作为告警信息
    try {
      const text = enable ? '开启' : '关闭'
      await message.exportConfirm('是否确认' + text)
      const items = getBatchId()

      await PurchaseOrderApi.updatePurchaseOrderStatusEnable({ items, enable })
      message.success(text + '成功')
      // 刷新列表
      await getList()
    } catch (e) {
      console.log('开启关闭报错', e)
    }
  }

  const disabledBtn = computed(() => selectionList.value.length === 0)

  return {
    disabledBtn,
    handleUpdateStatusEnableBatch
  }
}
