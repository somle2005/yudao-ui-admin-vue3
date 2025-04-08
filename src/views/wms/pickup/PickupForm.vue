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
          :disabled="itemsFormdisabled"
          type="primary"
          @click="openAddItem"
          style="margin-bottom: 10px"
          >选择拣货项</el-button
        >
        <el-tabs v-model="subTabsName" class="-mt-15px -mb-10px" style="width: 100%">
          <el-tab-pane label="拣货产品清单" name="item">
            <ItemForm
              ref="itemFormRef"
              :items="formData.itemList"
              :formType="formType"
              :warehouseId="warehouseId"
              :disabled="itemsFormdisabled"
            />
          </el-tab-pane>
        </el-tabs>
      </template>
    </SmForm>

    <template #footer>
      <el-button @click="submitFormDB" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
  <!-- 可入库的订单列表 -->
  <EnableList ref="addItemRef" @success="addItem" />
</template>
<script setup lang="ts">
import { PickupApi, PickupVO } from '@/api/wms/pickup'
import { getWarehouseBinList, getWMSWarehouseList } from '@/commonData/wms'
import { addProperty } from '@/components/SmForm/src/utils'
import { createDBFn } from '@/utils/decorate'
import { cloneDeep } from 'lodash-es'
import ItemForm from './components/ItemForm.vue'
import EnableList from './components/EnableList.vue'
import { useOutData } from './components/hooks/outdata'
import { distinctList } from '@/utils/transformData'
import { getItemProp } from '@/components/SmTable/src/utils'

const { addItemRef, openAddItem } = useOutData()

/** 拣货单 表单 */
defineOptions({ name: 'PickupForm' })

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
    warehouseId: undefined,
    itemList: [] as any[]
  }
}

const formData = ref(initFormData())
const formRef = ref() // 表单 Ref
// const WMSWarehouseList: any = ref([])

/** 子表的表单 */
const subTabsName = ref('item')
const itemFormRef = ref()
const itemsFormdisabled = computed(() => ['detail'].includes(formType.value))

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()

  // getWMSWarehouseList(WMSWarehouseList)
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      let data = await PickupApi.getPickup(id)
      getItemProp(data.itemList, ['product'])
      formData.value = data
      // 主动触发表单数据回显
      formRef.value.initForm()
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
  await itemFormRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as PickupVO
    if (itemFormRef?.value?.formData) {
      data.itemList = cloneDeep(itemFormRef.value.formData)
    }
    if (formType.value === 'create') {
      await PickupApi.createPickup(data)
      message.success(t('common.createSuccess'))
    } else if (formType.value === 'update') {
      await PickupApi.updatePickup(data)
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

const warehouseId = ref()

const requestFormOptions: any = ref([])
const createRequestFormOptions = () => {
  const list = [
    // {
    //   requiredFlag: true,
    //   type: 'select',
    //   label: '仓库',
    //   prop: 'warehouseId',
    //   placeholder: '请选择仓库',
    //   attrs: {
    //     style: { width: '100%' },
    //     filterable: true,
    //     clearable: true,
    //     onChange: (val: any) => {
    //       warehouseId.value = val
    //     }
    //   },
    //   children: WMSWarehouseList
    // },
    {
      type: 'input',
      label: '单据编号',
      prop: 'no',
      placeholder: '保存时自动生成',
      attrs: {
        style: { width: '100%' },
        clearable: true,
        disabled: true
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
requestFormOptions.value = createRequestFormOptions()

const getFormData = () => {
  return formData.value
}

const addItem = (selectionList: any[]) => {
  nextTick(() => {
    // 测试用例
    // {
    // "inboundItemId":4529,
    // "qty":1,
    // "binId":2
    // },
    const items = formData.value.itemList
    const itemIdKey = 'inboundItemId'
    const selectList = selectionList.map((item: any) => {
      // 采购订单分页需带出数据
      const {
        id,
        productId,
        productBarCode,
        outboundAvailableQty // 批次剩余库存
      } = item

      const obj = {
        [itemIdKey]: id,
        productId,
        productBarCode,
        qty: outboundAvailableQty
      }
      return obj
    })
    formData.value.itemList = distinctList(items, selectList, itemIdKey)
  })
}
</script>
