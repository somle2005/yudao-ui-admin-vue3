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
            <el-button
              type="primary"
              plain
              @click="openForm('create')"
              v-hasPermi="['oms:shop-product:create']"
            >
              <Icon icon="ep:plus" class="mr-5px" /> 新增
            </el-button>
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
<!--          <template #image="{ scope }">-->
<!--            <el-image :src="scope.row.image" class="w-64px h-64px" />-->
<!--          </template>-->
<!--          <template #status="{ scope }">-->
<!--            <dict-tag-->
<!--              :type="DICT_TYPE.ERP_PRODUCT_LISTING_STATUS"-->
<!--              :value="scope.row.status + '' || ''"-->
<!--            />-->
<!--          </template>-->

<!--          <template #name="{ scope }">-->
<!--            <div class="slot-wrap">-->
<!--              <el-link type="primary" :href="scope.row.url" target="_blank">{{-->
<!--                scope.row.name-->
<!--              }}</el-link>-->
<!--            </div>-->
<!--          </template>-->

<!--          <template #SKUQuantity="{ scope }">-->
<!--            <div :key="item" v-for="item in scope.row.SKUQuantity" class="slot-wrap">-->
<!--              {{ item }}-->
<!--            </div>-->
<!--          </template>-->

          <template #operate="{ scope }">
            <el-button
              link
              type="primary"
              @click="openForm('update', scope.row.id)"
              v-hasPermi="['oms:shop-product:update']"
            >
              编辑
            </el-button>
            <el-button
              link
              type="danger"
              @click="handleDelete(scope.row.id)"
              v-hasPermi="['oms:shop-product:delete']"
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
// import { DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import ShopProductForm from './ShopProductForm.vue'
import { useSearchForm } from './hooks/search'
import { ShopProductApi, ShopProductVO } from '@/api/oms/shop-product'
import { useTableData } from '@/components/SmTable/src/utils'

const { tableOptions, transformTableOptions } = useTableData()

const fieldMap = {
  platform: {
    label: '所属平台',
    width: '180px'
  },
  shopProductCode: {
    label: '平台SKU',
    width: '180px'
  },
  productCodeAndQty:  {
    label: '产品编码*数量',
    width: '180px'
  },
  name: {
    label: '平台产品名称',
    width: '180px'
  },
  platformShopName: {
    label: '平台店铺名称',
    width: '180px',
    slot: 'platformShopName',
    wrap: true
  },
  shopName: {
    label: '店铺别名',
    width: '180px'
  },
  deptName: {
    label: '部门',
    width: '180px',
    slot: 'deptName',
    wrap: true
  },
  sellableQty: {
    label: '可售数量',
    width: '250px'
  },
  price: '售价',
  currencyCode: '币种',
  createTime: {
    label: '创建时间',
    formatter: dateFormatter,
    width: '180px'
  },
  updateTime: {
    label: '更新时间',
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
tableOptions.value = transformTableOptions(fieldMap)

/** OMS 店铺产品 列表 */
defineOptions({ name: 'OmsShopProduct' })

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
  shopName: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ShopProductApi.getShopProductPage(queryParams)
    
    try {
      list.value = data.list.map((item) => {
        if (item.shop !== null) {
          item.platformShopName = item.shop.externalName
          item.platform = item.shop.platformCode
          item.shopName = item.shop.name
        }
        item.shopProductCode = item.code
        return item
      })
    } catch (e) {
      console.log(e, '处理列表数据报错')
    }
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
.slot-wrap {
  white-space: normal;
}
</style>
