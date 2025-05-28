import { TransferApi } from '@/api/tms/transfer'

export const useBatch = (selectionList, getList, openForm) => {
  const message = useMessage() // 消息弹窗

  const getBatchId = (selectionList) => {
    const ids: any = []
    selectionList.value.forEach((item: any) => {
      if (item?.items?.length) {
        item.items.forEach((a: any) => {
          ids.push(a.id)
        })
      }
    })
    return ids
  }

  const handleSubmitAuditBatch = async () => {
    try {
      await message.exportConfirm('是否确认提交审核？')

      const ids: any = Array.from(new Set(selectionList.value.map((item) => item.id)))

      await TransferApi.submitTransferAudit(ids)
      message.success('提交审核成功')
      // 刷新列表
      await getList()
    } catch (e) {
      console.log('提交审核报错', e)
    }
  }

  /** 审核/反审核操作 */
  const handleUpdateStatus = async (row: any, reviewed: boolean) => {
    const { id } = row
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
      await TransferApi.auditTransferStatus({
        reviewed, // 反审核false
        pass: true, // 反审核无意义
        id
        // auditAdvice: data.auditAdvice 金蝶也是直接反审核没有填写数据的-后期如果要填写-再加一个按钮进行区分开来- openForm('rejectAudit', id)
      })
      message.success('反审核成功')
      // 刷新列表
      await getList()
    } catch {}
  }

  const handleUpdateStatusEnableBatch = async (enable: boolean) => {
    // 前端无法穷尽所有情况，所以取后端校验作为告警信息
    try {
      const text = enable ? '开启' : '关闭'
      await message.exportConfirm('是否确认' + text)
      // const itemIds = getBatchId(wholeOrderEnable, selectionList)
      const itemIds = getBatchId(selectionList.value)
      await TransferApi.updateTransferoffStatus({ itemIds, enable })
      message.success(text + '成功')
      // 刷新列表
      await getList()
    } catch (e) {
      console.log('开启关闭报错', e)
    }
  }

  const disabledBtn = computed(() => selectionList.value.length === 0)
  const oneSelectDisabledBtn = computed(() => selectionList.value.length !== 1)

  return {
    disabledBtn,
    oneSelectDisabledBtn,
    handleSubmitAuditBatch,
    handleUpdateStatus,
    handleUpdateStatusEnableBatch
  }
}
