<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <el-input
          v-model="queryParams.barCode"
          placeholder="请输入编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="分类" prop="categoryId">
        <el-tree-select
          v-model="queryParams.categoryId"
          :data="categoryList"
          :props="defaultProps"
          check-strictly
          default-expand-all
          placeholder="请输入分类"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['erp:product:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['erp:product:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="主图" align="center" prop="primaryImageUrl" width="110px">
        <template #default="scope">
          <el-image :src="scope.row.primaryImageUrl" class="w-64px h-64px" />
        </template>
      </el-table-column>
      <el-table-column label="SKU（编码）" align="center" prop="barCode" />
      <el-table-column label="产品名称" align="center" prop="name" />
      <el-table-column label="产品分类" align="center" prop="categoryName" />
      <el-table-column label="部门" align="center" prop="deptName" />
      <el-table-column label="单位" align="center" prop="unitName" />
      <el-table-column label="材料（中文）" align="center" prop="material" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.COMMON_BOOLEAN_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="基础重量（kg）" align="center" prop="weight" />
      <el-table-column label="品牌" align="center" prop="brand" />
      <el-table-column label="系列" align="center" prop="series" />
      <el-table-column label="颜色" align="center" prop="color" />
      <el-table-column label="型号" align="center" prop="model" />
      <el-table-column label="生产编号" align="center" prop="productionNo" />
      <el-table-column label="基础宽度（mm）" align="center" prop="width" />
      <el-table-column label="基础长度（mm）" align="center" prop="length" />
      <el-table-column label="基础高度（mm）" align="center" prop="height" />
      <el-table-column label="指导价" align="center" prop="guidePriceList">
        <template #default="scope">
          <div v-for="(guidePrice, index) in scope.row.guidePriceList" :key="index">
            <dict-tag :type="DICT_TYPE.COUNTRY_CODE" :value="guidePrice.code" />
            <el-tag class="ml-5px">{{ guidePrice.price }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="产品备注" align="center" prop="remark" />
      <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatter" width="180px"/>
      <el-table-column label="操作" align="center" min-width="120px">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['erp:product:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['erp:product:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <ProductForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { ProductApi, ProductVO } from '@/api/erp/product/product'
import ProductForm from './ProductForm.vue'
import {ProductCategoryApi, ProductCategoryVO} from "@/api/erp/product/category";
import {defaultProps, handleTree} from "@/utils/tree";
import {DICT_TYPE} from "@/utils/dict";
import Pagination from "../../../../components/Pagination/index.vue";
import {DictTag} from "../../../../components/DictTag";
import {ContentWrap} from "../../../../components/ContentWrap";

/** ERP 产品 列表 */
defineOptions({ name: 'ErpProduct' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ProductVO[]>([]) // 列表的数据
const categoryList = ref<ProductCategoryVO[]>([]) // 产品分类列表
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined,
  categoryId: undefined,
  remark: undefined,
  createTime: [],
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
  guidePriceList: [],
  color: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ProductApi.getProductPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ProductApi.deleteProduct(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await ProductApi.exportProduct(queryParams)
    download.excel(data, 'ERP 产品.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(async () => {
  await getList()
  // 产品分类
  const categoryData = await ProductCategoryApi.getProductCategorySimpleList()
  categoryList.value = handleTree(categoryData, 'id', 'parentId')
})
</script>
