<template>
  <div class="platform-store">
    <StoreList ref="storeListRef" @click-shop="clickShop" />

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
              v-if="clickShopItem.type === 1"
              v-hasPermi="['erp:shop:create']"
            >
              <Icon icon="ep:plus" class="mr-5px" /> 新增
            </el-button>
          </template>
        </SmForm>
      </ContentWrap>

      <!-- 列表 -->
      <ContentWrap :bodyStyle="{ padding: '20px', 'padding-bottom': 0 }" style="margin-bottom: 0">
        <!-- style="height: calc(100vh - 230px)" -->
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
            {{ scope.row.countryCode }}
            <!-- <dict-tag :type="DICT_TYPE.COUNTRY_CODE" value="7" /> -->
            <!-- <dict-tag :type="DICT_TYPE.COUNTRY_CODE" :value="scope.row.countryCode + '' || ''" /> -->
          </template>

          <template #status="{ scope }">
            <dict-tag :type="DICT_TYPE.ERP_OFF_STATUS" :value="scope.row.status + '' || ''" />
          </template>

          <template #type="{ scope }">
            <dict-tag :type="DICT_TYPE.ERP_SHOP_TYPE" :value="scope.row.type + '' || ''" />
          </template>

          <template #operate="{ scope }">
            <el-button
              link
              type="primary"
              @click="openForm('update', scope.row.id)"
              v-hasPermi="['erp:shop:update']"
            >
              编辑
            </el-button>
            <el-button
              link
              type="danger"
              @click="handleDelete(scope.row.id)"
              v-hasPermi="['erp:shop:delete']"
            >
              删除
            </el-button>
          </template>
        </SmTable>
      </ContentWrap>
    </div>

    <!-- 表单弹窗：添加/修改 -->
    <ShopForm ref="formRef" @success="refresh" />
  </div>
</template>

<script setup lang="ts">
import { DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import ShopForm from './ShopForm.vue'
import StoreList from './components/StoreList.vue'
import { useSearchForm } from './hooks/search'
import { ShopApi, ShopVO } from '@/api/erp/sale/shop'
import { useTableData } from '@/components/SmTable/src/utils'
import { cloneDeep } from 'lodash-es'

const { tableOptions, transformTableOptions } = useTableData()

const fieldMap = {
  // name: {
  //   label: '店铺名称',
  //   width: '180px',
  //   slot: 'name',
  //   wrap: true
  // },
  // code: {
  //   label: '店铺代码',
  //   width: '180px',
  //   slot: 'code',
  //   wrap: true
  // },
  platform: {
    label: '平台',
    width: '180px'
  },
  // account: '平台账户',
  account: '店铺名称',
  // countryCode: {
  //   label: '国家编码',
  //   slot: 'countryCode',
  //   width: '180px'
  // },
  status: {
    label: '状态',
    slot: 'status',
    width: '180px'
  },
  type: {
    label: '类型',
    slot: 'type',
    width: '180px'
  },
  remark: '备注',
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

/** ERP 平台店铺 列表 */
defineOptions({ name: 'ErpShop' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ShopVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  platform: undefined,
  name: undefined,
  status: undefined,
  type: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ShopApi.getShopPage(queryParams)
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
    await ShopApi.deleteShop(id)
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
    const data = await ShopApi.exportShop(queryParams)
    download.excel(data, '客户.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

const { getSearchFormData, searchFormOptions } = useSearchForm(handleQuery, queryParams)

const clickShopItem: any = ref({})
const clickShop = async (item: any) => {
  clickShopItem.value = item
  loading.value = true
  try {
    const query: any = cloneDeep(queryParams)
    // 线下不查platforem
    if (item.type === 1) {
      query.platform = undefined
      query.type = 1
    } else {
      query.platform = item.platform
    }

    const data = await ShopApi.getShopPage(query)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}
const storeListRef = ref()
const refresh = () => {
  getList()
  storeListRef.value.getList()
  console.log('刷新了')
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
<style lang="scss" scoped>
.platform-store {
  display: flex;
  // height: calc(100vh - 120px);
}
.platform-store-table {
  margin-left: 10px;
  flex-grow: 1;
}
</style>
