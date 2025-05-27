<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="乐观锁" prop="revision">
        <el-input
          v-model="queryParams.revision"
          placeholder="请输入乐观锁"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="创建人ID" prop="creator">
        <el-input
          v-model="queryParams.creator"
          placeholder="请输入创建人ID"
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
      <el-form-item label="更新人ID" prop="updater">
        <el-input
          v-model="queryParams.updater"
          placeholder="请输入更新人ID"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
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
      <el-form-item label="调拨单编码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入调拨单编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="发出仓库ID" prop="fromWarehouseId">
        <el-input
          v-model="queryParams.fromWarehouseId"
          placeholder="请输入发出仓库ID"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="目的仓库ID" prop="toWarehouseId">
        <el-input
          v-model="queryParams.toWarehouseId"
          placeholder="请输入目的仓库ID"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="审核人ID" prop="auditorId">
        <el-input
          v-model="queryParams.auditorId"
          placeholder="请输入审核人ID"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="审核状态" prop="auditStatus">
        <el-select
          v-model="queryParams.auditStatus"
          placeholder="请选择审核状态"
          clearable
          class="!w-240px"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="审核时间" prop="auditTime">
        <el-date-picker
          v-model="queryParams.auditTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="审核意见" prop="auditAdvice">
        <el-input
          v-model="queryParams.auditAdvice"
          placeholder="请输入审核意见"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="出库状态" prop="outboundStatus">
        <el-select
          v-model="queryParams.outboundStatus"
          placeholder="请选择出库状态"
          clearable
          class="!w-240px"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="出库时间" prop="outboundTime">
        <el-date-picker
          v-model="queryParams.outboundTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="入库状态" prop="inboundStatus">
        <el-select
          v-model="queryParams.inboundStatus"
          placeholder="请选择入库状态"
          clearable
          class="!w-240px"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="入库时间" prop="inboundTime">
        <el-date-picker
          v-model="queryParams.inboundTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="queryParams.remark"
          placeholder="请输入备注"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="跟踪号" prop="traceNo">
        <el-input
          v-model="queryParams.traceNo"
          placeholder="请输入跟踪号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="总货值" prop="totalValue">
        <el-input
          v-model="queryParams.totalValue"
          placeholder="请输入总货值"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="总净重" prop="netWeight">
        <el-input
          v-model="queryParams.netWeight"
          placeholder="请输入总净重"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="总毛重" prop="totalWeight">
        <el-input
          v-model="queryParams.totalWeight"
          placeholder="请输入总毛重"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="总体积" prop="totalVolume">
        <el-input
          v-model="queryParams.totalVolume"
          placeholder="请输入总体积"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="总件数" prop="totalQty">
        <el-input
          v-model="queryParams.totalQty"
          placeholder="请输入总件数"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="出库单ID" prop="outboundId">
        <el-input
          v-model="queryParams.outboundId"
          placeholder="请输入出库单ID"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="出库单编码" prop="outboundCode">
        <el-input
          v-model="queryParams.outboundCode"
          placeholder="请输入出库单编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="入库单ID" prop="inboundId">
        <el-input
          v-model="queryParams.inboundId"
          placeholder="请输入入库单ID"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="入库单编码" prop="inboundCode">
        <el-input
          v-model="queryParams.inboundCode"
          placeholder="请输入入库单编码"
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
          v-hasPermi="['tms:transfer:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['tms:transfer:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!-- 子表的列表 -->
      <el-table-column type="expand">
        <template #default="scope">
          <el-tabs model-value="transferItem">
            <el-tab-pane label="调拨单明细" name="transferItem">
              <TransferItemList :transfer-id="scope.row.id" />
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>
      <el-table-column label="乐观锁" align="center" prop="revision" />
      <el-table-column label="创建人ID" align="center" prop="creator" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="更新人ID" align="center" prop="updater" />
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="调拨单编码" align="center" prop="code" />
      <el-table-column label="发出仓库ID" align="center" prop="fromWarehouseId" />
      <el-table-column label="目的仓库ID" align="center" prop="toWarehouseId" />
      <el-table-column label="审核人ID" align="center" prop="auditorId" />
      <el-table-column label="审核状态" align="center" prop="auditStatus" />
      <el-table-column
        label="审核时间"
        align="center"
        prop="auditTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="审核意见" align="center" prop="auditAdvice" />
      <el-table-column label="出库状态" align="center" prop="outboundStatus" />
      <el-table-column
        label="出库时间"
        align="center"
        prop="outboundTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="入库状态" align="center" prop="inboundStatus" />
      <el-table-column
        label="入库时间"
        align="center"
        prop="inboundTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="跟踪号" align="center" prop="traceNo" />
      <el-table-column label="总货值" align="center" prop="totalValue" />
      <el-table-column label="总净重" align="center" prop="netWeight" />
      <el-table-column label="总毛重" align="center" prop="totalWeight" />
      <el-table-column label="总体积" align="center" prop="totalVolume" />
      <el-table-column label="总件数" align="center" prop="totalQty" />
      <el-table-column label="出库单ID" align="center" prop="outboundId" />
      <el-table-column label="出库单编码" align="center" prop="outboundCode" />
      <el-table-column label="入库单ID" align="center" prop="inboundId" />
      <el-table-column label="入库单编码" align="center" prop="inboundCode" />
      <el-table-column label="操作" align="center" min-width="120px">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['tms:transfer:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['tms:transfer:delete']"
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
  <TransferForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { TransferApi, TransferVO } from '@/api/tms/transfer'
import TransferForm from './TransferForm.vue'
import TransferItemList from './components/TransferItemList.vue'

/** 调拨单 列表 */
defineOptions({ name: 'TmsTransfer' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<TransferVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  revision: undefined,
  creator: undefined,
  createTime: [],
  updater: undefined,
  updateTime: [],
  code: undefined,
  fromWarehouseId: undefined,
  toWarehouseId: undefined,
  auditorId: undefined,
  auditStatus: undefined,
  auditTime: [],
  auditAdvice: undefined,
  outboundStatus: undefined,
  outboundTime: [],
  inboundStatus: undefined,
  inboundTime: [],
  remark: undefined,
  traceNo: undefined,
  totalValue: undefined,
  netWeight: undefined,
  totalWeight: undefined,
  totalVolume: undefined,
  totalQty: undefined,
  outboundId: undefined,
  outboundCode: undefined,
  inboundId: undefined,
  inboundCode: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await TransferApi.getTransferPage(queryParams)
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
    await TransferApi.deleteTransfer(id)
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
    const data = await TransferApi.exportTransfer(queryParams)
    download.excel(data, '调拨单.xls')
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