import { OutboundApi } from '@/api/wms/outbound'

export const useBatch = (selectionList, getList) => {
  const message = useMessage() // 消息弹窗

  const handleSubmitAuditBatch = async () => {
    try {
      await message.exportConfirm('是否确认提交审核？')

      // 整单和分行都统一做去重处理 都是取申请单id
      const billIdList: any = Array.from(new Set(selectionList.value.map((item) => item.id)))

      await OutboundApi.submitOutboundAudit({ billId: billIdList[0] })
      message.success('提交审核成功')
      // 刷新列表
      await getList()
    } catch (e) {
      console.log('提交审核报错', e)
    }
  }

  const disabledBtn = computed(() => selectionList.value.length === 0)

  return {
    disabledBtn,
    handleSubmitAuditBatch
  }
}
