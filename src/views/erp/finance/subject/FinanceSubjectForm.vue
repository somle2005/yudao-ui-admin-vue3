<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="800px">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="主体名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入主体名称" />
      </el-form-item>
      <el-form-item label="联系人" prop="contact">
        <el-input v-model="formData.contact" placeholder="请输入联系人" />
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="formData.mobile" placeholder="请输入手机号码" />
      </el-form-item>
      <el-form-item label="联系电话" prop="telephone">
        <el-input v-model="formData.telephone" placeholder="请输入联系电话" />
      </el-form-item>
      <el-form-item label="电子邮箱" prop="email">
        <el-input v-model="formData.email" placeholder="请输入电子邮箱" />
      </el-form-item>

      <el-form-item label="传真" prop="fax">
        <el-input v-model="formData.fax" placeholder="请输入传真" />
      </el-form-item>
      <el-form-item label="送达地址" prop="deliveryAddress">
        <el-input v-model="formData.deliveryAddress" placeholder="请输入送达地址" />
      </el-form-item>
      <el-form-item label="公司地址" prop="companyAddress">
        <el-input v-model="formData.companyAddress" placeholder="请输入公司地址" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="开启状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio
            v-for="dict in getBoolDictOptions(DICT_TYPE.COMMON_BOOLEAN_STATUS)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="纳税人识别号" prop="taxNo">
        <el-input v-model="formData.taxNo" placeholder="请输入纳税人识别号" />
      </el-form-item>
      <el-form-item label="开户行" prop="bankName">
        <el-input v-model="formData.bankName" placeholder="请输入开户行" />
      </el-form-item>
      <el-form-item label="开户账号" prop="bankAccount">
        <el-input v-model="formData.bankAccount" placeholder="请输入开户账号" />
      </el-form-item>
      <el-form-item label="开户地址" prop="bankAddress">
        <el-input v-model="formData.bankAddress" placeholder="请输入开户地址" />
      </el-form-item>
    </el-form>

    <SmForm
      class="-mb-15px"
      ref="smFormRef"
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
import { getBoolDictOptions, DICT_TYPE } from '@/utils/dict'
import { FinanceSubjectApi, FinanceSubjectVO } from '@/api/erp/finance/subject'
import { createDBFn } from '@/utils/decorate'

/** Erp财务主体 表单 */
defineOptions({ name: 'FinanceSubjectForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData: any = ref({})

const initFormData = () => {
  return {
    name: undefined,
    contact: undefined,
    mobile: undefined,
    telephone: undefined,
    email: undefined,
    fax: undefined,
    deliveryAddress: undefined,
    companyAddress: undefined,
    remark: undefined,
    status: undefined,
    taxNo: undefined,
    bankName: undefined,
    bankAccount: undefined,
    bankAddress: undefined
  }
}
formData.value = initFormData()

const formRules = reactive({
  name: [{ required: true, message: '主体名称不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '开启状态不能为空', trigger: 'blur' }],
  taxNo: [{ required: true, message: '纳税人识别号不能为空', trigger: 'blur' }]
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
      formData.value = await FinanceSubjectApi.getFinanceSubject(id)
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
    const data = formData.value as unknown as FinanceSubjectVO
    if (formType.value === 'create') {
      await FinanceSubjectApi.createFinanceSubject(data)
      message.success(t('common.createSuccess'))
    } else {
      await FinanceSubjectApi.updateFinanceSubject(data)
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

const requestFormOptions = ref([])

const createFormOptions = () => {
  const list = [
    { prop: 'name', label: '主体名称', required: true },
    { prop: 'status', label: '开启状态', required: true }, //这个要特殊处理一下
    { prop: 'contact', label: '联系人' },
    { prop: 'mobile', label: '手机号码' },
    { prop: 'telephone', label: '联系电话' },
    { prop: 'email', label: '电子邮箱' },
    { prop: 'fax', label: '传真' },
    { prop: 'deliveryAddress', label: '送达地址' },
    { prop: 'companyAddress', label: '公司地址' },

    { prop: 'taxNo', label: '纳税人识别号', required: true },
    { prop: 'bankName', label: '开户行' },
    { prop: 'bankAccount', label: '开户账号' },
    { prop: 'bankAddress', label: '开户地址' },
    { prop: 'remark', label: '备注' }
  ]
  const arr: any = []
  list.forEach((item) => {
    const { prop, label, required } = item
    if (item.prop !== 'status') {
      const obj: any = {
        type: 'input',
        label,
        prop,
        placeholder: `请输入${label}`,
        attrs: {
          style: { width: '100%' },
          clearable: true
        }
      }
      if (required) {
        obj.rules = [
          {
            required: true,
            message: `请输入${label}`,
            trigger: 'blur'
          }
        ]
      }

      arr.push(obj)
    } else if(item.prop === 'status') {
      const obj = {
        type: 'select',
        placeholder: `请选择${label}`,
        prop,
        label,
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
        children: getBoolDictOptions(DICT_TYPE.COMMON_BOOLEAN_STATUS)
      }

      arr.push(obj)
    }
  })
  console.log(arr,'arr')
  return arr
}
// requestFormOptions.value = createFormOptions()

// const requestFormOptions = ref([
//     {
//       type: 'date-picker',
//       placeholder: '请选择单据日期',
//       prop: 'requestTime',
//       label: '单据日期',
//       attrs: {
//         clearable: true,
//         type: 'date',
//         'value-format': 'YYYY-MM-DD HH:mm:ss',
//         class: '!w-1/1',
//         style: {
//           width: '100%'
//         }
//       },
//       rules: [
//         {
//           required: true,
//           message: '单据日期不能为空',
//           trigger: 'change'
//         }
//       ]
//     },
//     {
//       type: 'select',
//       placeholder: '请选择申请人',
//       prop: 'applicantId',
//       label: '申请人',
//       attrs: {
//         filterable: true,
//         clearable: true,
//         style: {
//           width: '100%'
//         }
//       },
//       rules: [
//         {
//           required: true,
//           message: '申请人不能为空',
//           trigger: 'change'
//         }
//       ],
//       children: applicantList
//     },
//     {
//       type: 'tree-select',
//       placeholder: '请选择申请部门',
//       prop: 'applicationDeptId',
//       label: '申请部门',
//       attrs: {
//         filterable: true,
//         clearable: true,
//         data: deptList,
//         props: defaultProps,
//         'check-strictly': true,
//         'node-key': 'id'
//         // style: {
//         //   width: '100%'
//         // }
//       },
//       rules: [
//         {
//           required: true,
//           message: '申请部门不能为空',
//           trigger: 'change'
//         }
//       ]
//     },

//     {
//       type: 'select',
//       placeholder: '请选择供应商产品',
//       prop: 'supplierId',
//       label: '供应商产品',
//       attrs: {
//         filterable: true,
//         clearable: true,
//         style: {
//           width: '100%'
//         }
//       },
//       rules: [
//         {
//           required: true,
//           message: '供应商产品不能为空',
//           trigger: 'change'
//         }
//       ],
//       children: supplierProductList
//     },
//     {
//       type: 'input',
//       label: '收货地址',
//       prop: 'deliveryDelivery',
//       placeholder: '请输入收货地址',
//       attrs: {
//         style: { width: '100%' },
//         clearable: true
//       }
//     },
//     {
//       colConfig: { span: 24 },
//       slot: 'items',
//       formItemConfig: {
//         class: 'purchase-request-items'
//       }
//     }
//   ])

const getFormData = () => {
  return formData
}
</script>
