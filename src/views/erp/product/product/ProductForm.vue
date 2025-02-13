<template>
  <!-- scroll max-height="500px" -->
  <Dialog width="800px" class="productForm-dialog" :title="dialogTitle" v-model="dialogVisible">
    <div class="editBtn" v-if="formDisabled">
      <el-button type="primary" @click="detailEdit">编辑</el-button>
    </div>
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="140px"
      :disabled="formDisabled"
      v-loading="formLoading"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="主图" prop="primaryImageUrl">
            <UploadImg :disabled="formDisabled" v-model="formData.primaryImageUrl" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="次图" prop="secondaryImageUrlList">
            <UploadImgs :disabled="formDisabled" v-model="formData.secondaryImageUrlList" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入产品名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品分类" prop="categoryId">
            <el-tree-select
              v-model="formData.categoryId"
              :data="categoryList"
              :disabled="isEditMode"
              :props="defaultProps"
              check-strictly
              default-expand-all
              placeholder="请选择分类"
              class="!w-240px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门" prop="deptId">
            <el-tree-select
              v-model="formData.deptId"
              :data="deptList"
              :props="defaultProps"
              check-strictly
              node-key="id"
              placeholder="请选择部门"
              class="!w-240px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="SKU（编码）" prop="barCode">
            <el-input v-model="formData.barCode" placeholder="请输入SKU（编码）" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位" prop="unitId">
            <el-select
              v-model="formData.unitId"
              placeholder="请选择单位"
              clearable
              filterable
              class="!w-240px"
            >
              <el-option
                v-for="item in unitList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="材料" prop="material">
            <el-input v-model="formData.material" placeholder="请输入材料" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品状态" prop="status">
            <el-select v-model="formData.status" clearable placeholder="请选择状态">
              <el-option
                v-for="dict in getBoolDictOptions(DICT_TYPE.COMMON_BOOLEAN_STATUS)"
                :key="String(dict.value)"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生产编号" prop="productionNo">
            <el-input v-model="formData.productionNo" placeholder="请输入生产编号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="基础重量（kg）" prop="weight">
            <el-input-number
              v-model="formData.weight"
              placeholder="请输入基础重量"
              controls-position="right"
              :min="1"
              :step="0.01"
              :precision="2"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="基础宽度（mm）" prop="width">
            <el-input-number
              v-model="formData.width"
              placeholder="请输入基础宽度"
              controls-position="right"
              :min="1"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="基础长度（mm）" prop="length">
            <el-input-number
              v-model="formData.length"
              placeholder="请输入基础长度"
              controls-position="right"
              :min="1"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="基础高度（mm）" prop="height">
            <el-input-number
              v-model="formData.height"
              placeholder="请输入基础高度"
              controls-position="right"
              :min="1"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="包装重量（kg）" prop="packageWeight">
            <el-input-number
              v-model="formData.packageWeight"
              placeholder="请输入包装重量"
              controls-position="right"
              :min="1"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="包装宽度（mm）" prop="packageWidth">
            <el-input-number
              v-model="formData.packageWidth"
              placeholder="请输入包装宽度"
              controls-position="right"
              :min="1"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="包装长度（mm）" prop="packageLength">
            <el-input-number
              v-model="formData.packageLength"
              placeholder="请输入包装长度"
              controls-position="right"
              :min="1"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="包装高度（mm）" prop="packageHeight">
            <el-input-number
              v-model="formData.packageHeight"
              placeholder="请输入包装高度"
              controls-position="right"
              :min="1"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="系列" prop="series">
            <el-input v-model="formData.series" placeholder="请输入系列" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="型号" prop="model">
            <el-input v-model="formData.model" placeholder="请输入型号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="颜色" prop="color">
            <el-input v-model="formData.color" placeholder="请输入颜色" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="品牌" prop="brand">
            <el-input v-model="formData.brand" placeholder="请输入品牌" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="产品材质" prop="customCategoryId">
            <el-select v-model="formData.customCategoryId" clearable placeholder="请选择产品材质">
              <el-option
                v-for="dict in customRuleCategoryList"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <ContentWrap>
            <el-tabs v-model="subTabsName" class="-mt-15px -mb-10px">
              <el-tab-pane label="指导价" name="item">
                <ProductGuidePriceItemForm
                  ref="itemFormRef"
                  :guidePriceList="formData.guidePriceList"
                />
              </el-tab-pane>
            </el-tabs>
          </ContentWrap>
        </el-col>
        <el-col :span="12">
          <el-form-item label="专利国别" prop="patentCountryCodeList">
            <el-select
              v-model="formData.patentCountryCodeList"
              placeholder="请选择国别代码"
              multiple
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
        </el-col>
        <el-col :span="12">
          <el-form-item label="专利类型" prop="patentType">
            <el-select
              v-model="formData.patentType"
              placeholder="请选择专利类型"
              clearable
              class="!w-240px"
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.ERP_PATENT_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="PO产品经理" prop="productOwnerId">
            <el-select
              v-model="formData.productOwnerId"
              placeholder="请选择"
              clearable
              filterable
              class="!w-240px"
            >
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.nickname"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="ID工业设计" prop="industrialDesignerId">
            <el-select
              v-model="formData.industrialDesignerId"
              placeholder="请选择"
              clearable
              filterable
              class="!w-240px"
            >
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.nickname"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="RD研发工程师" prop="researchDeveloperId">
            <el-select
              v-model="formData.researchDeveloperId"
              placeholder="请选择"
              clearable
              filterable
              class="!w-240px"
            >
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.nickname"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="维护工程师" prop="maintenanceEngineerId">
            <el-select
              v-model="formData.maintenanceEngineerId"
              placeholder="请选择"
              clearable
              filterable
              class="!w-240px"
            >
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.nickname"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="formData.remark" placeholder="请输入内容" type="textarea" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 额外字段 -->
      <component :is="productDetailForm" ref="productDetailFormRef" :datas="formData" />
    </el-form>
    <template v-if="!formDisabled" #footer>
      <el-button @click="submitFormDB" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { ProductApi, ProductVO } from '@/api/erp/product/product'
import { defaultProps, handleTree } from '@/utils/tree'
import { ProductCategoryApi, ProductCategoryVO } from '@/api/erp/product/category'
import * as DeptApi from '@/api/system/dept'
import * as UserApi from '@/api/system/user'
import { ProductUnitApi, ProductUnitVO } from '@/api/erp/product/unit'
import { DICT_TYPE, getBoolDictOptions, getIntDictOptions } from '@/utils/dict'
import ProductGuidePriceItemForm from '@/views/erp/product/product/components/ProductGuidePriceItemForm.vue'
import { ContentWrap } from '../../../../components/ContentWrap'
import ProductFloorTVStand from '@/views/erp/product/product/ProductFloorTVStand.vue'
import ProductBedsideCabinet from '@/views/erp/product/product/ProductBedsideCabinet.vue'
import ProductMediaStand from '@/views/erp/product/product/ProductMediaStand.vue'
import ProductTVStandWithMount from '@/views/erp/product/product/ProductTVStandWithMount.vue'
import ProductWallMountedTVMount from '@/views/erp/product/product/ProductWallMountedTVMount.vue'
import ProductSpeakerStand from '@/views/erp/product/product/ProductSpeakerStand.vue'
import ProductFloatingShelf from '@/views/erp/product/product/ProductFloatingShelf.vue'
import ProductTableTopTVStand from '@/views/erp/product/product/ProductTableTopTVStand.vue'
import ProductOfficeDesk from '@/views/erp/product/product/ProductOfficeDesk.vue'
import ProductMonitorRiser from '@/views/erp/product/product/ProductMonitorRiser.vue'
import ProductBookcase from '@/views/erp/product/product/ProductBookcase.vue'
import ProductIronFilingCabinet from '@/views/erp/product/product/ProductIronFilingCabinet.vue'
import ProductDesktopStorageRack from '@/views/erp/product/product/ProductDesktopStorageRack.vue'
import ProductKeyboardTray from '@/views/erp/product/product/ProductKeyboardTray.vue'
import { getCustomRuleCategoryList } from '@/commonData/index'
import { createDBFn } from '@/utils/decorate'


/** ERP 产品 表单 */
defineOptions({ name: 'ProductForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
/** 子表的表单 */
const subTabsName = ref('item')
const itemFormRef = ref()
const formData = ref()

const initFormData = () => {
  return {
    id: undefined,
    name: undefined,
    categoryId: undefined,
    remark: undefined,
    deptId: undefined,
    barCode: undefined,
    unitId: undefined,
    material: undefined,
    status: undefined,
    weight: undefined,
    series: undefined,
    model: undefined,
    serial: undefined,
    productionNo: undefined,
    width: undefined,
    length: undefined,
    height: undefined,
    primaryImageUrl: undefined,
    secondaryImageUrlList: [],
    guidePriceList: [],
    patentCountryCodeList: [],
    patentType: undefined,
    productOwnerId: undefined,
    industrialDesignerId: undefined,
    researchDeveloperId: undefined,
    maintenanceEngineerId: undefined,
    color: undefined,
    brand: undefined,
    packageWeight: undefined,
    packageWidth: undefined,
    packageLength: undefined,
    packageHeight: undefined,
    customCategoryId:undefined
  }
}
formData.value = initFormData()

const formDisabled = computed(() => formType.value === 'detail') // 表单是否禁用

const formRules = reactive({
  name: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }],
  categoryId: [{ required: true, message: '产品分类不能为空', trigger: 'blur' }],
  deptId: [{ required: true, message: '部门不能为空', trigger: 'blur' }],
  unitId: [{ required: true, message: '单位不能为空', trigger: 'blur' }],
  material: [{ required: true, message: '材料（中文）不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '产品状态不能为空', trigger: 'blur' }],
  weight: [{ required: true, message: '基础重量（kg）不能为空', trigger: 'blur' }],
  serial: [{ required: true, message: '流水号不能为空', trigger: 'blur' }],
  width: [{ required: true, message: '基础宽度（mm）不能为空', trigger: 'blur' }],
  length: [{ required: true, message: '基础长度（mm）不能为空', trigger: 'blur' }],
  height: [{ required: true, message: '基础高度（mm）不能为空', trigger: 'blur' }],
  barCode: [{ required: true, message: 'SKU(编码)不能为空', trigger: 'blur' }],
  color: [{ required: true, message: '颜色不能为空', trigger: 'blur' }],
  primaryImageUrl: [{ required: true, message: '封面图不能为空', trigger: 'blur' }],

  packageWeight: [{ required: true, message: '包装重量（kg）不能为空', trigger: 'blur' }],
  packageWidth: [{ required: true, message: '包装宽度（mm）不能为空', trigger: 'blur' }],
  packageLength: [{ required: true, message: '包装长度（mm不能为空', trigger: 'blur' }],
  packageHeight: [{ required: true, message: '包装高度（mm）不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
const categoryList = ref<ProductCategoryVO[]>([]) // 产品分类列表
const deptList = ref<Tree[]>([]) // 树形结构
const unitList = ref<ProductUnitVO[]>([]) // 产品单位列表
const userList = ref<any[]>([]) // 用户列表
const isEditMode = ref(false) // 控制是否为编辑模式
const customRuleCategoryList = ref<any[]>([]) // 产品材质

// 找到categoryId对应的子组件
const formDict: Record<string, any> = {
  1: ProductFloorTVStand, // 1L对应落地电视支架的服务实现类
  2: ProductBedsideCabinet, // 2L对应床头柜的服务实现类
  3: ProductMediaStand, // 3L对应多媒体支架的服务实现类
  5: ProductTVStandWithMount, // 5L对应电视柜支架的服务实现类
  6: ProductWallMountedTVMount, // 6L对应挂墙电视支架的服务实现类
  7: ProductSpeakerStand, // 7L对应音响支架的服务实现类
  9: ProductFloatingShelf, // 9L对应多媒体挂墙支架的服务实现类
  10: ProductTableTopTVStand, // 10L对应桌面电视架的服务实现类
  11: ProductOfficeDesk, // 11L对应办公桌的服务实现类
  13: ProductMonitorRiser, // 13L对应显示器增高架的服务实现类
  14: ProductBookcase, // 14L对应书架的服务实现类
  15: ProductKeyboardTray, // 15L对应键盘托的服务实现类
  16: ProductIronFilingCabinet, // 16L对应铁质文件柜的服务实现类
  17: ProductDesktopStorageRack // 17L对应桌面置物架的服务实现类
}
const productDetailForm = computed(() =>
  formData.value.categoryId !== undefined ? formDict[formData.value.categoryId] : null
)
const productDetailFormRef = ref()

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
      formData.value = await ProductApi.getProduct(id)
      // 检查 secondaryImageUrlList 并赋值为默认值 []
      if (formData.value.secondaryImageUrlList == null) {
        formData.value.secondaryImageUrlList = []
      }
      // 检查 guidePriceList 并赋值为默认值 []
      if (formData.value.guidePriceList == null) {
        formData.value.guidePriceList = []
      }
      // 检查 patentCountryCodeList 并赋值为默认值 []
      if (formData.value.patentCountryCodeList == null) {
        formData.value.patentCountryCodeList = []
      }
      isEditMode.value = true
    } finally {
      formLoading.value = false
    }
  } else {
    isEditMode.value = false // 设置为新增模式
  }
  // 加载产品材质
  getCustomRuleCategoryList(customRuleCategoryList)
  // 产品分类
  const categoryData = await ProductCategoryApi.getProductCategorySimpleList()
  categoryList.value = handleTree(categoryData, 'id', 'parentId')
  // 加载部门树
  deptList.value = handleTree(await DeptApi.getSimpleDeptList())
  // 产品单位
  unitList.value = await ProductUnitApi.getProductUnitSimpleList()
  // 加载用户列表
  userList.value = await UserApi.getSimpleUserList()
}

defineExpose({
  open
}) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调

const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  await itemFormRef.value.validate()
  // 检查 productDetailFormRef 是否存在
  if (productDetailFormRef.value && typeof productDetailFormRef.value.validateForm === 'function') {
    await productDetailFormRef.value.validateForm()
  }
  // 提交请求
  formLoading.value = true
  try {
    let data = formData.value as unknown as ProductVO
    if (productDetailFormRef.value && productDetailFormRef.value.formData) {
      data = { ...formData.value, ...productDetailFormRef.value.formData } as unknown as ProductVO
    }
    if (formType.value === 'create') {
      await ProductApi.createProduct(data)
      message.success(t('common.createSuccess'))
    } else {
      await ProductApi.updateProduct(data)
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
  // formData.value = {
  //   id: undefined,
  //   name: undefined,
  //   categoryId: undefined,
  //   remark: undefined,
  //   deptId: undefined,
  //   barCode: undefined,
  //   unitId: undefined,
  //   material: undefined,
  //   status: undefined,
  //   weight: undefined,
  //   series: undefined,
  //   model: undefined,
  //   serial: undefined,
  //   productionNo: undefined,
  //   width: undefined,
  //   length: undefined,
  //   height: undefined,
  //   primaryImageUrl: undefined,
  //   secondaryImageUrlList: [],
  //   guidePriceList: [],
  //   patentCountryCodeList: [],
  //   patentType: undefined,
  //   productOwnerId: undefined,
  //   industrialDesignerId: undefined,
  //   researchDeveloperId: undefined,
  //   maintenanceEngineerId: undefined,
  //   color: undefined,
  //   brand: undefined,
  //   packageWeight: undefined,
  //   packageWidth: undefined,
  //   packageLength: undefined,
  //   packageHeight: undefined
  // }
  formData.value = initFormData()
  formRef.value?.resetFields()
}
const detailEdit = () => {
  const type = 'update'
  formType.value = type
  dialogTitle.value = t('action.' + type)
}
</script>
<style lang="scss" scoped>
.editBtn {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>
<style>
.productForm-dialog .el-scrollbar__bar.is-horizontal{
  height: 0 !important;
}
</style>