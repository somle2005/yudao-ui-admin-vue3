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

      <!-- <template #vesselTrackingItems>
        <el-tabs v-model="vesselTrackingTabsName" class="-mt-15px -mb-10px" style="width: 100%">
          <el-tab-pane label="船期信息" name="vesselTrackingTabsName">
            <SmForm
              class="-mb-15px"
              ref="vesselTrackingFormRef"
              isCol
              label-width="150px"
              v-loading="formLoading"
              :options="vesselTrackingItemsOptions"
              :getModelValue="getVesselTrackingFormData"
            />
          </el-tab-pane>
        </el-tabs>
      </template> -->

      <template #mergeItems>
        <el-tabs v-model="mergeTabsName" class="-mt-15px -mb-10px" style="width: 100%">
          <el-tab-pane :label="mergeItemsTabsName.firstMileItem" :name="mergeItemsTabsName.firstMileItem">
            <FirsetMileMergeItemForm
              v-if="formData.toWarehouseId"
              ref="firstMileItemFormRef"
              :items="formData.firstMileItems"
              :warehouse="warehouse"
              :formType="formType"
              :disabled="itemsFormdisabled"
            />
          </el-tab-pane>
          <el-tab-pane :label="mergeItemsTabsName.vesselTrackingTabsName" :name="mergeItemsTabsName.vesselTrackingTabsName">
            <SmForm
              class="-mb-15px common-form-tabs-items"
              ref="vesselTrackingFormRef"
              isCol
              label-width="150px"
              v-loading="formLoading"
              :options="vesselTrackingItemsOptions"
              :getModelValue="getVesselTrackingFormData"
            />
          </el-tab-pane>
          <el-tab-pane :label="mergeItemsTabsName.feesTabsName" :name="mergeItemsTabsName.feesTabsName">
            <FeesForm
              ref="feesFormRef"
              :items="formData.fees"
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
        <el-button type="primary" :disabled="formLoading" @click="submitFormDB(AUDIT_TYPE.reject)">
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
import { getDeptTree, getFinanceSubjectList, getUserList } from '@/commonData'
import { getWMSWarehouseList } from '@/commonData/wms'
import { getIntDictOptions } from '@/utils/dict'
import { createDBFn } from '@/utils/decorate'
import { AUDIT_TYPE } from '@/utils/constant'
import { addAuditAdvice } from '@/views/wms/utils'
import { FirstMileApi } from '@/api/tms/first-mile'
import { useMergeFirstMileOptions, computeFirstMileList } from '../common/utils'
import FirsetMileMergeItemForm from '@/views/tms/common/components/FirsetMileMergeItemForm.vue'
import { cloneDeep } from 'lodash-es'
import { mergeItemsTabsName } from '@/views/tms/common/constant/index'

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
    firstMileItems: [], // 合并时存在
    vesselTracking: {},
    fees: []
  }
}

const mergeType = computed(() => formType.value === 'merge')
const auditType = computed(() => formType.value === 'audit')
const formData = ref(initFormData())
const formRef = ref() // 表单 Ref
const itemsFormdisabled = computed(() => ['detail', 'audit'].includes(formType.value))
const deptList = ref([])
const defaultProps = ref({})
const userList = ref([])

const WMSWarehouseList = ref([])
const warehouse = ref({})
const financeSubjectList = ref([])

/** 子表的表单 */
const subTabsName = ref('firstMileRequestItem')
const itemFormRef = ref()

const mergeTabsName = ref('firstMileItem')
const firstMileItemFormRef = ref()
const feesFormRef = ref()

const vesselTrackingTabsName = ref('vesselTrackingTabsName')
const vesselTrackingFormRef = ref()

const requestFormOptions: any = ref([])
const createRequestFormOptions = () => {
  const list = [
    {
      requiredFlag: true,
      type: 'input',
      label: '单据编码',
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

const auditFormOptions = (formOptions) => {
  addDisabled(formOptions)
  addAuditAdvice(formOptions)
  return formOptions
}

const detailFormOptions = (formOptions) => {
  addDisabled(formOptions)
  return formOptions
}

const { mergeOptions, vesselTrackingOptions } = useMergeFirstMileOptions(
  warehouse,
  WMSWarehouseList,
  financeSubjectList
)
const vesselTrackingItemsOptions: any = ref([])

/** 打开弹窗 */
const open = async (type: string, id?: number, data?: any) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()

  const formTypeOperate = {
    detail: () => {
      requestFormOptions.value = detailFormOptions(createRequestFormOptions())
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
      requestFormOptions.value = auditFormOptions(createRequestFormOptions())
    },
    merge: () => {
      dialogTitle.value = '合并头程申请单'
      requestFormOptions.value = mergeOptions()
      vesselTrackingItemsOptions.value = vesselTrackingOptions()

      FirstMileApi.getFirstMileLatestNo().then((res) => {
        const modelValue = formRef.value.getFormData()
        modelValue.code = res
      })
      getFinanceSubjectList(financeSubjectList)

      formData.value.firstMileItems = cloneDeep(data).map((item) => {
        item.weight = item.productWeight
        // item.id = undefined
        return item
      })

      formData.value.toWarehouseId = data[0].toWarehouseId
      nextTick(() => {
        formRef.value.initForm()
      })
    }
  }
  const fn = formTypeOperate[type]
  fn && fn()
 
  mergeTabsName.value = mergeItemsTabsName.firstMileItem
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

const getVesselTrackingFormData = () => {
  return formData.value.vesselTracking
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async (type?: string) => {
  // 校验表单
  await formRef.value.validate()

  if (formType.value === 'merge') {
    if (mergeTabsName.value === mergeItemsTabsName.vesselTrackingTabsName) {
      await vesselTrackingFormRef.value.validate()
    } else if (mergeTabsName.value === mergeItemsTabsName.firstMileItem) {
      await firstMileItemFormRef.value.validate()
    } else if (mergeTabsName.value === mergeItemsTabsName.feesTabsName) {
      await feesFormRef.value.validate()
    }
  } else {
    // 校验子表单
    await itemFormRef.value.validate()
  }

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

/** 计算值 */
watch(
  () => formData.value.firstMileItems,
  (val) => {
    if (!val) {
      return
    }
    if (formType.value !== 'merge') {
      return
    }

    // 编辑回显
    computeFirstMileList(val, formData)
    formRef?.value?.initForm()

    // console.log(formData.value, 'formData.value')
  },
  { deep: true }
)
</script>
