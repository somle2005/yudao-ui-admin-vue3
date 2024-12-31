<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="供应商产品编码" prop="code">
        <el-input v-model="formData.code" placeholder="请输入供应商产品编码" />
      </el-form-item>
      <el-form-item label="供应商" prop="supplierId">
        <el-select
          v-model="formData.supplierId"
          clearable
          filterable
          placeholder="请选择供供应商"
          class="!w-240px"
        >
          <el-option
            v-for="item in supplierList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="产品" prop="productId">
        <el-select
          v-model="formData.productId"
          clearable
          filterable
          placeholder="请选择产品"
          class="!w-240px"
        >
          <el-option
            v-for="item in productList"
            :key="item.id"
            :label="`${item.barCode} | ${item.name}`"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="包装长度" prop="packageLength">
        <el-input-number
              v-model="formData.packageLength" 
              placeholder="请输入包装长度（cm）" 
              :min="0"
              class="!w-1/1"
            />
      </el-form-item>
      <el-form-item label="包装宽度" prop="packageWidth">
        <el-input-number
              v-model="formData.packageWidth" 
              placeholder="请输入包装宽度（cm）" 
              :min="0"
              class="!w-1/1"
            />
      </el-form-item>
      <el-form-item label="包装高度" prop="packageHeight">
        <el-input-number
              v-model="formData.packageHeight" 
              placeholder="请输入包装高度（cm）" 
              :min="0"
              class="!w-1/1"
            />
      </el-form-item>
      <el-form-item label="包装重量" prop="packageWeight">
        <el-input-number
              v-model="formData.packageWeight" 
              placeholder="请输入包装重量（kg）" 
              :min="0"
              class="!w-1/1"
            />
      </el-form-item>
      <el-form-item label="采购价格" prop="purchasePrice">
        <el-input-number
              v-model="formData.purchasePrice"
              placeholder="请输入采购价格，单位：元"
              :min="0"
              :precision="2"
              class="!w-1/1"
        />
      </el-form-item>
      <el-form-item label="采购货币代码" prop="purchasePriceCurrencyCode">
        <el-select
          v-model="formData.purchasePriceCurrencyCode"
          placeholder="请选择采购货币代码"
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
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { SupplierProductApi, SupplierProductVO } from '@/api/erp/purchase/product'
import { ProductApi, ProductVO } from '@/api/erp/product/product';
import { SupplierApi, SupplierVO } from '@/api/erp/purchase/supplier';
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";

/** ERP 供应商产品 表单 */
defineOptions({ name: 'SupplierProductForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  code: undefined,
  supplierId: undefined,
  productId: undefined,
  packageHeight: undefined,
  packageLength: undefined,
  packageWeight: undefined,
  packageWidth: undefined,
  purchasePrice: undefined,
  purchasePriceCurrencyCode: undefined
})
const formRules = reactive({
  supplierId: [{ required: true, message: '供应商编号不能为空', trigger: 'blur' }],
  productId: [{ required: true, message: '产品编号不能为空', trigger: 'blur' }],
  packageHeight: [{ required: true, message: '包装高度不能为空', trigger: 'blur' }],
  packageLength: [{ required: true, message: '包装长度不能为空', trigger: 'blur' }],
  packageWeight: [{ required: true, message: '包装重量不能为空', trigger: 'blur' }],
  packageWidth: [{ required: true, message: '包装宽度不能为空', trigger: 'blur' }],
  purchasePriceCurrencyCode: [{ required: true, message: '采购货币代码不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref
const productList = ref<ProductVO[]>([]) // 产品列表
const supplierList = ref<SupplierVO[]>([]) // 供应商列表

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
      formData.value = await SupplierProductApi.getSupplierProduct(id)
    } finally {
      formLoading.value = false
    }
  }
  productList.value = await ProductApi.getProductSimpleList()
  supplierList.value = await SupplierApi.getSupplierSimpleList()
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
    const data = formData.value as unknown as SupplierProductVO
    if (formType.value === 'create') {
      await SupplierProductApi.createSupplierProduct(data)
      message.success(t('common.createSuccess'))
    } else {
      await SupplierProductApi.updateSupplierProduct(data)
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
    supplierId: undefined,
    productId: undefined,
    packageHeight: undefined,
    packageLength: undefined,
    packageWeight: undefined,
    packageWidth: undefined,
    purchasePrice: undefined,
    purchasePriceCurrencyCode: undefined
  }
  formRef.value?.resetFields()
}
</script>
