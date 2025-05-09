<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <SmForm
      class="-mb-15px"
      ref="formRef"
      isCol
      label-width="150px"
      v-model="formData"
      v-loading="formLoading"
      :options="requestFormOptions"
      :getModelValue="getFormData"
    />

    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { StockOwnershipApi, StockOwnershipVO } from '@/api/wms/stock-ownership'
import { OPERATE_MAP } from './constant'
import { StockOwnershipMoveApi } from '@/api/wms/stock-ownership-move'

/** 所有者库存 表单 */
defineOptions({ name: 'StockOwnershipForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改

const initFormData = () => {
  return {
    id: undefined,
    no: undefined,
    executeStatus: undefined,
    warehouseId: undefined,
    itemList: []
  }
}

const formData = ref(initFormData())

const formRef = ref() // 表单 Ref

const requestFormOptions: any = ref([])
const moveFormOptions = () => {
  // const list = [
  //   {
  //     type: 'select',
  //     label: '仓库',
  //     prop: 'warehouseId',
  //     attrs: {
  //       style: { width: '100%' },
  //       disabled: true,
  //       filterable: true,
  //       clearable: true
  //     },
  //     children: WMSWarehouseList
  //   },
  //   // productId
  //   {
  //     type: 'input',
  //     prop: 'productBarCode',
  //     label: '产品编码',
  //     attrs: {
  //       disabled: true,
  //       filterable: true,
  //       clearable: true,
  //       style: {
  //         width: '100%'
  //       }
  //     }
  //   },
  //   // fromBinId
  //   {
  //     type: 'input',
  //     prop: 'binName',
  //     label: '调出库位',
  //     attrs: {
  //       disabled: true,
  //       filterable: true,
  //       clearable: true,
  //       style: {
  //         width: '100%'
  //       }
  //     }
  //   },
  //   {
  //     type: 'select',
  //     label: '调入库位',
  //     prop: 'toBinId',
  //     placeholder: '请选择调入库位',
  //     attrs: {
  //       style: { width: '100%' },
  //       filterable: true,
  //       clearable: true
  //     },
  //     children: warehouseBinList
  //   },
  //   {
  //     requiredFlag: true,
  //     componentType: 'sm-number',
  //     prop: 'qty',
  //     label: '移动数量',
  //     attrs: {
  //       filterable: true,
  //       clearable: true,
  //       max: formData.value.binAvailableQty,
  //       style: {
  //         width: '100%'
  //       }
  //     }
  //   }
  // ]
  // addProperty(list)
  const list = []
  return list
}

const getFormData = () => {
  return formData.value
}

/** 打开弹窗 */
const open = async (type: string, id?: number, row?: any) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()

  const formTypeOperate = {
    [OPERATE_MAP.moveOwnership]: () => {
      requestFormOptions.value = moveFormOptions()
      dialogTitle.value = OPERATE_MAP.moveOwnership

      // const { binAvailableQty, binName, binId, productId, productBarCode, warehouseId } = row
      // const obj: any = {
      //   binAvailableQty,
      //   fromBinId: binId,
      //   binName,
      //   productId,
      //   productBarCode,
      //   qty: binAvailableQty,
      //   warehouseId
      // }

      // nextTick(() => {
      //   const qtyItem = requestFormOptions.value.find((item) => item.prop === 'qty')
      //   qtyItem.attrs.max = obj.binAvailableQty
      //   formData.value = obj
      //   getWarehouseBinList(warehouseBinList, { warehouseId })
      //   formRef.value.initForm()
      // })
    }
  }
  formTypeOperate[type]()

  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await StockOwnershipApi.getStockOwnership(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as StockOwnershipVO

    if (formType.value === OPERATE_MAP.moveOwnership) {
      await StockOwnershipMoveApi.createStockOwnershipMove(data)
      message.success(t('common.updateSuccess'))
    }

    // if (formType.value === 'create') {
    //   await StockOwnershipApi.createStockOwnership(data)
    //   message.success(t('common.createSuccess'))
    // } else {
    //   await StockOwnershipApi.updateStockOwnership(data)
    //   message.success(t('common.updateSuccess'))
    // }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = initFormData()
  formRef.value?.resetFields()
}
</script>
