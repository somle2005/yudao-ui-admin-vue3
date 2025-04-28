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
    >
      <template #items>
        <el-button
          type="primary"
          @click="openAddItem(formData.warehouseId!)"
          style="margin-bottom: 10px"
          v-hasPermi="['wms:stock-warehouse:query']"
          v-if="!itemsFormdisabled"
          :disabled="!formData.warehouseId"
          >选择盘点产品</el-button
        >
        <el-tabs v-model="subTabsName" class="-mt-15px -mb-10px" style="width: 100%">
          <el-tab-pane label="盘点产品清单" name="item">
            <ItemForm
              ref="itemFormRef"
              :items="formData.productItemList"
              :formType="formType"
              :disabled="itemsFormdisabled"
              :warehouseId="formData.warehouseId"
            />
          </el-tab-pane>
        </el-tabs>
      </template>
    </SmForm>

    <template #footer>
      <el-button v-if="!auditType" @click="submitFormDB" type="primary" :disabled="formLoading"
        >确 定</el-button
      >
      <template v-if="auditType">
        <el-button
          type="danger"
          :disabled="formLoading"
          @click="submitFormDB(AUDIT_TYPE.reject)"
           v-hasPermi="['wms:inventory:reject']"
        >
          不同意</el-button
        >
        <el-button
          type="primary"
          :disabled="formLoading"
          @click="submitFormDB(AUDIT_TYPE.agreeInventory)"
        >
          同意盘点</el-button
        >
      </template>

      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
  <EnableList ref="addItemRef" @success="addItem" />
</template>
<script setup lang="ts">
import ItemForm from './components/ItemForm.vue'
import EnableList from './components/EnableList.vue'
import { InventoryApi, InventoryVO } from '@/api/wms/inventory'
import { addDisabled, addProperty } from '@/components/SmForm/src/utils'
import { useOutData } from './components/hooks/outdata'
import { createDBFn } from '@/utils/decorate'
import { getWMSWarehouseList } from '@/commonData/wms'
import { distinctList } from '@/utils/transformData'
import { getItemPropList } from '@/components/SmTable/src/utils'
import { AUDIT_TYPE } from '@/utils/constant'
import { OPERATE_MAP } from './constant'
import { InventoryBinApi } from '@/api/wms/inventory-bin'

const { addItemRef, openAddItem } = useOutData()

/** 盘点 表单 */
defineOptions({ name: 'InventoryForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const initFormData = () => {
  return {
    id: undefined,
    code: undefined,
    warehouseId: undefined,
    auditStatus: undefined,
    productItemList: [] as any[],
    binItemList: []
  }
}
const formData = ref(initFormData())
const formRef = ref() // 表单 Ref
const WMSWarehouseList = ref([])

/** 子表的表单 */
const subTabsName = ref('item')
const itemFormRef = ref()
const itemsFormdisabled = computed(() => ['detail', OPERATE_MAP.abandon].includes(formType.value))

const auditType = computed(() => [OPERATE_MAP.inventory].includes(formType.value))

const requestFormOptions: any = ref([])
const createRequestFormOptions = () => {
  const list = [
    // {
    //   type: 'input',
    //   label: '单据编号',
    //   prop: 'code',
    //   placeholder: '保存时自动生成',
    //   attrs: {
    //     style: { width: '100%' },
    //     clearable: true,
    //     disabled: true
    //   }
    // },
    {
      requiredFlag: true,
      type: 'select',
      label: '仓库',
      prop: 'warehouseId',
      placeholder: '请选择仓库',
      attrs: {
        style: { width: '100%' },
        filterable: true,
        clearable: true,
        onChange: (val: any) => {}
      },
      children: WMSWarehouseList
    },
    {
      type: 'input',
      label: '备注',
      prop: 'remark',
      placeholder: '请输入备注',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      colConfig: { span: 24 },
      slot: 'items',
      formItemConfig: {
        class: 'common-form-items'
      }
    }
  ]

  addProperty(list)
  return list
}

const detailOptions = (formOptions) => {
  addDisabled(formOptions)
  return formOptions
}

const inventoryFormOptions = (formOptions) => {
  addDisabled(formOptions)
  const index = formOptions.findIndex((item) => item.slot === 'items')
  const obj: any = {
    type: 'input',
    placeholder: '请输入审核意见',
    prop: 'comment',
    label: '审核意见',
    attrs: {
      clearable: true,
      class: '!w-1/1',
      style: {
        width: '100%'
      }
    }
  }
  formOptions.splice(index, 0, obj)
  return formOptions
}

const abandonFormOptions = (formOptions) => {
  const index = formOptions.findIndex((item) => item.slot === 'items')

  const obj: any = {
    type: 'input',
    placeholder: '请输入审核意见',
    prop: 'comment',
    label: '审核意见',
    attrs: {
      clearable: true,
      class: '!w-1/1',
      style: {
        width: '100%'
      }
    }
  }
  formOptions.splice(index, 0, obj)

  return formOptions
}

const getFormData = () => {
  return formData.value
}

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()

  const formTypeOperate = {
    create: () => {
      requestFormOptions.value = createRequestFormOptions()
    },
    update: () => {
      requestFormOptions.value = createRequestFormOptions()
    },
    audit: () => {
      // requestFormOptions.value = auditFormOptions(createRequestFormOptions())
    },
    detail: () => {
      requestFormOptions.value = detailOptions(createRequestFormOptions())
    },
    [OPERATE_MAP.inventory]: () => {
      dialogTitle.value = OPERATE_MAP.inventory
      requestFormOptions.value = inventoryFormOptions(createRequestFormOptions())
    },
    [OPERATE_MAP.abandon]: () => {
      dialogTitle.value = OPERATE_MAP.abandon
      requestFormOptions.value = abandonFormOptions(detailOptions(createRequestFormOptions()))
    },
    [OPERATE_MAP.append]: () => {
      dialogTitle.value = OPERATE_MAP.append
      requestFormOptions.value = createRequestFormOptions()
    }
  }
  formTypeOperate[type]()

  getWMSWarehouseList(WMSWarehouseList)
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      let data = await InventoryApi.getInventory(id)
      getItemPropList(data.productItemList, [{ prop: 'product', keyList: ['name', 'barCode'] }])

      if (type === OPERATE_MAP.inventory) {
        data.productItemList.forEach((item) => {
          item.actualQty = item.expectedQty
        })
      }
      if (type === OPERATE_MAP.append) {
        data.binItemList.forEach((item) => {
          item.actualQty = item.expectedQty
        })
        getItemPropList(data.binItemList, [{ prop: 'product', keyList: ['name', 'barCode'] }])
        data.productItemList = data.binItemList
      }

      formData.value = data
      formRef.value.initForm()
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async (type?: string) => {
  // 校验表单
  await formRef.value.validate()
  await itemFormRef.value.validate()

  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as InventoryVO as any
    if (formType.value === 'create') {
      await InventoryApi.createInventory(data)
      message.success(t('common.createSuccess'))
    } else if (formType.value === 'update') {
      await InventoryApi.updateInventory(data)
      message.success(t('common.updateSuccess'))
    } else if (formType.value === OPERATE_MAP.abandon) {
      await InventoryApi.abandonInventory({ billId: data.id, comment: data.comment })
      message.success(t('common.updateSuccess'))
    } else if (formType.value === OPERATE_MAP.inventory) {
      if (type === AUDIT_TYPE.agreeInventory) {
        await message.delConfirm('同意后系统将自动调整库存盘点差异值')
        await InventoryApi.submitInventoryAudit({ billId: data.id, comment: data.comment })
        await InventoryBinApi.updateInventoryBinActualQuantity(data.productItemList)
        await InventoryApi.agreeInventoryAuditStatus({ billId: data.id, comment: data.comment })
      }

      if(type === AUDIT_TYPE.reject) {
        await InventoryApi.submitInventoryAudit({ billId: data.id, comment: data.comment })
        await InventoryApi.rejectInventoryAuditStatus({ billId: data.id, comment: data.comment })
      }

      message.success(t('common.updateSuccess'))
    } else if (formType.value === OPERATE_MAP.append) {
      await InventoryBinApi.appendInventoryBin(data.productItemList)
      message.success(t('common.updateSuccess'))
    }

    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

const submitFormDB = createDBFn(submitForm)

/** 重置表单 */
const resetForm = () => {
  formData.value = initFormData()
  formRef.value?.resetFields()
}

const itemIdKey = 'stockWarehousePageId'
const addItem = (selectionList: any[]) => {
  nextTick(() => {
    // 测试用例
    // {
    // "inboundItemId":4529,
    // "qty":1,
    // "binId":2
    // },
    const items = formData.value.productItemList
    const selectList = selectionList.map((item: any) => {
      const { id, productId, productBarCode, availableQty } = item

      const obj = {
        [itemIdKey]: id,
        productId,
        productBarCode,
        expectedQty: availableQty
      }
      return obj
    })
    formData.value.productItemList = distinctList(items, selectList, itemIdKey)
  })
}
</script>
