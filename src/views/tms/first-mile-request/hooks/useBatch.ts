import { FirstMileRequestApi } from '@/api/tms/first-mile-request'
import { PurchaseInApi } from '@/api/srm/in'


export const useBatch = (selectionList, getList, openForm) => {
  const message = useMessage() // 消息弹窗

  const handleSubmitAuditBatch = async () => {
    try {
      await message.exportConfirm('是否确认提交审核？')

      const ids: any = Array.from(new Set(selectionList.value.map((item) => item.id)))

      await FirstMileRequestApi.submitFirstMileRequestAudit({ ids })
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



  const disabledBtn = computed(() => selectionList.value.length === 0)

  return {
    disabledBtn,
    handleSubmitAuditBatch,
    handleUpdateStatus,
  }
}
