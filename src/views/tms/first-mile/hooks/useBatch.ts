import { FirstMileApi } from '@/api/tms/first-mile'

export const useBatch = (selectionList, getList, openForm) => {
  const message = useMessage() // 消息弹窗

  const handleSubmitAuditBatch = async () => {
    try {
      await message.exportConfirm('是否确认提交审核？')

      const ids: any = Array.from(new Set(selectionList.value.map((item) => item.id)))

      await FirstMileApi.submitFirstMileAudit(ids)
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
      await FirstMileApi.auditFirstMileStatus({
        reviewed, // 反审核false
        pass: true, // 反审核无意义
        requestId: id
        // auditAdvice: data.auditAdvice 金蝶也是直接反审核没有填写数据的-后期如果要填写-再加一个按钮进行区分开来- openForm('rejectAudit', id)
      })
      message.success('反审核成功')
      // 刷新列表
      await getList()
    } catch {}
  }

  const disabledBtn = computed(() => selectionList.value.length === 0)
  const oneSelectDisabledBtn = computed(() => selectionList.value.length !== 1)

  return {
    disabledBtn,
    oneSelectDisabledBtn,
    handleSubmitAuditBatch,
    handleUpdateStatus
  }
}
