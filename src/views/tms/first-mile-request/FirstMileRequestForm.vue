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
              ref="itemFormRef"
              :items="formData.items"
              :formType="formType"
              :disabled="itemsFormdisabled"
            />
          </el-tab-pane>
        </el-tabs>
      </template>
    </SmForm>

    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { FirstMileRequestApi, FirstMileRequestVO } from '@/api/tms/first-mile-request'
import ItemForm from './components/ItemForm.vue'
import { addProperty } from '@/components/SmForm/src/utils'
import { useOutData } from './components/hooks/outdata'
import { getDeptTree } from '@/commonData'
import { getWMSWarehouseList } from '@/commonData/wms'
import { getIntDictOptions } from '@/utils/dict'

const { addItemRef, openAddItem } = useOutData()

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
    items: []
  }
}
const formData = ref(initFormData())
const formRef = ref() // 表单 Ref
const itemsFormdisabled = computed(() => ['detail'].includes(formType.value))
let { deptList, defaultProps } = { deptList: [], defaultProps: {} }
const WMSWarehouseList = getWMSWarehouseList()

/** 子表的表单 */
const subTabsName = ref('firstMileRequestItem')
const itemFormRef = ref()

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  const deptObj = getDeptTree(deptList)
  defaultProps = deptObj.defaultProps

  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await FirstMileRequestApi.getFirstMileRequest(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

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
        clearable: true,
        disabled: true
      }
    },
    {
      type: 'tree-select',
      label: '库存归属',
      prop: 'deptId',
      placeholder: '请选择库存归属',
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
    {
      type: 'select',
      label: '审核状态',
      prop: 'auditStatus',
      placeholder: '请选择审核状态',
      attrs: {
        style: { width: '100%' },
        filterable: true,
        clearable: true
      },
      children: getIntDictOptions(DICT_TYPE.SRM_AUDIT_STATUS)
    },
    {
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
requestFormOptions.value = createRequestFormOptions()

const getFormData = () => {
  return formData.value
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 校验子表单
  await itemFormRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as FirstMileRequestVO
    if (formType.value === 'create') {
      await FirstMileRequestApi.createFirstMileRequest(data)
      message.success(t('common.createSuccess'))
    } else if (formType.value === 'update') {
      await FirstMileRequestApi.updateFirstMileRequest(data)
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
</script>
