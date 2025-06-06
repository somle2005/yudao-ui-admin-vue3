<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="产品编码" prop="productId">
        <!-- <el-input
          v-model="queryParams.productId"
          placeholder="请输入产品id"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        /> -->
        <el-select
          v-model="queryParams.productId"
          clearable
          filterable
          placeholder="请选择产品编码"
          @keyup.enter="handleQuery"
          class="!w-240px"
        >
          <el-option
            v-for="item in productList"
            :key="item.id"
            :label="item.productCode"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="海关分类" prop="customCategoryId">
        <!-- <el-input
          v-model="queryParams.customCategoryId"
          placeholder="请输入海关分类"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        /> -->
        <el-select
          v-model="queryParams.customCategoryId"
          clearable
          filterable
          placeholder="请选择海关分类"
          @keyup.enter="handleQuery"
          class="!w-240px"
        >
          <el-option
            v-for="dict in customRuleCategoryList"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
      <el-form-item label="更新时间" prop="updateTime">
        <el-date-picker
          v-model="queryParams.updateTime"
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
          v-hasPermi="['tms:custom-product:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['tms:custom-product:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" border :stripe="true" :show-overflow-tooltip="true">
      <!-- <el-table-column label="产品id" align="center" prop="productId" /> -->
      <el-table-column label="图片" align="center" prop="primaryImageUrl" width="200px">
        <template #default="scope">
          <el-image :src="scope.row.primaryImageUrl" class="w-64px h-64px" />
        </template>
      </el-table-column>
      <el-table-column label="产品编码" align="center" prop="productCode" width="200px" />
      <el-table-column label="产品名称" align="center" prop="productName" width="200px" />
      <!-- <el-table-column label="海关分类id" align="center" prop="customCategoryId" /> -->
      <el-table-column label="海关分类名称" align="center" prop="combinedValue" width="200px" />
      <!-- <el-table-column label="海关分类名称" align="center" prop="customCategoryId">
        <template #default="scope">
          {{ customRuleCategory[scope.row.customCategoryId] }}
        </template>
      </el-table-column> -->
      <el-table-column label="创建人" align="center" prop="creator" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="更新人" align="center" prop="updater" />
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" min-width="120px">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['tms:custom-product:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['tms:custom-product:delete']"
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
  <CustomProductForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { CustomProductApi, CustomProductVO } from '@/api/tms/custom-product'
import CustomProductForm from './CustomProductForm.vue'
import { getProductList } from '@/commonData'
import { CustomRuleCategoryApi } from '@/api/tms/custom-category'

const productList = getProductList()
const customRuleCategoryList = ref([]) // 海关分类
const customRuleCategory: any = ref({})
CustomRuleCategoryApi.getCustomRuleCategorySimpleList().then((res: any) => {
  customRuleCategoryList.value = res
  res.map((item) => {
    item.label = item.combinedValue
    item.value = item.customCategoryId
    const { combinedValue, customCategoryId } = item
    customRuleCategory.value[customCategoryId] = combinedValue
    return item
  })
})

/** 海关管理中，与海关分类-产品。中间联系表。 列表 */
defineOptions({ name: 'TmsCustomProduct' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<CustomProductVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  productId: undefined,
  customCategoryId: undefined,
  createTime: [],
  updateTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CustomProductApi.getCustomProductPage(queryParams)
    list.value = data.list.map((item) => {
      const product = item.product
      if (product) {
        const { productCode, name, primaryImageUrl } = product
        item.productCode = productCode
        item.productName = name
        item.primaryImageUrl = primaryImageUrl
      }
      // const customCategory = item.customCategory
      // if (customCategory) {
      //   item.combinedValue = customCategory.combinedValue
      // }
      return item
    })
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
    await CustomProductApi.deleteCustomProduct(id)
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
    const data = await CustomProductApi.exportCustomProduct(queryParams)
    download.excel(data, '海关管理中，与海关分类-产品。中间联系表。.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
