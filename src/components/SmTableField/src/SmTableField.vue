<script setup lang="ts">
import { Icon } from '@/components/Icon'
import { PropType, ref, watch } from 'vue'
import { DEFAULT_TABLE_CONFIG_VAl } from './utils'
import { cloneDeep } from 'lodash-es'

const props = defineProps({
  tableConfig: {
    type: Object as PropType<TableOptionsConfig>,
    default: () => {
      return {
        originName: 'label',
        prop: 'prop',
        width: 'width',
        isEnable: 'isEnable',
        sort: 'sort',
        fixed: 'fixed'
      }
    }
  },
  tableList: {
    type: Array as PropType<Array<any>>,
    defalult: () => {
      return []
    }
  },
  iconSize: {
    type: Number,
    defalult: 25
  }
})

const dialogTable = ref(false)

// 这里还可以进行扩展提示-比如字段要求
const columnData = [
  {
    prop: 'originName',
    label: '原字段名称'
  },
  {
    prop: 'width',
    label: '宽度'
  },
  {
    prop: 'isEnable',
    label: '是否启用'
  },
  {
    prop: 'fixed',
    label: '是否固定',
    data: [
      {
        label: '左固定',
        value: 'left'
      },
      {
        label: '右固定',
        value: 'right'
      }
    ]
  }
]

const tableData = ref<Array<any>>([])
const emits = defineEmits(['update:modelValue', 'confirm'])

let dragItem: any = {}

const clickIcon = () => {
  dialogTable.value = true
}
const formClick = (val) => {
  dialogTable.value = false
  if (val) {
    emtiFilterList()
  }
}
const handleDragStart = (e, index, item) => {
  e.dataTransfer.setData('data', JSON.stringify({ index }))
  e.dataTransfer.dropEffect = 'move'
  dragItem = item
}

const handleDragOver = (e) => {
  e.dataTransfer.dropEffect = 'move'
}

const handleDragEnter = (e, item) => {
  e.dataTransfer.effectAllowed = 'move'
  if (dragItem === item) {
    return
  }

  const updateItems = [...tableData.value]
  const src = updateItems.indexOf(dragItem)
  const dst = updateItems.indexOf(item)
  updateItems.splice(dst, 0, ...updateItems.splice(src, 1))
  tableData.value = handleSort(updateItems)
}

// const transformTableData = (data: Array<TableOptionsProps>): Array<TableOptionsProps> => {
const transformTableData = (data: Array<TableOptionsProps>, config = props.tableConfig) => {
  const tableData = cloneDeep(data).map((temp) => {
    // const item = {} as TableOptionsProps
    const item = {}
    for (const key in config) {
      item[key] =
        temp[config[key]] !== undefined && temp[config[key]] !== null
          ? temp[config[key]]
          : DEFAULT_TABLE_CONFIG_VAl[key]
    }
    return item
  })
  return tableData
}

const handleSort = (data: Array<TableOptionsProps>) => {
  let tableData: Array<TableOptionsProps> = []
  tableData = data.map((item, index) => {
    item.sort = index
    return item
  })
  return tableData
}

const initTableData = (data: Array<TableOptionsProps>) => {
  const list = transformTableData(cloneDeep(data))
  return handleSort(list)
}

const emtiFilterList = () => {
  // 还原成外部传进来的值,方便外部table表格组件处理数据-(同时内部组件的初始化逻辑始终一致)
  const reverseTableConfig: any = {}
  for (const key in props.tableConfig) {
    reverseTableConfig[props.tableConfig[key]] = key
  }
  const restoreValue = transformTableData(tableData.value, reverseTableConfig)
  emits('confirm', restoreValue)
}

watch(
  () => props.tableList,
  (newVal) => {
    if (newVal?.length) {
      tableData.value = initTableData(newVal)
    } else {
      tableData.value = []
    }
  },
  {
    deep: true,
    immediate: true
  }
)
watch(
  () => props.tableConfig,
  () => {},
  {
    deep: true,
    immediate: true
  }
)
watch(
  () => props.iconSize,
  () => {},
  {
    deep: true,
    immediate: true
  }
)
</script>

<template>
  <div id="table-options">
    <Icon icon="ep:setting" :size="iconSize" style="cursor: pointer" @click="clickIcon" />
    <ElDialog width="80%" v-model="dialogTable" draggable>
      <div class="dialog-table">
        <ElTable
          class="!h-100% table-options-table"
          ref="elTableRef"
          :data="tableData"
          row-key="prop"
          border
          default-expand-all
        >
          <ElTableColumn
            v-for="item in columnData"
            :prop="item.prop"
            :key="item.prop"
            :label="item.label"
          >
            <template v-if="item.prop === 'originName'" #default="{ row }">
              <span>{{ row.originName }}</span>
            </template>
            <template v-else-if="item.prop === 'width'" #default="{ row }">
              <ElInput size="small" v-model="row.width" />
            </template>
            <template v-else-if="item.prop === 'isEnable'" #default="{ row }">
              <ElCheckbox v-model="row.isEnable" />
            </template>
            <template v-else-if="item.prop === 'fixed'" #default="{ row }">
              <el-select v-model="row.fixed" clearable placeholder="请选择左右固定">
                <el-option
                  v-for="dict in item.data"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </template>
          </ElTableColumn>
        </ElTable>
        <div class="table-config">
          <div class="table-config-title">排序</div>
          <div class="table-config-content">
            <div
              v-for="(item, index) in tableData"
              :key="item.prop"
              class="item"
              draggable="true"
              @dragstart="handleDragStart($event, index, item)"
              @dragover.prevent="handleDragOver($event)"
              @dragenter.prevent="handleDragEnter($event, item)"
            >
              {{ item.originName }}
            </div>
          </div>
        </div>
      </div>
      <div class="table-btn">
        <ElButton @click="formClick(false)">取消</ElButton>
        <ElButton class="m-0" type="primary" @click="formClick(true)"> 确认修改 </ElButton>
      </div>
    </ElDialog>
  </div>
</template>
<style scoped lang="scss">
.dialog-table {
  display: flex;
}
.table-btn {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 20px;
}
.table-config-title {
  white-space: nowrap;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border: 1px solid #eee;
  background: rgb(229, 229, 229);
}
.table-config-content .item {
  display: flex;
  align-items: center;
  height: 49px;
  padding: 0 8px;
  box-sizing: border-box;
  border: 1px solid #eee;
  border-top: none;
  cursor: move;
  white-space: nowrap;
}
.item:hover {
  background-color: #e5e5e5;
  transform: scale(1.2);
}
</style>
