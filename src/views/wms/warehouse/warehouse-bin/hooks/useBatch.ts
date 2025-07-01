import { WarehouseBinApi } from '@/api/wms/warehouse-bin'
import { cloneDeep } from 'lodash-es'

export const useBatch = (selectionList, getList) => {
  const message = useMessage() // 消息弹窗

  const handleUpdateStatusEnableBatch = async (status: number) => {
    // 前端无法穷尽所有情况，所以取后端校验作为告警信息
    try {
      const text = status === 1 ? '启用' : '禁用'
      await message.exportConfirm('是否确认' + text)

      const items = cloneDeep(unref(selectionList.value))
      items.forEach((item) => {
        item.status = status
      })

      await WarehouseBinApi.updateWarehouseBinBatch(items)
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
