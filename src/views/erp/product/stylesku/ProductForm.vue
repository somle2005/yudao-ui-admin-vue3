<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <el-row :gutter="20">
        <!-- Fields for each column -->
        <el-col :span="12">
          <el-form-item label="模型 SKU" prop="modelSku">
            <el-input v-model="formData.modelSku" placeholder="请输入模型 SKU" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="款号" prop="styleCode">
            <el-input v-model="formData.styleCode" placeholder="请输入款号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="款式 SKU" prop="styleSku">
            <el-input v-model="formData.styleSku" placeholder="请输入款式 SKU" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="中文名称" prop="nameZh">
            <el-input v-model="formData.nameZh" placeholder="请输入中文名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="英文名称" prop="nameEn">
            <el-input v-model="formData.nameEn" placeholder="请输入英文名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="图片 URL" prop="imageUrlList">
            <el-input v-model="formData.imageUrlList" placeholder="请输入图片 URL" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="重量 (kg)" prop="weight">
            <el-input-number v-model="formData.weight" placeholder="请输入重量 (kg)" :min="0" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="长度 (m)" prop="length">
            <el-input-number v-model="formData.length" placeholder="请输入长度 (m)" :min="0" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="宽度 (m)" prop="width">
            <el-input-number v-model="formData.width" placeholder="请输入宽度 (m)" :min="0" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="高度 (m)" prop="height">
            <el-input-number v-model="formData.height" placeholder="请输入高度 (m)" :min="0" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="包装重量 (kg)" prop="packageWeight">
            <el-input-number v-model="formData.packageWeight" placeholder="请输入包装重量 (kg)" :min="0" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="包装长度 (m)" prop="packageLength">
            <el-input-number v-model="formData.packageLength" placeholder="请输入包装长度 (m)" :min="0" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="包装宽度 (m)" prop="packageWidth">
            <el-input-number v-model="formData.packageWidth" placeholder="请输入包装宽度 (m)" :min="0" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="包装高度 (m)" prop="packageHeight">
            <el-input-number v-model="formData.packageHeight" placeholder="请输入包装高度 (m)" :min="0" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="材质（中文）" prop="materialZh">
            <el-input v-model="formData.materialZh" placeholder="请输入材质（中文）" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="材质（英文）" prop="materialEn">
            <el-input v-model="formData.materialEn" placeholder="请输入材质（英文）" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="研发部门编号" prop="researchDepartmentId">
            <el-input v-model="formData.researchDepartmentId" placeholder="请输入研发部门编号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="采购价格 (元)" prop="purchasePrice">
            <el-input-number v-model="formData.purchasePrice" placeholder="请输入采购价格 (元)" :min="0" :precision="2" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="采购价格币种" prop="purchasePriceCurrencyCode">
            <el-input v-model="formData.purchasePriceCurrencyCode" placeholder="请输入采购价格币种" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="默认供应商代码" prop="defaultSupplierCode">
            <el-input v-model="formData.defaultSupplierCode" placeholder="请输入默认供应商代码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="销售状态" prop="saleStatus">
            <el-input v-model="formData.saleStatus" placeholder="请输入销售状态" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="销售部门编号" prop="saleDepartmentId">
            <el-input v-model="formData.saleDepartmentId" placeholder="请输入销售部门编号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="条形码" prop="barcode">
            <el-input v-model="formData.barcode" placeholder="请输入条形码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="同步状态" prop="synced">
            <el-input v-model="formData.synced" placeholder="请输入同步状态" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ProductApi } from '@/api/erp/product/product'
import { ref, reactive } from 'vue'

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formData = ref({
  modelSku: '',
  styleCode: '',
  styleSku: '',
  nameZh: '',
  nameEn: '',
  imageUrlList: '',
  weight: 0,
  length: 0,
  width: 0,
  height: 0,
  packageWeight: 0,
  packageLength: 0,
  packageWidth: 0,
  packageHeight: 0,
  materialZh: '',
  materialEn: '',
  researchDepartmentId: '',
  purchasePrice: 0,
  purchasePriceCurrencyCode: '',
  defaultSupplierCode: '',
  saleStatus: '',
  saleDepartmentId: '',
  barcode: '',
  synced: ''
})
const formRules = reactive({
  modelSku: [{ required: true, message: '模型 SKU 不能为空', trigger: 'blur' }],
  styleCode: [{ required: true, message: '款号不能为空', trigger: 'blur' }],
  styleSku: [{ required: true, message: '款式 SKU 不能为空', trigger: 'blur' }],
  nameZh: [{ required: true, message: '中文名称不能为空', trigger: 'blur' }],
  nameEn: [{ required: true, message: '英文名称不能为空', trigger: 'blur' }],
  purchasePrice: [{ required: true, message: '采购价格不能为空', trigger: 'blur' }]
})

const formRef = ref()

/** Function to open the form and load data */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = type === 'create' ? '新增' : '修改'
  formLoading.value = true

  if (id) {
    const data = await ProductApi.getProduct(id)
    formData.value = {
      modelSku: data.modelSku,
      styleCode: data.styleCode,
      styleSku: data.styleSku,
      nameZh: data.nameZh,
      nameEn: data.nameEn,
      imageUrlList: data.imageUrlList,
      weight: data.weight,
      length: data.length,
      width: data.width,
      height: data.height,
      packageWeight: data.packageWeight,
      packageLength: data.packageLength,
      packageWidth: data.packageWidth,
      packageHeight: data.packageHeight,
      materialZh: data.materialZh,
      materialEn: data.materialEn,
      researchDepartmentId: data.researchDepartmentId,
      purchasePrice: data.purchasePrice,
      purchasePriceCurrencyCode: data.purchasePriceCurrencyCode,
      defaultSupplierCode: data.defaultSupplierCode,
      saleStatus: data.saleStatus,
      saleDepartmentId: data.saleDepartmentId,
      barcode: data.barcode,
      synced: data.synced
    }
  } else {
    resetForm()
  }

  formLoading.value = false
}

const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      console.log('submit', formData.value)
      // Call API to submit form data here...
    } else {
      console.log('error submit')
      return false
    }
  })
}

/** Reset form to default values */
const resetForm = () => {
  formData.value = {
    modelSku: '',
    styleCode: '',
    styleSku: '',
    nameZh: '',
    nameEn: '',
    imageUrlList: '',
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    packageWeight: 0,
    packageLength: 0,
    packageWidth: 0,
    packageHeight: 0,
    materialZh: '',
    materialEn: '',
    researchDepartmentId: '',
    purchasePrice: 0,
    purchasePriceCurrencyCode: '',
    defaultSupplierCode: '',
    saleStatus: '',
    saleDepartmentId: '',
    barcode: '',
    synced: ''
  }
  formRef.value?.resetFields()
}

defineExpose({ open })
</script>
