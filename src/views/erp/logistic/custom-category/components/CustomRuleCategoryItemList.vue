<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="国家编码" align="center" prop="countryCode">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.COUNTRY_CODE" :value="scope.row.countryCode" />
        </template>
      </el-table-column>
      <el-table-column label="HS编码" align="center" prop="hsCode" />
      <el-table-column label="税率" align="center" prop="taxRate" />
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="更新人" align="center" prop="updater" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="创建人" align="center" prop="creator" />
    </el-table>
  </ContentWrap>
</template>
<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import { CustomRuleCategoryApi } from '@/api/erp/logistic/custom-category'
import { DICT_TYPE } from '@/utils/dict'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps<{
  categoryId?: number // 分类表id（主表的关联字段）
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据

/** 查询列表 */
const getList = async () => {
  if (!props.categoryId) return
  loading.value = true
  try {
    list.value = await CustomRuleCategoryApi.getCustomRuleCategoryItemListByCategoryId(
      props.categoryId
    )
  } finally {
    loading.value = false
  }
}

/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.categoryId,
  async (val) => {
    // 1. 重置表单
    list.value = []
    // 2. val 非空，则加载数据
    if (!val) {
      return
    }
    getList()
  },
  { immediate: true }
)

defineExpose({ getList })
// /** 初始化 **/
// onMounted(() => {
//   getList()
// })
</script>
