<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="代码" prop="code">
        <el-input v-model="formData.code" placeholder="请输入代码" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="归属的仓库ID" prop="warehouseId">
        <el-input v-model="formData.warehouseId" placeholder="请输入归属的仓库ID" />
      </el-form-item>
      <el-form-item label="存货类型 ; WarehouseAreaStockType : 1-拣货 , 2-存储" prop="stockType">
        <el-select v-model="formData.stockType" placeholder="请选择存货类型 ; WarehouseAreaStockType : 1-拣货 , 2-存储">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="分区类型 ; WarehouseAreaPartitionType : 1-标准品 , 2-不良品" prop="partitionType">
        <el-select v-model="formData.partitionType" placeholder="请选择分区类型 ; WarehouseAreaPartitionType : 1-标准品 , 2-不良品">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态，WMS通用的对象有效状态 ; ValidStatus : 0-不可用 , 1-可用" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio value="1">请选择字典生成</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="优先级" prop="priority">
        <el-input v-model="formData.priority" placeholder="请输入优先级" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { WarehouseZoneApi, WarehouseZoneVO } from '@/api/wms/warehouse/index'

/** 库区 表单 */
defineOptions({ name: 'WarehouseZoneForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  code: undefined,
  name: undefined,
  warehouseId: undefined,
  stockType: undefined,
  partitionType: undefined,
  status: undefined,
  priority: undefined,
})
const formRules = reactive({
  code: [{ required: true, message: '代码不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  warehouseId: [{ required: true, message: '归属的仓库ID不能为空', trigger: 'blur' }],
  stockType: [{ required: true, message: '存货类型 ; WarehouseAreaStockType : 1-拣货 , 2-存储不能为空', trigger: 'change' }],
  partitionType: [{ required: true, message: '分区类型 ; WarehouseAreaPartitionType : 1-标准品 , 2-不良品不能为空', trigger: 'change' }],
  status: [{ required: true, message: '状态，WMS通用的对象有效状态 ; ValidStatus : 0-不可用 , 1-可用不能为空', trigger: 'blur' }],
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
      formData.value = await WarehouseZoneApi.getWarehouseZone(id)
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

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    code: undefined,
    name: undefined,
    warehouseId: undefined,
    stockType: undefined,
    partitionType: undefined,
    status: undefined,
    priority: undefined,
  }
  formRef.value?.resetFields()
}
</script>