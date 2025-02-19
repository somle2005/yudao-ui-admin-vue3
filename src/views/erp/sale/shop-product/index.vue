<template>
  <div class="platform-store">
    <div class="platform-store-table">
      <ContentWrap>
        <!-- 搜索工作栏 -->
        <SmForm
          class="-mb-15px"
          ref="queryFormRef"
          :inline="true"
          label-width="68px"
          v-model="queryParams"
          :options="searchFormOptions"
          :getModelValue="getSearchFormData"
        >
          <template #action>
            <el-button @click="handleQuery"
              ><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button
            >
            <el-button @click="resetQuery"
              ><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button
            >
            <!-- <el-button
              type="primary"
              plain
              @click="openForm('create')"
              v-hasPermi="['erp:shop-product:create']"
            >
              <Icon icon="ep:plus" class="mr-5px" /> 新增
            </el-button> -->
          </template>
        </SmForm>
      </ContentWrap>

      <!-- 列表  style="height: calc(100vh - 230px)" -->
      <ContentWrap :bodyStyle="{ padding: '20px', 'padding-bottom': 0 }">
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
          <template #image="{ scope }">
            <el-image :src="scope.row.image" class="w-64px h-64px" />
          </template>
          <template #status="{ scope }">
            <dict-tag :type="DICT_TYPE.ERP_OFF_STATUS" :value="scope.row.status + '' || ''" />
          </template>

          <template #operate="{ scope }">
            <el-button
              link
              type="primary"
              @click="openForm('update', scope.row.id)"
              v-hasPermi="['erp:shop-product:update']"
            >
              编辑
            </el-button>
            <el-button
              link
              type="danger"
              @click="handleDelete(scope.row.id)"
              v-hasPermi="['erp:shop-product:delete']"
            >
              删除
            </el-button>
          </template>
        </SmTable>
      </ContentWrap>
    </div>

    <!-- 表单弹窗：添加/修改 -->
    <ShopProductForm ref="formRef" @success="getList" />
  </div>
</template>

<script setup lang="ts">
import { DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import ShopProductForm from './ShopProductForm.vue'
import { useSearchForm } from './hooks/search'
import { ShopProductApi, ShopProductVO } from '@/api/erp/sale/shop-product'
import { useTableData } from '@/components/SmTable/src/utils'

const { tableOptions, transformTableOptions } = useTableData()

const fieldMap = {
  image: {
    label: '产品图',
    width: '100px',
    // fixed: 'left',
    slot: 'image'
  },
  name: {
    label: '产品名称',
    width: '180px',
    slot: 'name',
    wrap: true
  },
  // shopCode: {
  //   label: '店铺代码',
  //   width: '180px',
  //   slot: 'shopCode',
  //   wrap: true
  // },
  shopPlatform: {
    label: '店铺平台',
    width: '180px'
  },
  shopName: {
    label: '店铺名称',
    width: '180px',
    slot: 'shopName',
    wrap: true
  },
  status: {
    label: '状态',
    slot: 'status',
    width: '180px'
  },
  createTime: {
    label: '创建时间',
    formatter: dateFormatter,
    width: '180px'
  },
  currency: '币种',
  remark: '备注',
  operate: {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    // action: true,
    width: '180px'
  }
}
tableOptions.value = transformTableOptions(fieldMap, { noWidth: true })

/** ERP 店铺产品 列表 */
defineOptions({ name: 'ErpShopProduct' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ShopProductVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  shopId: undefined,
  platform: undefined,
  status: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ShopProductApi.getShopProductPage(queryParams)
    list.value = data.list.map((item) => {
      item.shopName = item.shop.name
      item.shopPlatform = item.shop.platform
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
    await ShopProductApi.deleteShopProduct(id)
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
    const data = await ShopProductApi.exportShopProduct(queryParams)
    download.excel(data, '客户.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

const { getSearchFormData, searchFormOptions } = useSearchForm(handleQuery, queryParams)

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
<style lang="scss" scoped>
.platform-store {
  // display: flex;
  height: calc(100vh - 120px);
}
.platform-store-table {
  margin-left: 10px;
  flex-grow: 1;
}
</style>
