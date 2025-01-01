<template>
  <el-table
    v-loading="loading"
    :stripe="stripe"
    :showOverflowTooltip="showOverflowTooltip"
    :data="tableData"
    v-bind="$attrs"
    @row-click="rowClick"
  >
    <template v-for="(item, index) in tableOption" :key="index">
      <el-table-column
        v-if="item.prop && !item.action"
        :label="item.label"
        :prop="item.prop"
        :width="item.width"
        :align="item.align"
        :formatter="item.formatter"
        :min-width="item['min-width']"
        v-bind="columnItem(item)"
      >
        <template v-if="item.slot" #default="scope">
          <template v-if="scope.row.rowEdit">
            <el-input v-model="scope.row[item.prop!]" size="small" />
          </template>
          <template v-else>
            <template v-if="scope.$index + scope.column.id === currentEdit">
              <div style="display: flex">
                <el-input v-model="scope.row[item.prop!]" size="small" />
                <div>
                  <slot v-if="$slots.cellEdit" name="cellEdit" :scope="scope"></slot>
                  <div v-else class="action-icon">
                    <el-icon-check class="check" @click.stop="check(scope)" />
                    <el-icon-close class="close" @click.stop="close(scope)" />
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <slot v-if="item.slot" :name="item.slot" :scope="scope"></slot>
              <!-- <span v-else>{{ scope.row[item.prop!] }}</span> -->
              <component
                :is="`el-icon-${toLine(editIcon)}`"
                v-if="item.editable"
                class="edit"
                @click.stop="clickEditIcon(scope)"
              />
            </template>
          </template>
        </template>
      </el-table-column>
    </template>
    <el-table-column
      v-if="actionOption"
      :label="actionOption.label"
      :width="actionOption.width"
      :align="actionOption.align"
      :formatter="actionOption.formatter"
      :min-width="actionOption['min-width']"
      v-bind="columnItem(actionOption)"
    >
      <template #default="scope">
        <slot v-if="scope.row.rowEdit" name="editRow" :scope="scope"></slot>
        <slot v-else name="action" :scope="scope"></slot>
      </template>
    </el-table-column>
  </el-table>

  <Pagination v-if="pagination && !loading" v-bind="pageAttrs()" />
</template>

<script lang="ts" setup>
import { PropType, computed, ref, watch, onMounted } from 'vue'
import { TableOptions } from './types'
import { toLine } from './utils'
import { cloneDeep } from 'lodash-es'
import Pagination from './components/Pagination.vue'

const pageAttrs = () => {
  const pageAttrs = useAttrs() || {}
  return Object.assign({ total: 0 }, pageAttrs)
}
const columnItem = (item) => {
  const list = ['label', 'prop', 'width', 'align', 'formatter']
  const filterItem = {}
  for (const key in item) {
    if (!list.includes(key)) {
      filterItem[key] = item[key]
    }
  }
  return filterItem
}

const props = defineProps({
  // 是否在加载中
  loading: {
    type: Boolean,
    default: false
  },
  // 表格配置选项
  options: {
    type: Array as PropType<TableOptions[]>,
    required: true
  },
  // 表格数据
  data: {
    type: Array,
    required: true
  },
  // 是否为斑马纹
  stripe: {
    type: Boolean,
    default: true
  },
  // 是否隐藏额外内容并在单元格悬停时使用 Tooltip 显示它
  showOverflowTooltip: {
    type: Boolean,
    default: true
  },
  // 编辑显示的图标
  editIcon: {
    type: String,
    default: 'Edit'
  },
  // 是否可以编辑行
  isEditRow: {
    type: Boolean,
    default: false
  },
  // 编辑行按钮的标识
  editRowType: {
    type: String,
    default: ''
  },
  // 是否显示分页
  pagination: {
    type: Boolean,
    default: true
  }
})

const emits = defineEmits(['confirm', 'cancel', 'update:editRowType', 'row-click'])

// 当前被点击的单元格的标识
const currentEdit = ref<string>('')

// 拷贝一份表格的数据
const tableData = ref<any[]>([])

watch(
  () => props.data,
  (val) => {
    console.log(val, '拿到data值了')
    if (val?.length) {
      tableData.value = cloneDeep(val).map((item: any) => {
        item.rowEdit = false
        return item
      })
    } else {
      tableData.value = []
    }
  },
  { immediate: true, deep: true }
)

onMounted(() => {})

// 过滤操作项之后的配置
const tableOption = computed(() => props.options.filter((item) => !item.action))
// 操作项
const actionOption = computed(() => props.options.find((item) => item.action))

// 点击编辑图标
const clickEditIcon = (scope: any) => {
  // 会做一个判断 判断是否当前单元格被点击了
  // 拼接$index和column的id
  currentEdit.value = scope.$index + scope.column.id
}

// 点击确认
const check = (scope: any) => {
  emits('confirm', scope)
  currentEdit.value = ''
}
// 点击取消
const close = (scope: any) => {
  emits('cancel', scope)
  currentEdit.value = ''
}

// 点击行的事件
const rowClick = (row: any, column: any) => {
  emits('row-click', row, column)
  // 判断是否是点击的操作项
  const clickOperate =
    column.label === actionOption.value!.label && props.isEditRow && props.editRowType === 'edit'
  //&& cloneeditRowType.value === props.editRowType

  if (clickOperate) {
    // 编辑行的操作
    row.rowEdit = !row.rowEdit
    // 重置其他数据的rowEdit
    tableData.value.map((item) => {
      if (item !== row) item.rowEdit = false
    })

    // 重置按钮的标识
    if (!row.rowEdit) emits('update:editRowType', '')
  }
}
</script>

<style lang="scss" scoped>
.edit {
  position: relative;
  top: 2px;
  left: 12px;
  width: 1em;
  height: 1em;
  cursor: pointer;
}

.action-icon {
  display: flex;

  svg {
    position: relative;
    top: 8px;
    width: 1em;
    height: 1em;
    margin-left: 8px;
    cursor: pointer;
  }

  .check {
    color: red;
  }

  .close {
    color: green;
  }
}
</style>
