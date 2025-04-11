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
          @click="openAddProductItem"
          style="margin-bottom: 10px"
          v-hasPermi="['wms:stock-bin:query']"
        >
          按批次选择产品</el-button
        > -->
        <el-button
          :disabled="itemsFormdisabled"
          type="primary"
          @click="openAddProductItem(warehouseId)"
          style="margin-bottom: 10px"
          v-hasPermi="['wms:stock-bin:query']"
          >选择产品</el-button
        >

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

  <!-- 按产品有库存可出库的列表 -->
  <ProductEnableList ref="addProductItemRef" @success="addProductItem" />
</template>
<script setup lang="ts">
import { OutboundApi, OutboundVO } from '@/api/wms/outbound'
import { getFinanceSubjectList } from '@/commonData'
import { addProperty } from '@/components/SmForm/src/utils'
import { createDBFn } from '@/utils/decorate'
import { getIntDictOptions } from '@/utils/dict'
import ItemForm from './components/ItemForm.vue'
import { useOutProductdata } from './components/hooks/outProductdata'
import ProductEnableList from './components/ProductEnableList.vue'
import { distinctList } from '@/utils/transformData'
import { FinanceSubjectVO } from '@/api/fms/company'
import { getWMSWarehouseList } from '@/commonData/wms'

const { addProductItemRef, openAddProductItem } = useOutProductdata()

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
    itemList: [] as any[]
  }
}
const formData = ref(initFormData())
const formRef = ref() // 表单 Ref
const WMSWarehouseList: any = ref([])
const financeSubjectList = ref<FinanceSubjectVO[]>([])

const itemsFormdisabled = computed(() => ['detail'].includes(formType.value))

/** 子表的表单 */
const subTabsName = ref('item')
const itemFormRef = ref()
const warehouseId = ref()

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()

  getWMSWarehouseList(WMSWarehouseList)
  getFinanceSubjectList(financeSubjectList)

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
  const list = [
    { 
      requiredFlag: true,
      type: 'select',
      placeholder: '请选择仓库',
      prop: 'warehouseId',
      label: '仓库',
      attrs: {
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        },
        onChange: (val: any) => {
          warehouseId.value = val
        }
      },
      children: WMSWarehouseList
    },
    {
      requiredFlag: true,
      type: 'select',
      placeholder: '请选择出库类型',
      prop: 'type',
      label: '出库类型',
      attrs: {
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: getIntDictOptions(DICT_TYPE.WMS_OUTBOUND_TYPE)
    },
    {
      requiredFlag: true,
      type: 'select',
      placeholder: '请选择库存主体',
      prop: 'companyId',
      label: '库存主体',
      attrs: {
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: financeSubjectList
    },
    {
      type: 'input',
      label: '特别说明',
      prop: 'creatorComment',
      placeholder: '请输入特别说明',
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
    // {
    //   type: 'select',
    //   placeholder: '请选择状态',
    //   prop: 'status',
    //   label: '状态',
    //   attrs: {
    //     filterable: true,
    //     clearable: true,
    //     style: {
    //       width: '100%'
    //     }
    //   },
    //   children: getIntDictOptions(DICT_TYPE.WMS_VALID_STATUS)
    // },
    // {
    //   type: 'select',
    //   placeholder: '请选择财务审核状态',
    //   prop: 'status',
    //   label: '财务审核状态',
    //   attrs: {
    //     filterable: true,
    //     clearable: true,
    //     style: {
    //       width: '100%'
    //     }
    //   },
    //   children: getIntDictOptions(DICT_TYPE.WMS_VALID_STATUS)
    // },
  ]

  addProperty(list)
  return list
}
requestFormOptions.value = createRequestFormOptions()

const getFormData = () => {
  return formData.value
}

const addProductItem = (selectionList: any[]) => {
  nextTick(() => {
    /**
       * 
      新增测试用例
        {
        "type":1,
        "warehouseId":32,
        "companyId":50001,
        "deptId":50012,
        "sourceBillId":1,
        "sourceBillNo":"1",
        "sourceBillType":1,
        "creatorComment":"1",
        "itemList":[
          {
          "productId":"159",
          "planQty":1,
          "binId":1
          }
        ]
        }
      */

    const items = formData.value.itemList
    const itemIdKey = 'id'
    const selectList = selectionList.map((item: any) => {
      // 采购订单分页需带出数据
      const {
        id,
        productId,
        productBarCode,
        binId,
        binName,
        sellableQty, // 批次剩余库存
        warehouseId,
        warehouseName
      } = item

      const obj = {
        [itemIdKey]: id,
        productId,
        productBarCode,
        binId,
        binName,
        planQty: sellableQty,
        warehouseId,
        warehouseName
      }
      return obj
    })
    formData.value.itemList = distinctList(items, selectList, itemIdKey)
  })
}
</script>
