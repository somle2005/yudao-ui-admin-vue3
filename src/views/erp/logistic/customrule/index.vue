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

      <el-form-item label="SKU（编码）" prop="barCode">
        <!-- <el-input
          v-model="queryParams.barCode"
          placeholder="请输入sku（编码）"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        /> -->
        <el-select
          v-model.trim="queryParams.barCode"
          clearable
          filterable
          placeholder="请选择SKU（编码）"
          @keyup.enter="handleQuery"
          @input="insertBarcode"
          class="!w-240px"
        >
          <el-option
            v-for="item in productSkuList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="hs编码" prop="hscode">
        <el-input
          v-model="queryParams.hscode"
          placeholder="请输入hs编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="FBA条形码" prop="fbaBarCode">
        <el-input
          v-model="queryParams.fbaBarCode"
          placeholder="请输入FBA条形码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="创建时间" prop="createTimeStr">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
          @change="createTimeChange"
        />
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
      <!-- <el-form-item label="供应商产品" prop="supplierProductId">
        <el-select
          v-model="queryParams.supplierProductId"
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
      <!-- <el-form-item label="类型" prop="type">
        <el-select class="!w-240px" v-model="queryParams.type" placeholder="请选择类型">
          <el-option
            v-for="item in type"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item class="ml-70px">
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
  <!--  <ContentWrap>
    <el-table border v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">

      <el-table-column label="SKU（编码）" align="center" prop="product-barCode" />
      <el-table-column label="国家编码" align="center" prop="countryCode">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.COUNTRY_CODE" :value="scope.row.countryCode" />
        </template>
      </el-table-column>
      <el-table-column label="产品名称" align="center" prop="product-name" />
      
      
      <el-table-column
        label="图片"
        align="center"
        prop="primaryImageUrl"
        width="110px"
      >
        <template #default="scope">
          <el-image :src="scope.row.primaryImageUrl" class="w-64px h-64px" />
        </template>
      </el-table-column>
      <el-table-column label="材料" align="center" prop="material" />

      <!~~ <el-table-column
        label="供应商产品编码"
        align="center"
        prop="supplierProductCode"
        :min-width="columnMinWidth"
      /> ~~>

    
      <!~~ <el-table-column label="类型" align="center" prop="type" /> ~~>

      <!~~ <el-table-column label="申报金额" align="center" prop="declaredValue" />
      <el-table-column label="申报金额币种" align="center" prop="declaredValueCurrencyCode">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CURRENCY_CODE" :value="scope.row.declaredValueCurrencyCode" />
        </template>
      </el-table-column> ~~>

      <el-table-column label="hs编码" align="center" prop="hscode" />
      <el-table-column label="申报品名(英文)" align="center" prop="declaredTypeEn" />
      <el-table-column label="申报品名" align="center" prop="declaredType" />

      <el-table-column label="税率" align="center" prop="taxRate" />
      <el-table-column label="物流属性" align="center" prop="logisticAttribute">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.ERP_LOGISTIC_ATTRIBUTE" :value="scope.row.logisticAttribute" />
        </template>
      </el-table-column>
      <el-table-column label="FBA条形码" align="center" prop="fbaBarCode" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
    
      <el-table-column label="操作" align="center" min-width="180px">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="copyForm(scope.row.id)"
            v-hasPermi="['erp:custom-rule:create']"
          >
            复制
          </el-button>
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
    <!~~ 分页 ~~>
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>-->

  <!-- isSelection -->
  <ContentWrap :bodyStyle="{ padding: '20px','padding-bottom':0 }">
    <SmTable
      border
      :loading="loading"
      :options="tableOptions"
      :data="list"
      :total="total"
      v-model:currentPage="queryParams.pageNo"
      v-model:pageSize="queryParams.pageSize"
      @pagination="getList"
    >
      <template #countryCode="{ scope }">
        <dict-tag :type="DICT_TYPE.COUNTRY_CODE" :value="scope.row.countryCode || ''" />
      </template>

      <template #primaryImageUrl="{ scope }">
        <el-image :src="scope.row.primaryImageUrl" class="w-64px h-64px" />
      </template>

      <template #logisticAttribute="{ scope }">
        <dict-tag
          :type="DICT_TYPE.ERP_LOGISTIC_ATTRIBUTE"
          :value="scope.row.logisticAttribute || ''"
        />
      </template>
      <template #operate="{ scope }">
        <el-button
          link
          type="primary"
          @click="copyForm(scope.row.id)"
          v-hasPermi="['erp:custom-rule:create']"
        >
          复制
        </el-button>
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
    </SmTable>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <CustomRuleForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { CustomRuleApi, CustomRuleVO } from '@/api/erp/logistic/customrule'
import CustomRuleForm from './CustomRuleForm.vue'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { DictTag } from '@/components/DictTag'
// import { type, typeFind } from '@/views/erp/logistic/constant'
import { SupplierProductApi, SupplierProductVO } from '@/api/erp/purchase/product'
import { useTableData } from '@/components/SmTable/src/utils'
import { getProductNameList } from '@/commonData'
import { insertSearchVal } from '@/utils/high'

const { productSkuList } = getProductNameList()

const { tableOptions, transformTableOptions } = useTableData()

const fieldMap = {
  primaryImageUrl: {
    label: '图片',
    slot: 'primaryImageUrl',
    width: '100px'
  },
  'product-barCode': {
    label: 'SKU（编码）',
    width: '180px'
  },
  countryCode: {
    label: '国家编码',
    slot: 'countryCode',
    width: '180px'
  },
  'product-name': {
    label: '产品名称',
    width: '180px'
  },
  hscode: {
    label: 'hs编码',
    width: '180px'
  },
  declaredTypeEn: '申报品名(英文)',
  declaredType: '申报品名',
  taxRate: '税率',
  logisticAttribute: {
    label: '物流属性',
    slot: 'logisticAttribute',
    width: '180px'
  },
  fbaBarCode: 'FBA条形码',
  createTime: {
    label: '创建时间',
    formatter: dateFormatter,
    width: '180px'
  },
  operate: {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    // action: true,
    width: '180px'
  }
}
tableOptions.value = transformTableOptions(fieldMap, { noWidth: true })

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
  // type: undefined,
  // supplierProductId: undefined,
  declaredTypeEn: undefined,
  declaredType: undefined,
  declaredValue: undefined,
  declaredValueCurrencyCode: undefined,
  taxRate: undefined,
  logisticAttribute: undefined,
  barCode: undefined,
  hscode: undefined,
  createTime: [] as string[],
  fbaBarCode: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const supplierProductList = ref<SupplierProductVO[]>([]) // 供应商列表

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CustomRuleApi.getCustomRulePage(queryParams)
    list.value = data.list.map((item: any) => {
      // item.type = typeFind(item.type)
      item['product-name'] = item.product.name
      item['product-barCode'] = item.product.barCode
      item.primaryImageUrl = item.product.primaryImageUrl
      item.material = item.product.material
      return item
    })
    total.value = data.total
  } finally {
    loading.value = false
  }
  supplierProductList.value = await SupplierProductApi.getSupplierProductSimpleList()
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

/** 操作栏复制 */
const copyForm = (id?: number) => {
  openForm('create', id)
}

// const columnMinWidth = computeColumnMinWidth(list, 'supplierProductCode')
const insertBarcode = insertSearchVal(productSkuList)

const createTimeChange = (val: any) => {
  queryParams.createTime = val
  handleQuery()
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
