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
        <!-- <el-button
          :disabled="itemsFormdisabled"
          type="primary"
          @click="openAddProductItem"
          style="margin-bottom: 10px"
          v-hasPermi="['wms:stock-bin:query']"
        >
          按批次选择产品</el-button
        > -->
        <el-button
          type="primary"
          @click="openAddProductItem(warehouseId)"
          style="margin-bottom: 10px"
          v-hasPermi="['wms:stock-bin:query']"
          :disabled="!warehouseId"
          v-if="!itemsFormdisabled"
          >选择产品</el-button
        >

        <el-tabs v-model="subTabsName" class="-mt-15px -mb-10px" style="width: 100%">
          <el-tab-pane label="出库产品清单" name="item">
            <ItemForm
              ref="itemFormRef"
              :items="formData.itemList"
              :disabled="itemsFormdisabled"
              :formType="formType"
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
          v-hasPermi="['wms:outbound:reject']"
          type="danger"
          :disabled="formLoading"
          @click="submitFormDB(AUDIT_TYPE.reject)"
        >
          不同意</el-button
        >

        <el-button
          v-hasPermi="['wms:outbound:agree']"
          type="primary"
          :disabled="formLoading"
          @click="submitFormDB(AUDIT_TYPE.agree)"
        >
          同意</el-button
        >

        <el-button
          v-hasPermi="['wms:outbound:agree']"
          type="primary"
          :disabled="formLoading"
          @click="submitFormDB(AUDIT_TYPE.agreeOutbound)"
        >
          同意出库</el-button
        >
      </template>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>

  <!-- 按产品有库存可出库的列表 -->
  <ProductEnableList ref="addProductItemRef" @success="addProductItem" />
</template>
<script setup lang="ts">
import { OutboundApi, OutboundVO } from '@/api/wms/outbound'
import { getFinanceSubjectList } from '@/commonData'
import { addDisabled, addProperty } from '@/components/SmForm/src/utils'
import { createDBFn } from '@/utils/decorate'
import { getIntDictOptions } from '@/utils/dict'
import ItemForm from './components/ItemForm.vue'
import { useOutProductdata } from './components/hooks/outProductdata'
import ProductEnableList from './components/ProductEnableList.vue'
import { distinctList } from '@/utils/transformData'
import { getWMSWarehouseList } from '@/commonData/wms'
import { getItemProp } from '@/components/SmTable/src/utils'
import { AUDIT_TYPE } from '@/utils/constant'
import { OPERATE_MAP } from './constant'
import { OutboundItemApi } from '@/api/wms/outbound-item'

const { addProductItemRef, openAddProductItem } = useOutProductdata()

/** 出库单 表单 */
defineOptions({ name: 'OutboundForm' })

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
    type: undefined,
    status: undefined,
    auditStatus: undefined,
    upstreamBillId: undefined,
    upstreamBillCode: undefined,
    upstreamBillType: undefined,
    creatorComment: undefined,
    itemList: [] as any[]
  }
}
const formData = ref(initFormData())
const formRef = ref() // 表单 Ref
const WMSWarehouseList: any = ref([])

const itemsFormdisabled = computed(() =>
  ['detail', OPERATE_MAP.finish, 'audit'].includes(formType.value)
)
const auditType = computed(() => formType.value === 'audit')

/** 子表的表单 */
const subTabsName = ref('item')
const itemFormRef = ref()
const warehouseId = ref()

const requestFormOptions: any = ref([])
const createRequestFormOptions = () => {
  const list = [
    {
      requiredFlag: true,
      type: 'select',
      placeholder: '请选择仓库',
      prop: 'warehouseId',
      label: '仓库',
      attrs: {
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        },
        onChange: (val: any) => {
          warehouseId.value = val
        }
      },
      children: WMSWarehouseList
    },
    {
      requiredFlag: true,
      type: 'select',
      placeholder: '请选择出库类型',
      prop: 'type',
      label: '出库类型',
      attrs: {
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: getIntDictOptions(DICT_TYPE.WMS_OUTBOUND_TYPE)
    },
    {
      type: 'input',
      label: '特别说明',
      prop: 'creatorComment',
      placeholder: '请输入特别说明',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },

    {
      type: 'input',
      label: '上游单据编码',
      prop: 'upstreamCode',
      attrs: {
        disabled: true,
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'date-picker',
      placeholder: '请选择计划出库时间',
      prop: 'outboundPlanTime',
      label: '计划出库时间',
      attrs: {
        clearable: true,
        'value-format': 'x',
        style: {
          width: '100%'
        }
      }
    },
    {
      type: 'select',
      prop: 'outbountStatus',
      label: '出库状态',
      attrs: {
        disabled: true,
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: getIntDictOptions(DICT_TYPE.WMS_OUTBOUND_STATUS)
    },
    {
      type: 'input',
      label: '操作人',
      prop: 'operator',
      attrs: {
        disabled: true,
        style: { width: '100%' },
        clearable: true
      }
    },
    { 
      type: 'date-picker',
      prop: 'operatorTime',
      label: '操作时间',
      attrs: {
        disabled: true,
        clearable: true,
        'value-format': 'x',
        style: {
          width: '100%'
        }
      }
    },
    { 
      type: 'date-picker',
      prop: 'outboundTime',
      label: '计划出库时间',
      attrs: {
        clearable: true,
        'value-format': 'x',
        style: {
          width: '100%'
        }
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
const auditFormOptions = (formOptions) => {
  addDisabled(formOptions)
  const index = formOptions.findIndex((item) => item.slot === 'items')
  const obj: any = {
    type: 'input',
    placeholder: '审核意见',
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
const detailOptions = (formOptions) => {
  addDisabled(formOptions)
  return formOptions
}

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  warehouseId.value = null
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()

  getWMSWarehouseList(WMSWarehouseList)

  const formTypeOperate = {
    create: () => {
      requestFormOptions.value = createRequestFormOptions()
    },
    update: () => {
      requestFormOptions.value = createRequestFormOptions()
    },
    audit: () => {
      requestFormOptions.value = auditFormOptions(createRequestFormOptions())
    },
    detail: () => {
      requestFormOptions.value = detailOptions(createRequestFormOptions())
    },
    [OPERATE_MAP.finish]: () => {
      dialogTitle.value = '完成'
      requestFormOptions.value = auditFormOptions(createRequestFormOptions())
    }
  }
  formTypeOperate[type]()

  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      let data = await OutboundApi.getOutbound(id)
      getItemProp(data.itemList, ['product', 'bin'])
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
const submitForm = async (type?: string) => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as OutboundVO as any
    if (formType.value === 'create') {
      await OutboundApi.createOutbound(data)
      message.success(t('common.createSuccess'))
    } else if (formType.value === 'update') {
      await OutboundApi.updateOutbound(data)
      message.success(t('common.updateSuccess'))
    } else if (formType.value === 'audit') {
      if (type === AUDIT_TYPE.agree) {
        // 同意审核的时候 实际入库量设置成和计划入库量一致
        data.itemList.forEach((item) => {
          item.actualQty = item.planQty
        })
        await OutboundApi.agreeOutboundAuditStatus({ billId: data.id, comment: data.comment })
      } else if (type === AUDIT_TYPE.reject) {
        await OutboundApi.rejectOutboundAuditStatus({ billId: data.id, comment: data.comment })
      } else if (type === AUDIT_TYPE.agreeOutbound) {
        //  ['actualQty', 'id', 'outboundId'])
        await OutboundItemApi.updateOutboundItemActualQty(data)
        await OutboundApi.agreeOutboundAuditStatus({ billId: data.id, comment: data.comment })
      }
      message.success(t('common.updateSuccess'))
    } else if (formType.value === OPERATE_MAP.finish) {
      await OutboundApi.finishOutbound({ billId: data.id, comment: data.comment })
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

const addProductItem = (selectionList: any[]) => {
  nextTick(() => {
    /**
       * 
      新增测试用例
        {
        "type":1,
        "warehouseId":32,
        "companyId":50001,
        "deptId":50012,
        "upstreamBillId":1,
        "upstreamBillCode":"1",
        "upstreamBillType":1,
        "creatorComment":"1",
        "itemList":[
          {
          "productId":"159",
          "planQty":1,
          "binId":1
          }
        ]
        }
      */

    const items = formData.value.itemList
    const itemIdKey = 'id'
    const selectList = selectionList.map((item: any) => {
      // 采购订单分页需带出数据
      const {
        id,
        productId,
        productBarCode,
        binId,
        binName,
        sellableQty, // 批次剩余库存
        warehouseId,
        warehouseName,
        availableQty,
        // defectiveQty,
        outboundPlanQty,
        suggestedOwnership,
        bin,
      } = item

      let deptId = undefined
      let companyId = undefined
      if (suggestedOwnership) {
        deptId = suggestedOwnership.deptId
        companyId = suggestedOwnership.companyId
      }

      const obj = {
        [itemIdKey]: id,
        productId,
        productBarCode,
        binId,
        binName,
        planQty: sellableQty,
        warehouseId,
        warehouseName,
        companyId,
        deptId,
        availableQty,
        // defectiveQty,
        outboundPlanQty,
        stockType: bin?.zone?.stockType
      }
      return obj
    })
    formData.value.itemList = distinctList(items, selectList, itemIdKey)
  })
}
</script>
