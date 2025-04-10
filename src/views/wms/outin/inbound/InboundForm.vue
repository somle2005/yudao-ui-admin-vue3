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
          @click="openAddItem"
          style="margin-bottom: 10px"
          >选择入库项</el-button
        > -->
        <el-tabs v-model="subTabsName" class="-mt-15px -mb-10px" style="width: 100%">
          <el-tab-pane label="入库产品清单" name="item">
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
      <el-button v-if="!auditType" @click="submitFormDB" type="primary" :disabled="formLoading"
        >确 定</el-button
      >
      <template v-if="auditType">
        <el-button
          v-hasPermi="['wms:inbound:reject']"
          type="danger"
          :disabled="formLoading"
          @click="submitFormDB(AUDIT_TYPE.reject)"
        >
          不同意</el-button
        >

        <el-button
          v-hasPermi="['wms:inbound:agree']"
          type="primary"
          :disabled="formLoading"
          @click="submitFormDB(AUDIT_TYPE.agree)"
        >
          同意</el-button
        >
      </template>
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
import { getDeptTree, getFinanceSubjectList } from '@/commonData'
import { FinanceSubjectVO } from '@/api/erp/finance/subject'
import { AUDIT_TYPE } from '@/utils/constant'
import { getLastListProp } from '@/utils/transformData'

// import { useOutData } from './components/hooks/outdata'

/** 入库单 表单 */
defineOptions({ name: 'InboundForm' })

// const { addItemRef, openAddItem } = useOutData()

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
    sourceBillId: undefined,
    sourceBillNo: undefined,
    sourceBillType: undefined,
    referNo: undefined,
    traceNo: undefined,
    shippingMethod: undefined,
    arrivalPlanTime: undefined,
    arrivalActualTime: undefined,
    creatorComment: undefined,
    initAge: undefined,
    itemList: []
  }
}
const formData = ref(initFormData())
const formRef = ref() // 表单 Ref
const WMSWarehouseList: any = ref([])
const financeSubjectList = ref<FinanceSubjectVO[]>([])
let { defaultProps, deptList } = {
  defaultProps: {},
  deptList: [] as any
}

/** 子表的表单 */
const subTabsName = ref('item')
const itemFormRef = ref()
const itemsFormdisabled = computed(() => ['detail', 'audit'].includes(formType.value))
const auditType = computed(() => formType.value === 'audit')

const requestFormOptions: any = ref([])
const createRequestFormOptions = () => {
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
    // {
    //   requiredFlag: true,
    //   type: 'select',
    //   placeholder: '请选择状态',
    //   prop: 'status',
    //   label: '状态',
    //   attrs: {
    //     filterable: true,
    //     clearable: true,
    //     style: {
    //       width: '100%'
    //     }
    //   },
    //   children: getIntDictOptions(DICT_TYPE.WMS_INBOUND_STATUS)
    // },

    {
      requiredFlag: true,
      type: 'select',
      placeholder: '请选择财务公司',
      prop: 'companyId',
      label: '财务公司',
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
      requiredFlag: true,
      type: 'tree-select',
      placeholder: '请选择申请部门',
      prop: 'deptId',
      label: '申请部门',
      attrs: {
        filterable: true,
        clearable: true,
        data: deptList,
        props: defaultProps,
        'check-strictly': true,
        'node-key': 'id'
      }
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
      requiredFlag: true,
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
      requiredFlag: true,
      type: 'date-picker',
      placeholder: '请选择预计到货时间',
      prop: 'arrivalPlanTime',
      label: '预计到货时间',
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
      label: '特别说明',
      prop: 'creatorComment',
      placeholder: '请输入特别说明',
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

const updateFormOptions = (formOptions) => {
  // const index = formOptions.findIndex((item) => item.prop === 'arrivalPlanTime') + 1
  // const obj: any = {
  //   type: 'date-picker',
  //   placeholder: '请选择预实际到货时间',
  //   prop: 'arrivalActualTime',
  //   label: '预实际到货时间',
  //   attrs: {
  //     clearable: true,
  //     type: 'date',
  //     'value-format': 'x',
  //     class: '!w-1/1',
  //     style: {
  //       width: '100%'
  //     }
  //   }
  // }
  // formOptions.splice(index, 0, obj)
  return formOptions
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

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()

  const deptObj = getDeptTree()
  defaultProps = deptObj.defaultProps
  deptList = deptObj.deptList

  getFinanceSubjectList(financeSubjectList)
  getWMSWarehouseList(WMSWarehouseList)

  const formTypeOperate = {
    create: () => {
      requestFormOptions.value = createRequestFormOptions()
    },
    update: () => {
      requestFormOptions.value = updateFormOptions(createRequestFormOptions())
    },
    audit: () => {
      requestFormOptions.value = auditFormOptions(createRequestFormOptions())
    }
  }
  formTypeOperate[type]()

  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      const data = await InboundApi.getInbound(id)
      data.comment = getLastListProp(data.approvalHistoryList, 'comment')
      formData.value  = data
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
  await itemFormRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as InboundVO
    if (itemFormRef?.value?.formData) {
      data.itemList = cloneDeep(itemFormRef.value.formData)
    }
    if (formType.value === 'create') {
      await InboundApi.createInbound(data)
      message.success(t('common.createSuccess'))
    } else if (formType.value === 'update') {
      await InboundApi.updateInbound(data)
      message.success(t('common.updateSuccess'))
    } else if (formType.value === 'audit') {
      if (type === AUDIT_TYPE.agree) {
        await InboundApi.agreeInboundAuditStatus({ billId: data.id, comment: data.comment })
      } else if (type === AUDIT_TYPE.reject) {
        await InboundApi.rejectInboundAuditStatus({ billId: data.id, comment: data.comment })
      }
      message.success('审核成功')
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
