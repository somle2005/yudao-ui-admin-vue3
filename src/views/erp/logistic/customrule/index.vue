<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="150px"
    >
      <el-form-item label="国家编码" prop="countryCode">
        <el-select
          v-model="queryParams.countryCode"
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
      <el-form-item label="申报品名（英文）" prop="declaredTypeEn">
        <el-input
          v-model="queryParams.declaredTypeEn"
          placeholder="请输入申报品名（英文）"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="申报品名" prop="declaredType">
        <el-input
          v-model="queryParams.declaredType"
          placeholder="请输入申报品名"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="物流属性" prop="logisticAttribute">
        <el-select
          v-model="queryParams.logisticAttribute"
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
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['erp:custom-rule:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['erp:custom-rule:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="国家编码" align="center" prop="countryCode" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.COUNTRY_CODE" :value="scope.row.countryCode" />
        </template>
      </el-table-column>
      <el-table-column label="供应商产品编码" align="center" prop="supplierProductCode" />
      <el-table-column label="类型" align="center" prop="type" />
      <el-table-column label="申报品名（英文）" align="center" prop="declaredTypeEn" />
      <el-table-column label="申报品名" align="center" prop="declaredType" />
      <el-table-column label="申报金额" align="center" prop="declaredValue" />
      <el-table-column label="申报金额币种" align="center" prop="declaredValueCurrencyCode" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CURRENCY_CODE" :value="scope.row.declaredValueCurrencyCode" />
        </template>
      </el-table-column>
      <el-table-column label="税率" align="center" prop="taxRate" />
      <el-table-column label="hs编码" align="center" prop="hscode" />
      <el-table-column label="物流属性" align="center" prop="logisticAttribute" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.ERP_LOGISTIC_ATTRIBUTE" :value="scope.row.logisticAttribute" />
        </template>
      </el-table-column>
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
            v-hasPermi="['erp:custom-rule:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['erp:custom-rule:delete']"
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
  <CustomRuleForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { CustomRuleApi, CustomRuleVO } from '@/api/erp/logistic/customrule'
import CustomRuleForm from './CustomRuleForm.vue'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import {DictTag} from "@/components/DictTag";
import {typeFind} from "@/views/erp/logistic/constant";

/** ERP 海关规则 列表 */
defineOptions({ name: 'ErpCustomRule' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<CustomRuleVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  countryCode: undefined,
  type: undefined,
  supplierProductId: undefined,
  declaredTypeEn: undefined,
  declaredType: undefined,
  declaredValue: undefined,
  declaredValueCurrencyCode: undefined,
  taxRate: undefined,
  hscode: undefined,
  logisticAttribute: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CustomRuleApi.getCustomRulePage(queryParams)
    list.value = data.list.map((item: CustomRuleVO) => {
      item.type = typeFind(item.type)
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
    await CustomRuleApi.deleteCustomRule(id)
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
    const data = await CustomRuleApi.exportCustomRule(queryParams)
    download.excel(data, 'ERP 海关规则.xls')
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
