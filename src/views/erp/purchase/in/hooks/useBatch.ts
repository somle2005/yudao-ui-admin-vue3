import { PurchaseInApi } from '@/api/erp/purchase/in'
import { getWholeOrderItemsId } from '@/hooks/common/wholeOrder'

export const useBatch = (selectionList, getList, wholeOrderEnable, openForm) => {
  const message = useMessage() // 消息弹窗

  const handleSubmitAuditBatch = async () => {
    try {
      await message.exportConfirm('是否确认提交审核？')

      // 整单和分行都统一做去重处理 都是取id
      const inIds: any = Array.from(new Set(selectionList.value.map((item) => item.id)))

      await PurchaseInApi.submitPurchaseInAudit({ inIds })
      message.success('提交审核成功')
      // 刷新列表
      await getList()
    } catch (e) {
      console.log('提交审核报错', e)
    }
  }

  /** 审核/反审核操作 */
  const handleUpdateStatus = async (row: any, reviewed: boolean) => {
    const { id, items = [] } = row
    /**
      1、提交审核状态太多-直接出现
      2、很多情况都会出现 审核按钮 只要不是已审核就出现
      3、已审核状态 出现 反审核按钮
   */
    // 执行审核操作
    if (reviewed) {
      openForm('audit', id)
      return
    }
    try {
      // 审核的二次确认
      await message.confirm(`确定反审核该申请吗？`)
      // 发起审核
      // await PurchaseRequestApi.updatePurchaseRequestStatus(id, status)
      await PurchaseInApi.updatePurchaseInAuditStatus({
        reviewed,
        pass: true,
        inId: id
      })
      message.success('反审核成功')
      // 刷新列表
      await getList()
    } catch {}
  }

  /** 付款/撤销付款 */
  const changePayStatusBatch = async (list: any[], pass: boolean) => {
    const str = pass ? '付款' : '撤销付款'

    try {
      await message.confirm(`确定${str}吗？`)
      await PurchaseInApi.changePurchaseInPayStatus({
        // inItemIds: list.map((item) => item.rowItemsId),
        // 整单分行-行id获取要做区分
        inItemIds: getWholeOrderItemsId(list, wholeOrderEnable, 'rowItemsId'),
        pass
      })
      message.success(`${str}成功`)
      // 刷新列表
      await getList()
    } catch {}
  }

  const disabledBtn = computed(() => selectionList.value.length === 0)

  return {
    disabledBtn,
    handleSubmitAuditBatch,
    handleUpdateStatus,
    changePayStatusBatch
  }
}
