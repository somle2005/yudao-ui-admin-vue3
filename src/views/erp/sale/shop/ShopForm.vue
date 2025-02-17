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
      <!-- <template #items="{ scope, model }">
        {{ console.log(scope, model, '打印scope-model') }}
        <el-tabs v-model="subTabsName" class="-mt-15px -mb-10px" style="width: 100%">
          <el-tab-pane label="申请产品清单" name="item">
            <ItemsForm ref="itemFormRef" :items="formData.items" :formType="formType" />
            <!~~ <PurchaseRequestItemForm ref="itemFormRef" :items="formData.items" :disabled="disabled" /> ~~>
          </el-tab-pane>
        </el-tabs>
      </template>-->
    </SmForm>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { CustomerApi, CustomerVO } from '@/api/erp/sale/customer'
import { ShopApi, ShopVO } from '@/api/erp/sale/shop'
import { CommonStatusEnum } from '@/utils/constants'

/** ERP 平台店铺 */
defineOptions({ name: 'ShopForm' })

const requestFormOptions = ref([
  {
    type: 'input',
    label: '平台',
    prop: 'platform',
    placeholder: '请输入平台',
    attrs: {
      style: { width: '100%' },
      clearable: true
    },
    rules: [
      {
        required: true,
        message: '平台不能为空',
        trigger: 'blur'
      }
    ]
  },
  {
    type: 'input',
    label: '平台账户',
    prop: 'account',
    placeholder: '请输入平台账户',
    attrs: {
      style: { width: '100%' },
      clearable: true
    },
    rules: [
      {
        required: true,
        message: '平台账户不能为空',
        trigger: 'blur'
      }
    ]
  },

  {
    type: 'input',
    label: '店铺名称',
    prop: 'name',
    placeholder: '请输入店铺名称',
    attrs: {
      style: { width: '100%' },
      clearable: true
    },
    rules: [
      {
        required: true,
        message: '店铺名称不能为空',
        trigger: 'blur'
      }
    ]
  },
  {
    type: 'input',
    label: '店铺代码',
    prop: 'code',
    placeholder: '请输入店铺代码',
    attrs: {
      style: { width: '100%' },
      clearable: true
    },
    rules: [
      {
        required: true,
        message: '店铺代码不能为空',
        trigger: 'blur'
      }
    ]
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
    rules: [
      {
        required: true,
        message: '状态不能为空',
        trigger: 'blur'
      }
    ],
    children: getIntDictOptions(DICT_TYPE.ERP_OFF_STATUS)
  },
  {
    type: 'select',
    placeholder: '请选择类型',
    prop: 'type',
    label: '类型',
    attrs: {
      filterable: true,
      clearable: true,
      style: {
        width: '100%'
      }
    },
    rules: [
      {
        required: true,
        message: '类型不能为空',
        trigger: 'blur'
      }
    ],
    children: getIntDictOptions(DICT_TYPE.ERP_SHOP_TYPE)
  },

  // {
  //   type: 'date-picker',
  //   placeholder: '请选择单据日期',
  //   prop: 'requestTime',
  //   label: '单据日期',
  //   attrs: {
  //     clearable: true,
  //     type: 'date',
  //     'value-format': 'YYYY-MM-DD HH:mm:ss',
  //     class: '!w-1/1',
  //     style: {
  //       width: '100%'
  //     }
  //   },
  //   rules: [
  //     {
  //       required: true,
  //       message: '单据日期不能为空',
  //       trigger: 'change'
  //     }
  //   ]

  //   },

  {
    type: 'input-number',
    label: '排序',
    prop: 'sort',
    placeholder: '请输入排序',
    attrs: {
      style: { width: '100%' },
      clearable: true,
      min: 0
    },
    rules: [
      {
        required: true,
        message: '排序不能为空',
        trigger: 'blur'
      }
    ]
  },

  // 备注放最后
  {
    type: 'input',
    label: '备注',
    prop: 'remark',
    placeholder: '请输入备注',
    attrs: {
      style: { width: '100%' },
      clearable: true
    },
    rules: [
      {
        required: true,
        message: '备注不能为空',
        trigger: 'blur'
      }
    ]
  }
])

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref()

const initFormData = () => {
  return {
    name: undefined,
    code: undefined,
    remark: undefined,
    status: undefined,
    sort: undefined,
    createTime: undefined,
    type: undefined,
    platform: undefined,
    account: undefined
  }
}

formData.value = initFormData()

const formRules = reactive({
  name: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '开启状态不能为空', trigger: 'blur' }],
  sort: [{ required: true, message: '排序不能为空', trigger: 'blur' }]
})
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
      formData.value = await ShopApi.getShop(id)
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
    const data = formData.value as unknown as ShopVO
    if (formType.value === 'create') {
      await ShopApi.createShop(data)
      message.success(t('common.createSuccess'))
    } else {
      await ShopApi.updateShop(data)
      message.success(t('common.updateSuccess'))
    }
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

// 如果不行改成reactive
const getFormData = () => {
  return formData.value
}
</script>
