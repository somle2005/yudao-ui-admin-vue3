<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="材质" prop="material">
        <el-select
          v-model="formData.material"
          placeholder="请选择材质"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.ERP_PRODUCT_MATERIAL)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="报关品名" prop="declaredType">
        <el-input v-model="formData.declaredType" placeholder="请输入报关品名" />
      </el-form-item>
      <el-form-item label="英文品名" prop="declaredTypeEn">
        <el-input v-model="formData.declaredTypeEn" placeholder="请输入英文品名" />
      </el-form-item>
    </el-form>
    <!-- 子表的表单 -->
    <el-tabs v-model="subTabsName">
      <el-tab-pane label="海关品类子表" name="customRuleCategoryItem">
        <CustomRuleCategoryItemForm ref="customRuleCategoryItemFormRef" :category-id="formData.id" />
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { CustomRuleCategoryApi, CustomRuleCategoryVO } from '@/api/erp/logistic/custom-category'
import CustomRuleCategoryItemForm from './components/CustomRuleCategoryItemForm.vue'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'



/** 海关品类 表单 */
defineOptions({ name: 'CustomRuleCategoryForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  material: undefined,
  declaredType: undefined,
  declaredTypeEn: undefined,
})
const formRules = reactive({
  material: [{ required: true, message: '材质不能为空', trigger: 'blur' }],
  declaredType: [{ required: true, message: '报关品名不能为空', trigger: 'blur' }],
  declaredTypeEn: [{ required: true, message: '英文品名不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 子表的表单 */
const subTabsName = ref('customRuleCategoryItem')
const customRuleCategoryItemFormRef = ref()

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
      formData.value = await CustomRuleCategoryApi.getCustomRuleCategory(id)
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
  // 校验子表单
  try {
    await customRuleCategoryItemFormRef.value.validate()
  } catch (e) {
    subTabsName.value = 'customRuleCategoryItem'
    return
  }
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as CustomRuleCategoryVO
    // 拼接子表的数据
    data.customRuleCategoryItems = customRuleCategoryItemFormRef.value.getData()
    if (formType.value === 'create') {
      await CustomRuleCategoryApi.createCustomRuleCategory(data)
      message.success(t('common.createSuccess'))
    } else {
      await CustomRuleCategoryApi.updateCustomRuleCategory(data)
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
    material: undefined,
    declaredType: undefined,
    declaredTypeEn: undefined,
  }
  formRef.value?.resetFields()
}
</script>