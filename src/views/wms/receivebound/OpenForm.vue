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
        <el-tabs v-model="subTabsName" class="-mt-15px -mb-10px" style="width: 100%">
          <el-tab-pane label="收货产品清单" name="item">
            <ItemForm
              ref="itemFormRef"
              :items="formData.itemList"
              :formType="formType"
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
</template>
<script setup lang="ts">
import { InboundApi, InboundVO } from '@/api/wms/inbound'
import { getWMSWarehouseList } from '@/commonData/wms'
import { addDisabled, addProperty } from '@/components/SmForm/src/utils'
import { createDBFn } from '@/utils/decorate'
import { getIntDictOptions } from '@/utils/dict'
import ItemForm from './components/ItemForm.vue'
import { cloneDeep } from 'lodash-es'
import { getFinanceSubjectList } from '@/commonData'
import { FinanceSubjectVO } from '@/api/fms/company'
import { OPERATE_MAP } from '@/views/wms/common/constants/index'
import { getItemProp } from '@/components/SmTable/src/utils'
import { InboundItemApi } from '@/api/wms/inbound-item'
import { filterObjKey } from '@/utils/transformData'
import { addComment } from '../common/utils'

/** 收货单 表单 */
defineOptions({ name: 'OpenForm' })

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
    type: undefined,
    warehouseId: undefined,
    status: undefined,
    upstreamId: undefined,
    upstreamCode: undefined,
    upstreamType: undefined,
    referNo: undefined,
    traceNo: undefined,
    shippingMethod: undefined,
    arrivalPlanTime: undefined,
    arrivalActualTime: undefined,
    remark: undefined,
    initAge: undefined,
    itemList: []
  }
}
const formData = ref(initFormData())
const formRef = ref() // 表单 Ref
const WMSWarehouseList: any = ref([])
const financeSubjectList = ref<FinanceSubjectVO[]>([])

/** 子表的表单 */
const subTabsName = ref('item')
const itemFormRef = ref()
const itemsFormdisabled = computed(() =>
  [OPERATE_MAP.abandon, OPERATE_MAP['force-finish'], 'detail'].includes(formType.value)
)

const requestFormOptions: any = ref([])

const updateActualQuantityFormOptions = () => {
  const list = [
    {
      requiredFlag: true,
      type: 'select',
      label: '仓库',
      prop: 'warehouseId',
      placeholder: '请选择仓库',
      attrs: {
        style: { width: '100%' },
        filterable: true,
        clearable: true
      },
      children: WMSWarehouseList
    },
    {
      requiredFlag: true,
      type: 'select',
      placeholder: '请选择入库单类型',
      prop: 'type',
      label: '入库单类型',
      attrs: {
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: getIntDictOptions(DICT_TYPE.WMS_INBOUND_TYPE)
    },
    {
      requiredFlag: true,
      type: 'select',
      placeholder: '请选择库存公司',
      prop: 'companyId',
      label: '库存公司',
      attrs: {
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: financeSubjectList
    },
    {
      type: 'input',
      label: '跟踪号',
      prop: 'traceNo',
      placeholder: '请输入跟踪号',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'select',
      placeholder: '请选择运输方式',
      prop: 'shippingMethod',
      label: '运输方式',
      attrs: {
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: getIntDictOptions(DICT_TYPE.WMS_SHIPPING_METHOD)
    },
    {
      type: 'date-picker',
      placeholder: '请选择计划到货时间',
      prop: 'arrivalPlanTime',
      label: '计划到货时间',
      attrs: {
        clearable: true,
        type: 'date',
        'value-format': 'x',
        class: '!w-1/1',
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
  ] as any[]

  list.forEach((item) => {
    if (item.attrs) {
      item.attrs.disabled = true
    } else {
      item.attrs = {
        disabled: true
      }
    }
  })

  addProperty(list)
  return list
}

const abandonFormOptions = (formOptions) => {
  addComment(formOptions)
  return formOptions
}

const forceFinishFormOptions = (formOptions) => {
  addComment(formOptions)
  return formOptions
}

const updateFormOptions = (formOptions) => {
  // 跟踪号-运输方式-计划到货时间-备注
  const updateList = ['traceNo', 'shippingMethod', 'arrivalPlanTime', 'remark']

  formOptions.forEach((item) => {
    if (!updateList.includes(item.prop)) return
    if (item.attrs) {
      item.attrs.disabled = false
    } else {
      item.attrs = {
        disabled: false
      }
    }
  })
  return formOptions
}

const detailFormOptions = (formOptions) => {
  return addDisabled(formOptions)
}

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()

  getFinanceSubjectList(financeSubjectList)
  getWMSWarehouseList(WMSWarehouseList)

  const formTypeOperate = {
    [OPERATE_MAP['update-actual-quantity']]: () => {
      dialogTitle.value = OPERATE_MAP['update-actual-quantity']
      requestFormOptions.value = addComment(updateActualQuantityFormOptions())
    },
    [OPERATE_MAP.abandon]: () => {
      dialogTitle.value = OPERATE_MAP.abandon
      requestFormOptions.value = abandonFormOptions(updateActualQuantityFormOptions())
    },
    [OPERATE_MAP['force-finish']]: () => {
      dialogTitle.value = OPERATE_MAP['force-finish']
      requestFormOptions.value = forceFinishFormOptions(updateActualQuantityFormOptions())
    },
    [OPERATE_MAP['update-actual-quantityAndPickup']]: () => {
      dialogTitle.value = OPERATE_MAP['update-actual-quantityAndPickup']
      requestFormOptions.value = updateActualQuantityFormOptions()
    },
    update: () => {
      requestFormOptions.value = updateFormOptions(updateActualQuantityFormOptions())
    },
    detail: () => {
      requestFormOptions.value = detailFormOptions(updateActualQuantityFormOptions())
    }
  }
  formTypeOperate[type]()

  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      let data = await InboundApi.getInbound(id)
      getItemProp(data.itemList, ['product', 'warehouse'])
      formData.value = data
      // 主动触发表单数据回显
      formRef.value.initForm()
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const receiveDeal = (data) => {
  // 入库数量设置成和计划入库量一致
  // data.itemList.forEach((item) => {
  //   item.actualQty = item.planQty
  // })
  const queryData = data.itemList.map((item) =>
    filterObjKey(item, ['actualQty', 'id', 'inboundId'])
  )
  return queryData
}

const router = useRouter()
/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  await itemFormRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as any
    if (itemFormRef?.value?.formData) {
      data.itemList = cloneDeep(itemFormRef.value.formData)
    }
    if (formType.value === OPERATE_MAP['update-actual-quantity']) {
      const queryData = receiveDeal(data)
      await InboundItemApi.updateInboundItemActualQuantity(queryData)
      await InboundApi.agreeInboundAuditStatus({ billId: data.id, comment: data.comment })
      message.success(t('common.updateSuccess'))
    } else if (formType.value === OPERATE_MAP.abandon) {
      await InboundApi.abandonInbound({ billId: data.id, comment: data.comment })
      message.success(t('common.updateSuccess'))
    } else if (formType.value === OPERATE_MAP['force-finish']) {
      await InboundApi.forceFinishInbound({ billId: data.id, comment: data.comment })
      message.success(t('common.updateSuccess'))
    } else if (formType.value === OPERATE_MAP['update-actual-quantityAndPickup']) {
      const queryData = receiveDeal(data)
      await InboundItemApi.updateInboundItemActualQuantity(queryData)
      await InboundApi.agreeInboundAuditStatus({ billId: data.id, comment: data.comment })
      const toPickup = () => {
        window.getRouteQuery = () => {
          try {
            return {
              routeJump: true
            }
          } finally {
            window.getRouteQuery = null as any
          }
        }
        router.push({
          path: `/wms/pickup`
        })
      }
      setTimeout(() => toPickup(), 500)
    } else if (formType.value === 'update') {
      await InboundApi.updateInbound(data)
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

const getFormData = () => {
  return formData.value
}
</script>
