<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <SmForm
      class="-mb-15px"
      ref="queryFormRef"
      :inline="true"
      label-width="100px"
      v-model="queryParams"
      :options="searchFormOptions"
      :getModelValue="getSearchFormData"
    >
      <template #action>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['wms:warehouse:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['wms:warehouse:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </template>
    </SmForm>
  </ContentWrap>

  <!-- 列表 -->
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
      <template #operate="{ scope }">
        <el-button
          link
          type="primary"
          @click="openForm('update', scope.row.id)"
          v-hasPermi="['wms:warehouse:update']"
        >
          编辑
        </el-button>
        <el-button
          link
          type="danger"
          @click="handleDelete(scope.row.id)"
          v-hasPermi="['wms:warehouse:delete']"
        >
          删除
        </el-button>
      </template>
    </SmTable>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <WarehouseForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { WarehouseApi, WarehouseVO } from '@/api/wms/warehouse'
import WarehouseForm from './WarehouseForm.vue'
import { useTableData } from '@/components/SmTable/src/utils'
import { useSearchForm } from './hooks/search'
import { DICT_TYPE } from '@/utils/dict'


const { tableOptions, transformTableOptions } = useTableData()

const fieldMap = {
  code: '仓库代码',
  name: '仓库',
  mode: {
    label: '仓库属性',
    slot: 'mode',
    dictAttrs: { type: DICT_TYPE.WMS_WAREHOUSE_MODE }
  },
  status: {
    label: '状态',
    slot: 'status',
    dictAttrs: { type: DICT_TYPE.WMS_VALID_STATUS }
  },
  companyName: '公司名称',
  // country: '国家编码',
  country: {
    label: '国家编码',
    slot: 'country',
    dictAttrs: { type: DICT_TYPE.COUNTRY_CODE }
  },
  province: '省/州',
  city: '城市',
  addressLine1: '地址1',
  addressLine2: '地址2',
  postcode: '邮编',
  contactPerson: '联系人',
  contactPhone: '联系电话',
  isSync: {
    label: '库存同步',
    slot: 'isSync',
    dictAttrs: { type: DICT_TYPE.COMMON_ENABLE_STATUS }
  },
  updateTime: {
    label: '更新时间',
    formatter: dateFormatter,
    width: '180px'
  },
  updaterName: '更新人',
  createTime: {
    label: '创建时间',
    formatter: dateFormatter,
    width: '180px'
  },
  creatorName: '创建人',
  operate: {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '180px'
  }
}
tableOptions.value = transformTableOptions(fieldMap, {
  allWrap: true,
  allWrapIgnoreList: ['createTime', 'updateTime', 'mode']
})

/** 仓库 列表 */
defineOptions({ name: 'WmsWarehouse' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<WarehouseVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  mode: undefined,
  code: undefined,
  name: undefined,
  externalStorageId: undefined,
  externalStorageCode: undefined,
  companyName: undefined,
  country: undefined,
  province: undefined,
  city: undefined,
  addressLine1: undefined,
  addressLine2: undefined,
  postcode: undefined,
  contactPerson: undefined,
  contactPhone: undefined,
  isSync: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await WarehouseApi.getWarehousePage(queryParams)
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
    await WarehouseApi.deleteWarehouse(id)
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
    const data = await WarehouseApi.exportWarehouse(queryParams)
    download.excel(data, '仓库.xls')
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
