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

    <!-- 子表的表单 -->
    <el-tabs v-model="subTabsName">
      <el-tab-pane label="调拨单明细" name="transferItem">
        <TransferItemForm :items="formData.items" ref="transferItemFormRef" />
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button @click="submitFormDB" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { TransferApi, TransferVO } from '@/api/tms/transfer'
import TransferItemForm from './components/TransferItemForm.vue'
import { getWMSWarehouseList } from '@/commonData/wms'
import { addDisabled, addProperty } from '@/components/SmForm/src/utils'
import { addComment } from '@/views/wms/utils'
import { createDBFn } from '@/utils/decorate'

/** 调拨单 表单 */
defineOptions({ name: 'TransferForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const initFormData = () => {
  return {
    code: undefined,
    fromWarehouseId: undefined,
    toWarehouseId: undefined,
    remark: undefined,
    traceNo: undefined,
    items: []
  }
}
const formData = ref(initFormData())

const formRef = ref() // 表单 Ref

const WMSWarehouseList = ref([])

/** 子表的表单 */
const subTabsName = ref('transferItem')
const transferItemFormRef = ref()

const requestFormOptions: any = ref([])

const createRequestFormOptions = () => {
  const list = [
    {
      type: 'input',
      label: '调拨单编码',
      prop: 'code',
      placeholder: '调拨单编码自动生成',
      attrs: {
        disabled: true,
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      requiredFlag: true,
      type: 'select',
      label: '发出仓',
      prop: 'fromWarehouseId',
      placeholder: '请选择发出仓',
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
      label: '目的仓',
      prop: 'toWarehouseId',
      placeholder: '请选择目的仓',
      attrs: {
        style: { width: '100%' },
        filterable: true,
        clearable: true
      },
      children: WMSWarehouseList
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

const detailFormOptions = (formOptions) => {
  return addDisabled(formOptions)
}

const auditFormOptions = (formOptions) => {
  return addComment(formOptions)
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

  getWMSWarehouseList(WMSWarehouseList)

  const formTypeOperate = {
    detail: () => {
      requestFormOptions.value = detailFormOptions(createRequestFormOptions())
    },
    create: () => {
      requestFormOptions.value = createRequestFormOptions()
    },
    update: () => {
      requestFormOptions.value = createRequestFormOptions()
    },
    audit: () => {
      requestFormOptions.value = auditFormOptions(createRequestFormOptions())
    }
  }
  const fn = formTypeOperate[type]
  fn && fn()

  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await TransferApi.getTransfer(id)
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
  // 校验子表单
  await transferItemFormRef.value.validate()

  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as TransferVO
    if (formType.value === 'create') {
      await TransferApi.createTransfer(data)
      message.success(t('common.createSuccess'))
    } else if (formType.value === 'update') {
      await TransferApi.updateTransfer(data)
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
</script>
