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
        <!-- <el-button
          type="primary"
          @click="openAddItem"
          style="margin-bottom: 10px"
          v-if="!itemsFormdisabled"
          >选择上架产品</el-button
        > -->
        <el-tabs v-model="mergeTabsName" class="-mt-15px -mb-10px" style="width: 100%">
          <el-tab-pane label="头程单清单" :name="mergeItemsTabsName.firstMileItem">
            <FirsetMileMergeItemForm
              v-if="formData.toWarehouseId"
              ref="firstMileItemFormRef"
              :items="formData.firstMileItems"
              :warehouse="warehouse"
              :formType="formType"
              :disabled="itemsFormdisabled"
            />
          </el-tab-pane>
          <el-tab-pane label="船期信息" :name="mergeItemsTabsName.vesselTrackingTabsName">
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
          <el-tab-pane label="出运订单费用明细" :name="mergeItemsTabsName.feesTabsName">
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
import { FirstMileApi, FirstMileVO } from '@/api/tms/first-mile'
import FeeForm from './components/FeeForm.vue'
import { useMergeFirstMileOptions } from '../common/utils'
import { getFinanceSubjectList } from '@/commonData'
import { getWMSWarehouseList } from '@/commonData/wms'
import { addDisabled } from '@/components/SmForm/src/utils'
import { createDBFn } from '@/utils/decorate'
import { AUDIT_TYPE } from '@/utils/constant'
import { addComment } from '@/views/wms/utils'
import FirsetMileMergeItemForm from '@/views/tms/common/components/FirsetMileMergeItemForm.vue'
import FeesForm from '@/views/tms/common/components/FeesForm.vue'
import { mergeItemsTabsName } from '@/views/tms/common/constant/index'

/** 头程单 表单 */
defineOptions({ name: 'FirstMileForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const initFormData = () => {
  return {
    code: undefined,
    billTime: undefined,
    carrierId: undefined,
    settlementDate: undefined,
    balance: undefined,
    toWarehouseId: undefined,
    ladingNo: undefined,
    cabinetType: undefined,
    packTime: undefined,
    arrivePlanTime: undefined,
    deliveryEstimateTime: undefined,
    deliveryActualTime: undefined,
    totalVolume: undefined,
    totalWeight: undefined,
    netWeight: undefined,
    totalValue: undefined,
    totalQty: undefined,
    remark: undefined,
    outboundStatus: undefined,
    outboundTime: undefined,
    inboundStatus: undefined,
    inboundTime: undefined,
    firstMileItems: [],
    vesselTracking: {},
    fees: []
  }
}
const formData = ref(initFormData())

const formRef = ref() // 表单 Ref
const itemsFormdisabled = computed(() => ['detail', 'audit'].includes(formType.value))
const auditType = computed(() => formType.value === 'audit')

const WMSWarehouseList = ref([])
const warehouse = ref({})
const financeSubjectList = ref([])

/** 子表的表单 */
const feesFormRef = ref()
const firstMileItemFormRef = ref()
const mergeTabsName = ref('firstMileItem')

const vesselTrackingTabsName = ref('vesselTrackingTabsName')
const vesselTrackingFormRef = ref()

const requestFormOptions: any = ref([])
const { mergeOptions: createRequestFormOptions, vesselTrackingOptions } = useMergeFirstMileOptions(
  warehouse,
  WMSWarehouseList,
  financeSubjectList
)
const vesselTrackingItemsOptions: any = ref(vesselTrackingOptions())

const detailFormOptions = (formOptions) => {
  addDisabled(formOptions)
  return formOptions
}

const auditFormOptions = (formOptions) => {
  addDisabled(formOptions)
  addComment(formOptions)
  return formOptions
}

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
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
      FirstMileApi.getFirstMileLatestNo().then((res) => {
        const modelValue = formRef.value.getFormData()
        modelValue.code = res
      })
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

  warehouse.value = {}
  getFinanceSubjectList(financeSubjectList)
  getWMSWarehouseList(WMSWarehouseList)

  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      let data = await FirstMileApi.getFirstMile(id)
      if (!data.fees) {
        data.fees = []
      }
      if (!data.vesselTracking) {
        data.vesselTracking = {}
      }
      formData.value = data
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

  // 校验子表单
  if (mergeTabsName.value === mergeItemsTabsName.vesselTrackingTabsName) {
    await vesselTrackingFormRef.value.validate()
  } else if (mergeTabsName.value === mergeItemsTabsName.firstMileItem) {
    await firstMileItemFormRef.value.validate()
  } else if (mergeTabsName.value === mergeItemsTabsName.feesTabsName) {
    await feesFormRef.value.validate()
  }

  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as FirstMileVO as any
    // 拼接子表的数据
    // data.firstMileItems = firstMileItemFormRef.value.getData()
    // data.fees = feeFormRef.value.getData()
    if (formType.value === 'create') {
      await FirstMileApi.createFirstMile(data)
      message.success(t('common.createSuccess'))
    } else if (formType.value === 'update') {
      await FirstMileApi.updateFirstMile(data)
      message.success(t('common.updateSuccess'))
    } else if (formType.value === 'audit') {
      await FirstMileApi.auditFirstMileStatus({
        reviewed: true,
        pass: type === AUDIT_TYPE.agree,
        requestId: data.id,
        reviewComment: data.reviewComment
      })
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
