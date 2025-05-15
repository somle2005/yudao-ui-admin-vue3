<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="产品编码" prop="productId">
        <el-select
          v-model="formData.productId"
          clearable
          filterable
          placeholder="请选择产品编码"
        >
          <el-option
            v-for="item in productList"
            :key="item.id"
            :label="item.barCode"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="海关分类" prop="customCategoryId">
            <el-select
              v-model="formData.customCategoryId"
              filterable
              clearable
              placeholder="请选择海关分类"
            >
              <el-option
                v-for="dict in customRuleCategoryList"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
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
import { CustomProductApi, CustomProductVO } from '@/api/tms/custom-product'
import { getCustomRuleCategoryList, getProductList } from '@/commonData'

/** 海关管理中，与海关分类-产品。中间联系表。 表单 */
defineOptions({ name: 'CustomProductForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  productId: undefined,
  customCategoryId: undefined,
})
const formRules = reactive({
  productId: [{ required: true, message: '产品id不能为空', trigger: 'blur' }],
  customCategoryId: [{ required: true, message: '海关分类id不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

const productList:any = ref([])
const customRuleCategoryList = ref<any[]>([]) // 海关分类

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  getProductList(productList)
  getCustomRuleCategoryList(customRuleCategoryList)
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await CustomProductApi.getCustomProduct(id)
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
    const data = formData.value as unknown as CustomProductVO
    if (formType.value === 'create') {
      await CustomProductApi.createCustomProduct(data)
      message.success(t('common.createSuccess'))
    } else {
      await CustomProductApi.updateCustomProduct(data)
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
    productId: undefined,
    customCategoryId: undefined,
  }
  formRef.value?.resetFields()
}
</script>