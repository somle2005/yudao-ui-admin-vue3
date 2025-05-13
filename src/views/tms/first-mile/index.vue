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
      <el-form-item label="编码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="单据日期" prop="billTime">
        <el-date-picker
          v-model="queryParams.billTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="物流商ID" prop="carrierId">
        <el-select
          v-model="queryParams.carrierId"
          placeholder="请选择物流商ID"
          clearable
          class="!w-240px"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="结算日期" prop="settlementDate">
        <el-select
          v-model="queryParams.settlementDate"
          placeholder="请选择结算日期"
          clearable
          class="!w-240px"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="应付款余额" prop="balance">
        <el-input
          v-model="queryParams.balance"
          placeholder="请输入应付款余额"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="审核人" prop="auditorId">
        <el-select
          v-model="queryParams.auditorId"
          placeholder="请选择审核人"
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
      <el-form-item label="目的仓ID" prop="toWarehouseId">
        <el-select
          v-model="queryParams.toWarehouseId"
          placeholder="请选择目的仓ID"
          clearable
          class="!w-240px"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="提单号" prop="ladingNo">
        <el-input
          v-model="queryParams.ladingNo"
          placeholder="请输入提单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="柜型（字典）" prop="cabinetType">
        <el-select
          v-model="queryParams.cabinetType"
          placeholder="请选择柜型（字典）"
          clearable
          class="!w-240px"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="装柜日期" prop="packTime">
        <el-date-picker
          v-model="queryParams.packTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="预计到货日期" prop="arrivePlanTime">
        <el-date-picker
          v-model="queryParams.arrivePlanTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="预计送仓时间" prop="deliveryEstimateTime">
        <el-date-picker
          v-model="queryParams.deliveryEstimateTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="实际送仓时间" prop="deliveryActualTime">
        <el-date-picker
          v-model="queryParams.deliveryActualTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="货柜体积（m³）" prop="totalVolume">
        <el-input
          v-model="queryParams.totalVolume"
          placeholder="请输入货柜体积（m³）"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="货柜毛重（kg）" prop="totalWeight">
        <el-input
          v-model="queryParams.totalWeight"
          placeholder="请输入货柜毛重（kg）"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="货柜净重（kg）" prop="netWeight">
        <el-input
          v-model="queryParams.netWeight"
          placeholder="请输入货柜净重（kg）"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="货柜货值（按最近采购价）" prop="totalValue">
        <el-input
          v-model="queryParams.totalValue"
          placeholder="请输入货柜货值（按最近采购价）"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="货柜件数" prop="totalQty">
        <el-input
          v-model="queryParams.totalQty"
          placeholder="请输入货柜件数"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
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
      <el-form-item label="发货状态" prop="outboundStatus">
        <el-select
          v-model="queryParams.outboundStatus"
          placeholder="请选择发货状态"
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
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['tms:first-mile:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['tms:first-mile:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="编码" align="center" prop="code" />
      <el-table-column
        label="单据日期"
        align="center"
        prop="billTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="物流商ID" align="center" prop="carrierId" />
      <el-table-column
        label="结算日期"
        align="center"
        prop="settlementDate"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="应付款余额" align="center" prop="balance" />
      <el-table-column label="审核人" align="center" prop="auditorId" />
      <el-table-column
        label="审核时间"
        align="center"
        prop="auditTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="审核状态" align="center" prop="auditStatus" />
      <el-table-column label="目的仓ID" align="center" prop="toWarehouseId" />
      <el-table-column label="提单号" align="center" prop="ladingNo" />
      <el-table-column label="柜型（字典）" align="center" prop="cabinetType" />
      <el-table-column
        label="装柜日期"
        align="center"
        prop="packTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="预计到货日期"
        align="center"
        prop="arrivePlanTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="预计送仓时间"
        align="center"
        prop="deliveryEstimateTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="实际送仓时间"
        align="center"
        prop="deliveryActualTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="货柜体积（m³）" align="center" prop="totalVolume" />
      <el-table-column label="货柜毛重（kg）" align="center" prop="totalWeight" />
      <el-table-column label="货柜净重（kg）" align="center" prop="netWeight" />
      <el-table-column label="货柜货值（按最近采购价）" align="center" prop="totalValue" />
      <el-table-column label="货柜件数" align="center" prop="totalQty" />
      <el-table-column label="发货状态" align="center" prop="outboundStatus" />
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
      <el-table-column label="操作" align="center" min-width="120px">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['tms:first-mile:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['tms:first-mile:delete']"
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
  <FirstMileForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { FirstMileApi, FirstMileVO } from '@/api/tms/first-mile'
import FirstMileForm from './FirstMileForm.vue'

/** 头程单 列表 */
defineOptions({ name: 'TmsFirstMile' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<FirstMileVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  createTime: [],
  code: undefined,
  billTime: [],
  carrierId: undefined,
  settlementDate: [],
  balance: undefined,
  auditorId: undefined,
  auditTime: [],
  auditStatus: undefined,
  toWarehouseId: undefined,
  ladingNo: undefined,
  cabinetType: undefined,
  packTime: [],
  arrivePlanTime: [],
  deliveryEstimateTime: [],
  deliveryActualTime: [],
  totalVolume: [],
  totalWeight: [],
  netWeight: [],
  totalValue: [],
  totalQty: [],
  remark: undefined,
  outboundStatus: undefined,
  outboundTime: [],
  inboundStatus: undefined,
  inboundTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await FirstMileApi.getFirstMilePage(queryParams)
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
    await FirstMileApi.deleteFirstMile(id)
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
    const data = await FirstMileApi.exportFirstMile(queryParams)
    download.excel(data, '头程单.xls')
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