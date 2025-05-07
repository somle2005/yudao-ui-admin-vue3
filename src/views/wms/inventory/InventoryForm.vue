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
          v-if="buttonExist"
          :disabled="!formData.warehouseId"
          >选择盘点库位</el-button
        >
        <el-tabs v-model="subTabsName" class="-mt-15px -mb-10px" style="width: 100%">
          <el-tab-pane label="盘点库位清单" name="item">
            <ItemForm
              ref="itemFormRef"
              :items="formData.binItemList"
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
import { distinctList, filterObjKey } from '@/utils/transformData'
import { getItemPropList } from '@/components/SmTable/src/utils'
import { AUDIT_TYPE } from '@/utils/constant'
import { OPERATE_MAP } from './constant'
import { InventoryBinApi } from '@/api/wms/inventory-bin'
import { addComment } from '../utils'
import { getIntDictOptions } from '@/utils/dict'

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
    // productItemList: [] as any[],
    binItemList: [] as any[]
  }
}
const formData = ref(initFormData())
const formRef = ref() // 表单 Ref
const WMSWarehouseList = ref([])

/** 子表的表单 */
const subTabsName = ref('item')
const itemFormRef = ref()

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

const detailOptions = () => {
  const formOptions = [
    {
      type: 'input',
      label: '盘点单号',
      prop: 'code',
      attrs: {
        style: { width: '100%' },
        clearable: true,
        disabled: true
      }
    },
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
      type: 'select',
      label: '状态',
      prop: 'auditStatus',
      placeholder: '请选择状态',
      attrs: {
        style: { width: '100%' },
        filterable: true,
        clearable: true
      },
      children: getIntDictOptions(DICT_TYPE.WMS_INVENTORY_AUDIT_STATUS)
    },

    {
      type: 'input',
      label: '创建人',
      prop: 'creatorName',
      attrs: {
        style: { width: '100%' },
        clearable: true,
        disabled: true
      }
    },
    {
      type: 'date-picker',
      placeholder: '请选择创建时间',
      prop: 'createTime',
      label: '创建时间',
      attrs: {
        clearable: true,
        type: 'date',
        format: 'YYYY-MM-DD HH:mm:ss',
        defaultTime: [new Date('1 00:00:00'), new Date('1 23:59:59')],
        class: '!w-240px',
        style: {
          width: '100%'
        }
      }
    },
    {
      type: 'input',
      label: '更新人',
      prop: 'updaterName',
      attrs: {
        style: { width: '100%' },
        clearable: true,
        disabled: true
      }
    },
    {
      type: 'date-picker',
      placeholder: '请选择更新时间',
      prop: 'updateTime',
      label: '更新时间',
      attrs: {
        clearable: true,
        type: 'date',
        format: 'YYYY-MM-DD HH:mm:ss',
        defaultTime: [new Date('1 00:00:00'), new Date('1 23:59:59')],
        class: '!w-240px',
        style: {
          width: '100%'
        }
      }
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
  addDisabled(formOptions)
  return formOptions
}

const inventoryFormOptions = (formOptions) => {
  addDisabled(formOptions)
  addComment(formOptions)
  return formOptions
}

const abandonFormOptions = (formOptions) => {
  addDisabled(formOptions)
  addComment(formOptions)
  return formOptions
}

const appendFormOptions = (formOptions) => {
  // addComment(formOptions)
  addDisabled(formOptions)
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
      requestFormOptions.value = detailOptions()
    },
    [OPERATE_MAP.inventory]: () => {
      dialogTitle.value = OPERATE_MAP.inventory
      requestFormOptions.value = inventoryFormOptions(createRequestFormOptions())
    },
    [OPERATE_MAP.abandon]: () => {
      dialogTitle.value = OPERATE_MAP.abandon
      requestFormOptions.value = abandonFormOptions(createRequestFormOptions())
    },
    [OPERATE_MAP.append]: () => {
      dialogTitle.value = OPERATE_MAP.append
      requestFormOptions.value = appendFormOptions(createRequestFormOptions())
    }
  }
  formTypeOperate[type]()

  getWMSWarehouseList(WMSWarehouseList)
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      let data = await InventoryApi.getInventory(id)
      getItemPropList(data.binItemList, [{ prop: 'product', keyList: ['name', 'barCode'] }])
      data.binItemList.forEach((item) => {
        item.actualQty = item.expectedQty
      })

      // if (type === OPERATE_MAP.inventory) {
      //   data.productItemList.forEach((item) => {
      //     item.actualQty = item.expectedQty
      //   })
      // }
      // if (type === OPERATE_MAP.append) {
      //   data.binItemList.forEach((item) => {
      //     item.actualQty = item.expectedQty
      //     item.id = undefined
      //   })
      //   getItemPropList(data.binItemList, [{ prop: 'product', keyList: ['name', 'barCode'] }])
      //   data.productItemList = data.binItemList
      // }

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
      const billId = await InventoryApi.createInventory(data)
      await InventoryApi.submitInventoryAudit({ billId, comment: data.comment })
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
        // await InventoryApi.submitInventoryAudit({ billId: data.id, comment: data.comment })
        await InventoryBinApi.updateInventoryBinActualQuantity(data.binItemList)
        await InventoryApi.agreeInventoryAuditStatus({ billId: data.id, comment: data.comment })
      }

      if (type === AUDIT_TYPE.reject) {
        await InventoryApi.submitInventoryAudit({ billId: data.id, comment: data.comment })
        await InventoryApi.rejectInventoryAuditStatus({ billId: data.id, comment: data.comment })
      }

      message.success(t('common.updateSuccess'))
    } else if (formType.value === OPERATE_MAP.append) {
      // await InventoryApi.submitInventoryAudit({ billId: data.id, comment: data.comment })
      const queryData = data.binItemList.map((item) =>
        filterObjKey(item, ['productId', 'inventoryId', 'expectedQty', 'actualQty', 'binId'])
      )
      await InventoryBinApi.appendInventoryBin(queryData)
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
    const items = formData.value.binItemList
    const selectList = selectionList.map((item: any) => {
      const { id, productId, binId, productBarCode, availableQty } = item

      const obj = {
        [itemIdKey]: id,
        binId,
        productId,
        productBarCode,
        expectedQty: availableQty
      }
      return obj
    })
    formData.value.binItemList = distinctList(items, selectList, itemIdKey)
  })
}

const itemsFormdisabled = computed(() => ['detail', OPERATE_MAP.abandon].includes(formType.value))
const buttonExist = computed(
  () => !['detail', OPERATE_MAP.abandon, OPERATE_MAP.append, OPERATE_MAP.inventory].includes(formType.value)
)
</script>
