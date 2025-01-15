<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="150px"
      v-loading="formLoading"
    >
      <el-form-item label="国家编码" prop="countryCode">
        <el-select
          v-model="formData.countryCode"
          placeholder="请选择国家编码"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.COUNTRY_CODE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="类型" prop="type">
        <el-select v-model="formData.type" placeholder="请选择类型">
          <el-option
            v-for="item in type"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="供应商产品" prop="supplierProductId">
        <el-select
          v-model="formData.supplierProductId"
          clearable
          filterable
          placeholder="请选择供应商产品"
          class="!w-240px"
        >
          <el-option
            v-for="item in supplierProductList"
            :key="item.id"
            :label="item.code"
            :value="item.id"
          />
        </el-select>
      </el-form-item> -->

      <el-form-item label="产品" prop="productId">
        <el-select
          v-model="formData.productId"
          clearable
          filterable
          placeholder="请选择产品"
          class="!w-240px"
        >
          <!-- <template #label="{ barCode, name }">
            <div class="product-option">
              <div class="item">{{ barCode }}</div>
              <div class="item">{{ name }}</div>
            </div>
          </template> -->

          <el-option
            v-for="item in productList"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          >
            <template #default>
              <div class="product-option">
                <div class="item">{{ item.barCode }} </div>
                <div class="item-span w-4em" ></div>
                <div class="item">{{ item.name }}</div>
              </div>
            </template>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="hs编码" prop="hscode">
        <el-input v-model="formData.hscode" placeholder="请输入hs编码" />
      </el-form-item>
      <el-form-item label="申报品名(英文)" prop="declaredTypeEn">
        <el-input v-model="formData.declaredTypeEn" placeholder="请输入申报品名（英文）" />
      </el-form-item>
      <el-form-item label="申报品名" prop="declaredType">
        <el-input v-model="formData.declaredType" placeholder="请输入申报品名" />
      </el-form-item>

      <el-form-item label="申报金额" prop="declaredValue">
        <el-input-number
          v-model="formData.declaredValue"
          placeholder="请输入申报金额"
          :min="0"
          :precision="1"
          class="!w-1/1"
        />
      </el-form-item>
      <el-form-item label="申报金额币种" prop="declaredValueCurrencyCode">
        <el-select
          v-model="formData.declaredValueCurrencyCode"
          placeholder="请选择申报金额币种"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.CURRENCY_CODE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="税率" prop="taxRate">
        <el-input-number
          v-model="formData.taxRate"
          placeholder="请输入税率"
          :min="0"
          :precision="1"
          class="!w-1/1"
        />
      </el-form-item>
      <!-- <el-form-item label="hs编码" prop="hscode">
        <el-input v-model="formData.hscode" placeholder="请输入hs编码" />
      </el-form-item> -->
      <el-form-item label="FBA条形码" prop="fbaBarCode">
        <el-input v-model="formData.fbaBarCode" placeholder="请输入FBA条形码" />
      </el-form-item>
      <el-form-item label="物流属性" prop="logisticAttribute">
        <el-select
          v-model="formData.logisticAttribute"
          placeholder="请选择物流属性"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.ERP_LOGISTIC_ATTRIBUTE)"
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
import { CustomRuleApi, CustomRuleVO } from '@/api/erp/logistic/customrule'
import { SupplierProductApi, SupplierProductVO } from '@/api/erp/purchase/product'
import { getProductList } from '@/commonData'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
// import { type } from '../constant/index'
import { ProductCategoryApi } from '@/api/erp/product/category'

const productList: any = getProductList()

/** ERP 海关规则 表单 */
defineOptions({ name: 'CustomRuleForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref()
const initFormData = () => {
  return {
    id: undefined,
    countryCode: undefined,
    // type: undefined,
    // supplierProductId: undefined,
    productId: undefined,
    declaredValue: undefined,
    declaredValueCurrencyCode: undefined,
    taxRate: undefined,
    logisticAttribute: undefined,
    fbaBarCode: undefined,
    hscode: undefined,
    declaredTypeEn: undefined,
    declaredType: undefined
  }
}
formData.value = initFormData()
const formRules = reactive({
  countryCode: [{ required: true, message: '国家编码不能为空', trigger: 'blur' }],
  // type: [{ required: true, message: '类型不能为空', trigger: 'change' }],
  productId: [{ required: true, message: '产品编号不能为空', trigger: 'blur' }],
  //supplierProductId: [{ required: true, message: '供应商产品编号不能为空', trigger: 'blur' }],
  declaredValue: [{ required: true, message: '申报金额不能为空', trigger: 'change' }],
  declaredValueCurrencyCode: [{ required: true, message: '申报币种不能为空', trigger: 'blur' }]
  // declaredTypeEn: [{ required: true, message: '申报品名（英文）不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref
const supplierProductList = ref<SupplierProductVO[]>([]) // 供应商列表

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
      formData.value = await CustomRuleApi.getCustomRule(id)
    } finally {
      formLoading.value = false
    }
  }
  supplierProductList.value = await SupplierProductApi.getSupplierProductSimpleList()
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
    const data = formData.value as unknown as CustomRuleVO
    if (formType.value === 'create') {
      data.id = undefined
      await CustomRuleApi.createCustomRule(data)
      message.success(t('common.createSuccess'))
    } else {
      await CustomRuleApi.updateCustomRule(data)
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
  // formData.value = {
  //   id: undefined,
  //   countryCode: undefined,
  //   // type: undefined,
  //   // supplierProductId: undefined,
  //   productId: undefined,
  //   declaredTypeEn: undefined,
  //   declaredType: undefined,
  //   // declaredValue: undefined,
  //   // declaredValueCurrencyCode: undefined,
  //   taxRate: undefined,
  //   hscode: undefined,
  //   logisticAttribute: undefined,
  //   fbaBarCode: undefined
  // }
  formData.value = initFormData()
  formRef.value?.resetFields()
}

watch(
  () => formData.value.productId,
  (val) => {
    if (val) {
      changeProduct(val)
    }
  }
)

// 编辑-复制调用的时候也进行监听变化
const changeProduct = (val: any) => {
  const product = productList.value.find((item) => item.id === val)
  if (!product) return
  const { categoryId } = product
  ProductCategoryApi.getProductCategory(categoryId)
    .then((res) => {
      formData.value.hscode = formData.value.hsCode ?? res.defaultHsCode
      formData.value.declaredTypeEn = formData.value.declaredTypeEn ?? res.defaultDeclaredTypeEn
      formData.value.declaredType = formData.value.declaredType ?? res.defaultDeclaredType
    })
    .catch((e) => {
      console.log(e, '报错了')
    })
}
</script>
<style lang="scss" scoped>
.product-option {
  display: flex;
  justify-content: space-between;
}
</style>
