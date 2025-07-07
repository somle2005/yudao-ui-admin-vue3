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
      <el-button @click="submitFormDB" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { WarehouseZoneApi, WarehouseZoneVO } from '@/api/wms/warehouse-zone'
import { getWMSWarehouseList } from '@/commonData/wms'
import { addProperty } from '@/components/SmForm/src/utils'
import { createDBFn } from '@/utils/decorate'
import { getIntDictOptions } from '@/utils/dict'
import { validateCnChart } from '@/utils/validate'

/** 库区 表单 */
defineOptions({ name: 'WarehouseZoneForm' })

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
    name: undefined,
    warehouseId: undefined,
    stockType: undefined,
    partitionType: undefined,
    status: undefined,
    priority: undefined
  }
}
const formData = ref(initFormData())
const formRef = ref() // 表单 Ref
const WMSWarehouseList: any = ref([])

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()

  getWMSWarehouseList(WMSWarehouseList)
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await WarehouseZoneApi.getWarehouseZone(id)
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
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as WarehouseZoneVO
    if (formType.value === 'create') {
      await WarehouseZoneApi.createWarehouseZone(data)
      message.success(t('common.createSuccess'))
    } else {
      await WarehouseZoneApi.updateWarehouseZone(data)
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
      type: 'input',
      label: '库区代码',
      prop: 'code',
      placeholder: '请输入库区代码',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      requiredFlag: true,
      type: 'input',
      label: '库区名称',
      prop: 'name',
      placeholder: '请输入库区名称',
      attrs: {
        style: { width: '100%' },
        clearable: true
      },
      rules: [
        {
          required: true,
          message: `库区名称不能为空`,
          trigger: 'blur'
        },
        validateCnChart('库区名称')
      ]
    },

    {
      requiredFlag: true,
      type: 'select',
      placeholder: '请选择存货类型',
      prop: 'stockType',
      label: '存货类型',
      attrs: {
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: getIntDictOptions(DICT_TYPE.WMS_STOCK_TYPE)
    },
    {
      requiredFlag: true,
      type: 'select',
      placeholder: '请选择分区类型',
      prop: 'partitionType',
      label: '分区类型',
      attrs: {
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: getIntDictOptions(DICT_TYPE.WMS_WAREHOUSE_ZONE_PARTITION_TYPE)
    },

    {
      requiredFlag: true,
      type: 'select',
      placeholder: '请选择状态',
      prop: 'status',
      label: '状态',
      attrs: {
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: getIntDictOptions(DICT_TYPE.WMS_VALID_STATUS)
    },

    {
      type: 'input-number',
      label: '优先级',
      prop: 'priority',
      placeholder: '请输入优先级',
      attrs: {
        style: { width: '100%' },
        clearable: true,
        min: 0
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
</script>
