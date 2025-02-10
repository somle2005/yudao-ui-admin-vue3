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
      <el-form-item label="材质" prop="material">
        <el-select
          v-model="queryParams.material"
          placeholder="请选择报关材质"
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
        <el-input
          v-model="queryParams.declaredType"
          placeholder="请输入报关品名"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="英文品名" prop="declaredTypeEn">
        <el-input
          v-model="queryParams.declaredTypeEn"
          placeholder="请输入英文品名"
          clearable
          @keyup.enter="handleQuery"
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
          v-hasPermi="['erp:custom-rule-category:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['erp:custom-rule-category:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table
      v-loading="loading"
      :data="list"
      :stripe="true"
      :show-overflow-tooltip="true"
      highlight-current-row
      @row-click="handleRowClick"
    >
      <!-- 子表的列表 -->
      <!-- <el-table-column type="expand">
        <template #default="scope">
          <el-tabs model-value="customRuleCategoryItem">
            <el-tab-pane label="海关品类子表" name="customRuleCategoryItem">
              <CustomRuleCategoryItemList :category-id="scope.row.id" />
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column> -->
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <!-- <el-table-column label="编号" align="center" prop="id" /> -->
      <el-table-column label="材质" align="center" prop="material">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.ERP_PRODUCT_MATERIAL" :value="scope.row.material" />
        </template>
      </el-table-column>
      <el-table-column label="报关品名" align="center" prop="declaredType" />
      <el-table-column label="英文品名" align="center" prop="declaredTypeEn" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" min-width="180px">
        <template #default="scope">
          <!-- <el-button link type="primary" @click="categoryDialog = true"> 详情 </el-button> -->
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['erp:custom-rule-category:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['erp:custom-rule-category:delete']"
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
  <!-- <Dialog width="1400" title="海关品类子表" v-model="categoryDialog">
    <CustomRuleCategoryItemList :category-id="categoryId" />
  </Dialog> -->

  <el-tabs v-if="categoryId" model-value="customRuleCategoryItem">
    <el-tab-pane label="海关品类子表" name="customRuleCategoryItem">
      <CustomRuleCategoryItemList :category-id="categoryId" />
    </el-tab-pane>
  </el-tabs>
  <!-- 表单弹窗：添加/修改 -->
  <CustomRuleCategoryForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { CustomRuleCategoryApi, CustomRuleCategoryVO } from '@/api/erp/logistic/category'
import CustomRuleCategoryForm from './CustomRuleCategoryForm.vue'
import CustomRuleCategoryItemList from './components/CustomRuleCategoryItemList.vue'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

/** 海关品类 列表 */
defineOptions({ name: 'ErpCustomRuleCategory' })

const categoryId = ref(undefined)
const handleRowClick = (row) => {
  categoryId.value = row.id
}

const categoryDialog = ref(false)

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<CustomRuleCategoryVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  revision: undefined,
  createTime: [],
  material: undefined,
  declaredType: undefined,
  declaredTypeEn: undefined,
  combinedValue: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CustomRuleCategoryApi.getCustomRuleCategoryPage(queryParams)
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
    await CustomRuleCategoryApi.deleteCustomRuleCategory(id)
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
    const data = await CustomRuleCategoryApi.exportCustomRuleCategory(queryParams)
    download.excel(data, '海关品类.xls')
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
