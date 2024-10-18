<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="属性名称" prop="attribute">
        <el-input v-model="formData.attribute" placeholder="请输入属性名称" />
      </el-form-item>
      <el-form-item label="键" prop="key">
        <el-input v-model="formData.key" placeholder="请输入属性名对应键" />
      </el-form-item>
      <el-form-item label="显示顺序" prop="sort">
        <el-input v-model="formData.sort" placeholder="请输入显示顺序" />
      </el-form-item>
      <el-form-item label="是否必须" prop="require">
        <el-radio-group v-model="formData.require">
          <el-radio
            v-for="dict in getBoolDictOptions(DICT_TYPE.SYSTEM_WHETHER)"
            :key="dict.value"
            :value="dict.value"
          >
            {{dict.label}}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="数据类型" prop="type">
        <el-select v-model="formData.type" placeholder="请选择数据类型">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_FILED)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { FieldApi, FieldVO } from '@/api/system/field'
import {DICT_TYPE, getBoolDictOptions, getIntDictOptions} from '@/utils/dict'
import {SystemFieldEnum} from "@/utils/constants";

/** 字段属性 表单 */
defineOptions({ name: 'FieldForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  attribute: undefined,
  key: undefined,
  sort: 0,
  require: undefined,
  type: undefined,
  require: SystemFieldEnum.YES
})
const formRules = reactive({
  attribute: [{ required: true, message: '属性名称不能为空', trigger: 'blur' }],
  key: [{ required: true, message: '属性名对应键不能为空', trigger: 'blur' }],
  require: [{ required: true, message: '是否必须不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '数据类型不能为空', trigger: 'change' }],
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
      formData.value = await FieldApi.getField(id)
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
    const data = formData.value as unknown as FieldVO
    if (formType.value === 'create') {
      await FieldApi.createField(data)
      message.success(t('common.createSuccess'))
    } else {
      await FieldApi.updateField(data)
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
    attribute: undefined,
    key: undefined,
    sort: 0,
    require: undefined,
    type: undefined,
    require: SystemFieldEnum.YES
  }
  formRef.value?.resetFields()
}
</script>
