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
      <el-form-item label="产品名称" prop="name">
        <!-- <el-input
          v-model="queryParams.name"
          placeholder="请输入产品名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        /> -->

        <el-select
          v-model="queryParams.name"
          clearable
          filterable
          placeholder="请选择产品"
          @keyup.enter="handleQuery"
          class="!w-240px"
        >
          <el-option
            v-for="item in productNameList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="SKU（编码）" prop="code">
        <!-- <el-input
          v-model="queryParams.barCode"
          placeholder="请输入SKU（编码）"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        /> -->
        <el-select
          v-model="queryParams.barCode"
          clearable
          filterable
          placeholder="请选择SKU（编码）"
          @keyup.enter="handleQuery"
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
      <!-- <el-form-item label="品牌" prop="brand">
        <el-select
          v-model="queryParams.brand"
          clearable
          filterable
          placeholder="请选择品牌"
          @keyup.enter="handleQuery"
          class="!w-240px"
        >
          <el-option
            v-for="item in productBrandList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="系列" prop="series">
        <el-select
          v-model="queryParams.series"
          clearable
          filterable
          placeholder="请选择系列"
          @keyup.enter="handleQuery"
          class="!w-240px"
        >
          <el-option
            v-for="item in productSeriesList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="状态" prop="status">
        <el-select class="!w-240px" v-model="queryParams.status" clearable placeholder="请选择状态">
          <el-option
            v-for="dict in getBoolDictOptions(DICT_TYPE.COMMON_BOOLEAN_STATUS)"
            :key="String(dict.value)"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门" prop="deptId">
        <el-tree-select
          class="!w-240px"
          v-model="queryParams.deptId"
          :data="deptList"
          :props="defaultProps"
          check-strictly
          node-key="id"
          placeholder="请选择部门"
          clearable
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
        <el-button @click="moreDialog = true"
          ><Icon icon="ep:search" class="mr-5px" /> 更多</el-button
        >
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 更多 -->

  <Dialog title="更多" v-model="moreDialog" width="50%" >
    <SmForm
      class="-mb-15px"
      ref="form"
      label-width="150px"
      inline
      v-model="queryParams"
      :options="moreFormOptions"
    >
      <!-- <template #primaryImageUrl="{ scope, model }">
        <UploadImg v-model="model[scope.prop]" />
      </template> -->
      <!-- <template #action>
        <div class="moreBtnList">
          <el-button type="primary" @click="handleQuery"> 确定</el-button>
        </div>
      </template> -->
    </SmForm>
    <div class="moreBtnList">
        <el-button type="primary" @click="moreConfirm"> 确定</el-button>
    </div>
  </Dialog>

  <!-- 列表 -->
  <!--  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column
        fixed="left"
        label="主图"
        align="center"
        prop="primaryImageUrl"
        width="110px"
      >
        <template #default="scope">
          <el-image :src="scope.row.primaryImageUrl" class="w-64px h-64px" />
        </template>
      </el-table-column>
      <el-table-column
        fixed="left"
        label="SKU（编码）"
        align="center"
        prop="barCode"
        :min-width="columnMinWidth"
      />
      <el-table-column label="产品名称" align="center" prop="name" />
      <el-table-column label="产品分类" align="center" prop="categoryName" />
      <el-table-column label="部门" align="center" prop="deptName" />
      <el-table-column label="单位" align="center" prop="unitName" />
      <el-table-column label="材料" align="center" prop="material" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.COMMON_BOOLEAN_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="品牌" align="center" prop="brand" />
      <el-table-column label="系列" align="center" prop="series" />
      <el-table-column label="颜色" align="center" prop="color" />
      <el-table-column label="型号" align="center" prop="model" />
      <el-table-column label="生产编号" align="center" prop="productionNo" />

      <el-table-column label="包装高度" align="center" prop="packageHeight" />
      <el-table-column label="包装长度" align="center" prop="packageLength" />
      <el-table-column label="包装重量" align="center" prop="packageWeight" />
      <el-table-column label="包装宽度" align="center" prop="packageWidth" />

      <el-table-column label="基础宽度（mm）" align="center" prop="width" />
      <el-table-column label="基础长度（mm）" align="center" prop="length" />
      <el-table-column label="基础高度（mm）" align="center" prop="height" />
      <el-table-column label="基础重量（kg）" align="center" prop="weight" />
      <el-table-column label="指导价" align="center" prop="guidePriceList">
        <template #default="scope">
          <div v-for="(guidePrice, index) in scope.row.guidePriceList" :key="index">
            <dict-tag :type="DICT_TYPE.COUNTRY_CODE" :value="guidePrice.code" />
            <el-tag class="ml-5px">{{ guidePrice.price }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="产品备注" align="center" prop="remark" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column fixed="right" label="操作" align="center" width="150px">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('detail', scope.row.id)"
            v-hasPermi="['erp:product:update']"
          >
            查看
          </el-button>
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
    <!~~ 分页 ~~>
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>-->

  <ContentWrap>
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
      <template #primaryImageUrl="{ scope }">
        <el-image :src="scope.row.primaryImageUrl" class="w-64px h-64px" />
      </template>

      <template #status="{ scope }">
        <dict-tag :type="DICT_TYPE.COMMON_BOOLEAN_STATUS" :value="scope.row.status || ''" />
      </template>

      <!-- <template #guidePriceList="{ scope }">
        <div v-for="(guidePrice, index) in scope.row.guidePriceList" :key="index">
          <dict-tag :type="DICT_TYPE.COUNTRY_CODE" :value="guidePrice.code || ''" />
          <el-tag class="ml-5px">{{ guidePrice.price }}</el-tag>
        </div>
      </template> -->

      <template #operate="{ scope }">
        <el-button
          link
          type="primary"
          @click="openForm('detail', scope.row.id)"
          v-hasPermi="['erp:product:update']"
        >
          详情
        </el-button>
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
    </SmTable>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <ProductForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { ProductApi, ProductVO } from '@/api/erp/product/product'
import ProductForm from './ProductForm.vue'
import { ProductCategoryApi, ProductCategoryVO } from '@/api/erp/product/category'
import { defaultProps, handleTree } from '@/utils/tree'
import { DICT_TYPE, getBoolDictOptions } from '@/utils/dict'
// import Pagination from '../../../../components/Pagination/index.vue'
import { DictTag } from '../../../../components/DictTag'
import { ContentWrap } from '../../../../components/ContentWrap'
import { getDeptTree } from './data/index'
import { computeColumnWidthFor } from '@/utils/computeGeometry'
import { getProductNameList } from '@/commonData'
import { useTableData } from '@/components/SmTable/src/utils'
import { useFormData } from '@/components/SmForm/src/utils'

const { productNameList, productSkuList, productSeriesList, productBrandList } =
  getProductNameList()

/** ERP 产品 列表 */
defineOptions({ name: 'ErpProduct' })

const deptList = ref<Tree[]>([]) // 树形结构
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ProductVO[]>([]) // 列表的数据
const categoryList = ref<ProductCategoryVO[]>([]) // 产品分类列表
const total = ref(0) // 列表的总页数
let queryParams = reactive({
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
  brand: undefined
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

const { deptNameColumnWidth, brandColumnWidth } = computeColumnWidthFor(list, [
  'deptName',
  'brand'
]) as any

const { tableOptions, transformTableOptions } = useTableData()

const fieldMap = {
  primaryImageUrl: {
    label: '主图',
    fixed: 'left',
    slot: 'primaryImageUrl'
  },
  barCode: {
    label: 'SKU（编码）',
    fixed: 'left',
    width: '180px',
    slot: 'barCode',
    wrap: true
  },
  name: {
    label: '产品名称',
    width: '180px',
    slot: 'name',
    wrap: true
  },
  status: {
    label: '状态',
    slot: 'status'
  },
  deptName: {
    label: '部门',
    width: deptNameColumnWidth
  },
  brand: {
    label: '品牌',
    width: brandColumnWidth
  },
  categoryName: {
    label: '分类',
    slot: 'categoryName',
    width: '180px',
    wrap: true
  },
  series: {
    label: '系列',
    slot: 'series',
    width: '180px',
    wrap: true
  },
  model: {
    label: '型号',
    slot: 'model',
    width: '180px',
    wrap: true
  },

  packageLength: '包装长度',
  packageWidth: '包装宽度',
  packageHeight: '包装高度',
  packageWeight: '包装重量',

  length: '基础长度（mm）',
  width: '基础宽度（mm）',
  height: '基础高度（mm）',
  weight: '基础重量（g）',

  updateTime: {
    label: '更新时间',
    formatter: dateFormatter,
    width: '180px'
  },
  updater: '更新人',
  createTime: {
    label: '创建时间',
    formatter: dateFormatter,
    width: '180px'
  },
  creator: '创建人',
  operate: {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '180px'
  }

  // unitName: '单位',
  // material: '材料',
  // color: '颜色',
  // productionNo: '生产编号',
  // guidePrice: {
  //   label: '指导价',
  //   slot: 'guidePrice'
  // },
  // remark: '产品备注',
}
tableOptions.value = transformTableOptions(fieldMap)

const { formOptions: moreFormOptions } = useFormData()

const moreDialog = ref(false)
const excludeFields = ['name', 'code', 'barCode', 'categoryName', 'brand', 'series','status', 'deptName', 'model', 'operate', 'primaryImageUrl']


const moreFormOptionsInit = () => {
  const list:any = []
  tableOptions.value.forEach((item: any) => {
    if (!excludeFields.includes(item.prop)) {
      queryParams[item.prop] = ''
      const obj = {
        type: 'input',
        prop: item.prop,
        label: item.label,
        placeholder: `请输入${item.label}`,
      }
      list.push(obj)
    }
  })
  moreFormOptions.value = list
}

moreFormOptionsInit()

const moreConfirm = () =>{
  moreDialog.value = false
  handleQuery()
}

console.log(tableOptions.value, 'tableOptions.value')

/** 初始化 **/
onMounted(async () => {
  await getList()
  // 产品分类
  const categoryData = await ProductCategoryApi.getProductCategorySimpleList()
  categoryList.value = handleTree(categoryData, 'id', 'parentId')
  deptList.value = (await getDeptTree()).value
})
</script>
<style lang="scss" scoped>
.moreBtnList {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}
</style>