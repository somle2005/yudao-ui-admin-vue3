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
          <el-tab-pane label="退货产品清单" name="item">
            <ItemForm ref="itemFormRef" :items="formData.itemList" :formType="formType" />
          </el-tab-pane>
        </el-tabs>
      </template>
    </SmForm>

    <template #footer>
      <el-button @click="submitFormDB" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { OutboundApi, OutboundVO } from '@/api/wms/outbound'
import { getWarehouseList } from '@/commonData'
import { addProperty } from '@/components/SmForm/src/utils'
import { createDBFn } from '@/utils/decorate'
import { getIntDictOptions } from '@/utils/dict'
import ItemForm from './components/ItemForm.vue'

/** 出库单 表单 */
defineOptions({ name: 'OutboundForm' })

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
    warehouseId: undefined,
    type: undefined,
    status: undefined,
    auditStatus: undefined,
    sourceBillId: undefined,
    sourceBillNo: undefined,
    sourceBillType: undefined,
    creatorComment: undefined,
    itemList: []
  }
}
const formData = ref(initFormData())
const formRef = ref() // 表单 Ref
const warehouseList: any = ref([])

/** 子表的表单 */
const subTabsName = ref('item')
const itemFormRef = ref()

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  getWarehouseList(warehouseList)
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await OutboundApi.getOutbound(id)
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
    const data = formData.value as unknown as OutboundVO
    if (formType.value === 'create') {
      await OutboundApi.createOutbound(data)
      message.success(t('common.createSuccess'))
    } else {
      await OutboundApi.updateOutbound(data)
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


  sourceBillId-来源单据ID
  sourceBillNo-来源单据号
  sourceBillType-来源单据类型
  不知道什么时候使用



1-入库单
2-仓库-必填-warehouseId-1
3-出库类型-必填 -type-OutboundType
4-状态-1
5-财务审核状态 -auditStatus-出库单审批状态-OutboundAuditStatus 

6-code-产品编码-必填-缺少




7-库位 - 系统带出/选择 - SKU带出 -必填
8-数量-必填-缺少
9-可用库存数量-必填-缺少
10-不良品数量-必填-缺少
11-备注-缺少
12-状态（主页)-系统打出-必填- 找不到字段-难道是 outboundStatus出库状态 
13-库存主体-带出/选择   companyId-库存财务公司ID 这个数据哪里拉出来
14-dept-库存归属-带出/选择  deptId-库存归属部门ID 这个数据哪里拉出来

13-操作人-系统带出
14-操作时间-系统带出


items里面
1-outboundId-入库单ID-哪里来？
2-productId-标准产品ID
3-actualQty-实际出库量
4-sourceItemId-来源详情ID-哪里来？
5-outboundStatus-出库状态
6-planQty-计划出库量


*/

  const list = [
    {
      type: 'select',
      placeholder: '请选择仓库',
      prop: 'warehouseId',
      label: '仓库',
      attrs: {
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: warehouseList
    },
    {
      type: 'select',
      placeholder: '请选择出库类型',
      prop: 'outboundStatus',
      label: '出库类型',
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
      type: 'select',
      placeholder: '请选择财务审核状态',
      prop: 'status',
      label: '财务审核状态',
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
</script>
