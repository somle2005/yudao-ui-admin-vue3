<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="120px"
    >
      <el-form-item label="供应商产品编码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入供应商产品编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="供应商" prop="supplierId">
        <el-select
          v-model="queryParams.supplierId"
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
          v-model="queryParams.productId"
          clearable
          filterable
          placeholder="请选择产品"
          class="!w-240px"
        >
          <el-option
            v-for="item in productList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="包装高度" prop="packageHeight">
        <el-input
          v-model="queryParams.packageHeight"
          placeholder="请输入包装高度"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="包装长度" prop="packageLength">
        <el-input
          v-model="queryParams.packageLength"
          placeholder="请输入包装长度"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="包装重量" prop="packageWeight">
        <el-input
          v-model="queryParams.packageWeight"
          placeholder="请输入包装重量"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="包装宽度" prop="packageWidth">
        <el-input
          v-model="queryParams.packageWidth"
          placeholder="请输入包装宽度"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="采购价格" prop="purchasePrice">
        <el-input
          v-model="queryParams.purchasePrice"
          placeholder="请输入采购价格"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="采购货币代码" prop="purchasePriceCurrencyCode">
        <el-input
          v-model="queryParams.purchasePriceCurrencyCode"
          placeholder="请输入采购货币代码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['erp:supplier-product:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['erp:supplier-product:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="供应商产品编号" align="center" prop="id" />
      <el-table-column label="供应商产品编码" align="center" prop="code" />
      <!-- <el-table-column label="供应商编号" align="center" prop="supplierId" />
      <el-table-column label="产品编号" align="center" prop="productId" /> -->
      <el-table-column label="供应商" align="center" prop="supplierName" />
      <el-table-column label="产品" align="center" prop="productName" />
      <el-table-column label="包装高度" align="center" prop="packageHeight" />
      <el-table-column label="包装长度" align="center" prop="packageLength" />
      <el-table-column label="包装重量" align="center" prop="packageWeight" />
      <el-table-column label="包装宽度" align="center" prop="packageWidth" />
      <el-table-column label="采购价格" align="center" prop="purchasePrice" />
      <el-table-column label="采购货币代码" align="center" prop="purchasePriceCurrencyCode" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" min-width="120px">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['erp:supplier-product:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['erp:supplier-product:delete']"
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
  <SupplierProductForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { SupplierProductApi, SupplierProductVO } from '@/api/erp/purchase/product'
import SupplierProductForm from './SupplierProductForm.vue'
import { ProductApi, ProductVO } from '@/api/erp/product/product';
import { SupplierApi, SupplierVO } from '@/api/erp/purchase/supplier';

/** ERP 供应商产品 列表 */
defineOptions({ name: 'ErpSupplierProduct' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<SupplierProductVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  code: undefined,
  supplierId: undefined,
  productId: undefined,
  packageHeight: undefined,
  packageLength: undefined,
  packageWeight: undefined,
  packageWidth: undefined,
  purchasePrice: undefined,
  purchasePriceCurrencyCode: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const productList = ref<ProductVO[]>([]) // 产品列表
const supplierList = ref<SupplierVO[]>([]) // 供应商列表
// const userList = ref<UserVO[]>([]) // 用户列表

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await SupplierProductApi.getSupplierProductPage(queryParams)
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
    await SupplierProductApi.deleteSupplierProduct(id)
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
    const data = await SupplierProductApi.exportSupplierProduct(queryParams)
    download.excel(data, 'ERP 供应商产品.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}


/** 初始化 **/
onMounted(async () => {
  await getList()
  // 加载产品、仓库列表、供应商
  productList.value = await ProductApi.getProductSimpleList()
  supplierList.value = await SupplierApi.getSupplierSimpleList()
  // userList.value = await UserApi.getSimpleUserList()
})
</script>