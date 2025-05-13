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
          type="primary"
          @click="openAddItem"
          style="margin-bottom: 10px"
          v-if="!itemsFormdisabled"
          >选择上架产品</el-button
        > -->
        <el-tabs v-model="subTabsName" class="-mt-15px -mb-10px" style="width: 100%">
          <el-tab-pane label="头程申请表清单" name="firstMileRequestItem">
            <ItemForm
              v-if="formData.toWarehouseId"
              ref="itemFormRef"
              :items="formData.items"
              :warehouse="warehouse"
              :formType="formType"
              :disabled="itemsFormdisabled"
            />
          </el-tab-pane>
        </el-tabs>
      </template>

      <template #mergeItems>
        <el-tabs v-model="mergeTabsName" class="-mt-15px -mb-10px" style="width: 100%">
          <el-tab-pane label="头程单清单" name="firstMileItem">
            <ItemForm
              v-if="formData.toWarehouseId"
              ref="firstMileItemFormRef"
              :items="formData.firstMileItems"
              :warehouse="warehouse"
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
      <el-button @click="dialogVisible = false">取 消</el-button>
      <template v-if="auditType">
        <el-button type="danger" :disabled="formLoading" @click="submitFormDB(AUDIT_TYPE.reject)">
          不同意</el-button
        >
        <el-button type="primary" :disabled="formLoading" @click="submitFormDB(AUDIT_TYPE.agree)">
          同意</el-button
        >
      </template>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { FirstMileRequestApi, FirstMileRequestVO } from '@/api/tms/first-mile-request'
import ItemForm from './components/ItemForm.vue'
import { addDisabled, addProperty } from '@/components/SmForm/src/utils'
import { getDeptTree, getUserList } from '@/commonData'
import { getWMSWarehouseList } from '@/commonData/wms'
import { getIntDictOptions } from '@/utils/dict'
import { createDBFn } from '@/utils/decorate'
import { AUDIT_TYPE } from '@/utils/constant'
import { addComment } from '@/views/wms/utils'
import { FirstMileApi } from '@/api/tms/first-mile'

/** 头程申请单 表单 */
defineOptions({ name: 'FirstMileRequestForm' })

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
    requestUserId: undefined,
    requestDeptId: undefined,
    toWarehouseId: undefined,
    totalWeight: undefined,
    totalVolume: undefined,
    items: [],
    firstMileItems: [] // 合并时存在
  }
}

const auditType = computed(() => formType.value === 'audit')
const formData = ref(initFormData())
const formRef = ref() // 表单 Ref
const itemsFormdisabled = computed(() => ['detail', 'audit'].includes(formType.value))
const deptList = ref([])
const defaultProps = ref({})
const WMSWarehouseList = ref([])
const warehouse = ref({})
const userList = ref([])

/** 子表的表单 */
const subTabsName = ref('firstMileRequestItem')
const itemFormRef = ref()

const mergeTabsName = ref('firstMileItem')
const firstMileItemFormRef = ref()

const requestFormOptions: any = ref([])
const createRequestFormOptions = () => {
  const list = [
    {
      type: 'input',
      label: '单据编号',
      prop: 'code',
      placeholder: '保存时自动生成',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      requiredFlag: true,
      type: 'select',
      placeholder: '请选择申请人',
      prop: 'requesterId',
      label: '申请人',
      attrs: {
        class: '!w-240px',
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: userList
    },

    {
      requiredFlag: true,
      type: 'tree-select',
      label: '申请部门',
      prop: 'requestDeptId',
      placeholder: '请选择申请部门',
      attrs: {
        'node-key': 'id',
        'check-strictly': true,
        props: defaultProps,
        data: deptList,
        style: { width: '100%' },
        filterable: true,
        clearable: true
      }
    },
    // {
    //   type: 'select',
    //   label: '审核状态',
    //   prop: 'auditStatus',
    //   placeholder: '请选择审核状态',
    //   attrs: {
    //     style: { width: '100%' },
    //     filterable: true,
    //     clearable: true
    //   },
    //   children: getIntDictOptions(DICT_TYPE.SRM_AUDIT_STATUS)
    // },
    {
      requiredFlag: true,
      type: 'select',
      label: '目的仓',
      prop: 'toWarehouseId',
      placeholder: '请选择目的仓',
      attrs: {
        style: { width: '100%' },
        filterable: true,
        clearable: true,
        onChange: (val) => {
          warehouse.value = WMSWarehouseList.value.find((item: any) => item.value === val) || {}
          console.log(val, '目的仓')
        }
      },
      children: WMSWarehouseList
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

const createAuditFormOptions = (formOptions) => {
  addDisabled(formOptions)
  addComment(formOptions)
  return formOptions
}

const createDetailFormOptions = (formOptions) => {
  addComment(formOptions)
  return formOptions
}

const mergeOptions = () => {
  const list = [
    {
      type: 'input',
      label: '单据编号',
      prop: 'code',
      placeholder: '请输入单据编号',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    // {
    //   type: 'date-picker',
    //   placeholder: '请选择单据日期',
    //   prop: 'billTime',
    //   label: '单据日期',
    //   attrs: {
    //     clearable: true,
    //     type: 'date',
    //     'value-format': 'x',
    //     class: '!w-1/1',
    //     style: {
    //       width: '100%'
    //     }
    //   }
    // },

    {
      type: 'date-picker',
      placeholder: '请选择结算日期',
      prop: 'settlementDate',
      label: '结算日期',
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
      componentType: 'input',
      label: '应付款余额',
      prop: 'balance',
      placeholder: '请输入应付款余额',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },

    // {
    //   requiredFlag: true,
    //   type: 'select',
    //   placeholder: '请选择申请人',
    //   prop: 'requesterId',
    //   label: '申请人',
    //   attrs: {
    //     class: '!w-240px',
    //     filterable: true,
    //     clearable: true,
    //     style: {
    //       width: '100%'
    //     }
    //   },
    //   children: userList
    // },

    // {
    //   requiredFlag: true,
    //   type: 'tree-select',
    //   label: '申请部门',
    //   prop: 'requestDeptId',
    //   placeholder: '请选择申请部门',
    //   attrs: {
    //     'node-key': 'id',
    //     'check-strictly': true,
    //     props: defaultProps,
    //     data: deptList,
    //     style: { width: '100%' },
    //     filterable: true,
    //     clearable: true
    //   }
    // },
    // // {
    // //   type: 'select',
    // //   label: '审核状态',
    // //   prop: 'auditStatus',
    // //   placeholder: '请选择审核状态',
    // //   attrs: {
    // //     style: { width: '100%' },
    // //     filterable: true,
    // //     clearable: true
    // //   },
    // //   children: getIntDictOptions(DICT_TYPE.SRM_AUDIT_STATUS)
    // // },
    // {
    //   requiredFlag: true,
    //   type: 'select',
    //   label: '目的仓',
    //   prop: 'toWarehouseId',
    //   placeholder: '请选择目的仓',
    //   attrs: {
    //     style: { width: '100%' },
    //     filterable: true,
    //     clearable: true,
    //     onChange: (val) => {
    //       warehouse.value = WMSWarehouseList.value.find((item: any) => item.value === val) || {}
    //       console.log(val, '目的仓')
    //     }
    //   },
    //   children: WMSWarehouseList
    // },

    {
      colConfig: { span: 24 },
      slot: 'mergeItems',
      formItemConfig: {
        class: 'common-form-items'
      }
    }
  ]
  return list
}

/** 打开弹窗 */
const open = async (type: string, id?: number, data?: any) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()

  const formTypeOperate = {
    detail: () => {
      requestFormOptions.value = createDetailFormOptions(createRequestFormOptions())
    },
    create: () => {
      requestFormOptions.value = createRequestFormOptions()
      FirstMileRequestApi.getFirstMileRequestLatestNo().then((res) => {
        const modelValue = formRef.value.getFormData()
        modelValue.code = res
      })
    },
    update: () => {
      requestFormOptions.value = createRequestFormOptions()
    },
    audit: () => {
      requestFormOptions.value = createAuditFormOptions(createRequestFormOptions())
    },
    merge: () => {
      dialogTitle.value = '合并头程申请单'
      requestFormOptions.value = mergeOptions()
      FirstMileApi.getFirstMileLatestNo().then((res) => {
        const modelValue = formRef.value.getFormData()
        modelValue.code = res
      })
      formData.value.firstMileItems = data
    }
  }
  const fn = formTypeOperate[type]
  fn && fn()

  warehouse.value = {}
  const deptObj = getDeptTree(deptList)
  defaultProps.value = deptObj.defaultProps
  getWMSWarehouseList(WMSWarehouseList)
  getUserList(userList)

  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await FirstMileRequestApi.getFirstMileRequest(id)
      formRef.value.initForm()
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const getFormData = () => {
  return formData.value
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async (type?: string) => {
  // 校验表单
  await formRef.value.validate()
  // 校验子表单
  await itemFormRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as FirstMileRequestVO as any
    if (formType.value === 'create') {
      await FirstMileRequestApi.createFirstMileRequest(data)
      message.success(t('common.createSuccess'))
    } else if (formType.value === 'update') {
      await FirstMileRequestApi.updateFirstMileRequest(data)
      message.success(t('common.updateSuccess'))
    } else if (formType.value === 'audit') {
      await FirstMileRequestApi.auditFirstMileRequestStatus({
        reviewed: true,
        pass: type === AUDIT_TYPE.agree,
        requestId: data.id,
        reviewComment: data.reviewComment
      })
      message.success(t('common.updateSuccess'))
    } else if (formType.value === 'merge') {
      await FirstMileRequestApi.mergeFirstMileRequest(data)
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
