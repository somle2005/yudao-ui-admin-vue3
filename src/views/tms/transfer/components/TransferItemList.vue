<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
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
      <el-table-column label="产品id" align="center" prop="productId" />
      <el-table-column label="数量" align="center" prop="qty" />
      <el-table-column label="箱数" align="center" prop="boxQty" />
      <el-table-column label="包装重量（kg）" align="center" prop="packageWeight" />
      <el-table-column label="包装体积（m³）" align="center" prop="packageVolume" />
      <el-table-column label="库存公司ID" align="center" prop="stockCompanyId" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="实际发货数" align="center" prop="outboundClosedQty" />
      <el-table-column label="已入库数" align="center" prop="inboundClosedQty" />
    </el-table>
  </ContentWrap>
</template>
<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import { TransferApi } from '@/api/tms/transfer'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps<{
  transferId?: number // 调拨单ID（主表的关联字段）
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    list.value = await TransferApi.getTransferItemListByTransferId(props.transferId)
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>