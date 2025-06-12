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
      <!-- <template #fileUrl="{ model, scope }">
        <UploadFile
          :disabled="scope?.attrs?.disabled"
          :is-show-tip="false"
          v-model="model.fileUrl"
          :limit="1"
        />
      </template> -->
    </SmForm>

    <template #footer>
      <el-button @click="submitFormDB" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { WarehouseApi, WarehouseVO } from '@/api/wms/warehouse'
import { addProperty } from '@/components/SmForm/src/utils'
import { createDBFn } from '@/utils/decorate'
import { getIntDictOptions } from '@/utils/dict'

/** 仓库 表单 */
defineOptions({ name: 'WarehouseForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const initFormData = () => {
  return {
    id: undefined,
    mode: undefined, // 默认自营仓0-易仓
    code: undefined,
    name: undefined,
    externalStorageId: undefined,
    externalStorageCode: undefined,
    companyName: undefined,
    country: undefined,
    province: undefined,
    city: undefined,
    addressLine1: undefined,
    addressLine2: undefined,
    postcode: undefined,
    contactPerson: undefined,
    contactPhone: undefined,
    isSync: 0
  }
}
const formData = ref(initFormData())
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await WarehouseApi.getWarehouse(id)
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
    const data = formData.value as unknown as WarehouseVO
    if (formType.value === 'create') {
      await WarehouseApi.createWarehouse(data)
      message.success(t('common.createSuccess'))
    } else {
      await WarehouseApi.updateWarehouse(data)
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
  // mode切换会对requestFormOptions.value数据进行修改

  // 必填项处理
  /**
   排序根据语雀文档-排列-和label显示
   * 1、仓库代码 code-1
2、仓库名称 name-1
3、状态 status ValidStatus-1
4、仓库属性 mode -1-注意切换逻辑

5、external_storage-三方海外仓-选择-暂时无
6、三方仓代码 external_storage_code-暂时无
7、公司名称 companyName-1
8、国家编码 country-1
9、省/州 province-1
10、城市 city-1
11、详细地址1 addressLine1-1
12、详细地址2 addressLine2-1
13、 邮编 postcode-1
14、 联系人 contactPerson-1
15、 联系电话 contactPhone-1
16、 是否库存同步 isSync 传0-暂时无

*/

  const list = [
    // {
    //   requiredFlag: true,
    //   componentType: 'sm-radio-group',
    //   label: '仓库属性',
    //   prop: 'mode',
    //   placeholder: '请选择仓库属性',
    //   colConfig: { span: 24 },
    //   attrs: {
    //     data: WAROUSE_LIST,
    //     onChange: (val) => {
    //       // 动态变化了
    //       //   requestFormOptions.value[0].attrs.data = [
    //       //   {
    //       //     label: 0,
    //       //     radioNanme: '自营仓111'
    //       //   },
    //       //   {
    //       //     label: 1,
    //       //     radioNanme: '三方仓111'
    //       //   },
    //       //   {
    //       //     label: 2,
    //       //     radioNanme: '平台仓1111'
    //       //   }
    //       // ]
    //     }
    //   }
    // },

    {
      requiredFlag: true,
      type: 'select',
      label: '仓库属性',
      prop: 'mode',
      placeholder: '请输入仓库属性',
      attrs: {
        style: { width: '100%' },
        filterable: true,
        clearable: true
      },
      children: getIntDictOptions(DICT_TYPE.WMS_WAREHOUSE_MODE)
    },

    {
      requiredFlag: true,
      type: 'input',
      label: '仓库代码',
      prop: 'code',
      placeholder: '请输入仓库代码',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      requiredFlag: true,
      type: 'input',
      label: '仓库名称',
      prop: 'name',
      placeholder: '请输入仓库名称',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    {
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
      type: 'input',
      label: '公司名称',
      prop: 'companyName',
      placeholder: '请输入公司名称',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },

    {
      requiredFlag: true,
      type: 'select',
      label: '国家编码',
      prop: 'country',
      placeholder: '请输入国家编码',
      attrs: {
        style: { width: '100%' },
        filterable: true,
        clearable: true
      },
      children: getIntDictOptions(DICT_TYPE.COUNTRY_CODE).map((item: any) => {
        item.value = item.label
        return item
      })
    },

    {
      requiredFlag: true,
      type: 'input',
      label: '省/州',
      prop: 'province',
      placeholder: '请输入省/州',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      requiredFlag: true,
      type: 'input',
      label: '城市',
      prop: 'city',
      placeholder: '请输入城市',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      requiredFlag: true,
      type: 'input',
      label: '详细地址1',
      prop: 'addressLine1',
      placeholder: '请输入详细地址1',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'input',
      label: '详细地址2',
      prop: 'addressLine2',
      placeholder: '请输入详细地址2',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },

    {
      requiredFlag: true,
      type: 'input',
      label: '邮编',
      prop: 'postcode',
      placeholder: '请输入邮编',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      requiredFlag: true,
      type: 'input',
      label: '联系人',
      prop: 'contactPerson',
      placeholder: '请输入联系人',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'input',
      label: '联系电话',
      prop: 'contactPhone',
      placeholder: '请输入联系电话',
      attrs: {
        style: { width: '100%' },
        clearable: true
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
