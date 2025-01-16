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
        sort: 'sort'
      }
    }
  },
  tableList: {
    type: Array as PropType<Array<any>>,
    defalult: () => {
      return []
    }
  },
  modelValue: {
    type: Array as PropType<Array<TableOptionsConfigProps>>,
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
let isInit = true // 点击确认保存后不再是初始化

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
  }
]

const tableData = ref<Array<any>>([])
let allSaveData: any = []
const emits = defineEmits(['update:modelValue','restoreValue'])

let dragItem: any = {}

const clickIcon = () => {
  dialogTable.value = true
  if (props?.modelValue?.length) {
    // tableData.value = handleConfigList(props.modelValue)
    tableData.value = mergeList(props.tableList!)
  }
}
const formClick = (val) => {
  dialogTable.value = false
  if (val) {
    isInit = false
    allSaveData = cloneDeep(tableData.value)
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
      item[key] = (temp[config[key]]!==undefined && temp[config[key]]!== null) ? temp[config[key]] : DEFAULT_TABLE_CONFIG_VAl[key]
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

const handleConfigList = (data: Array<TableOptionsConfigProps>) => {
  return cloneDeep(data).sort((a, b) => a.sort - b.sort)
}

/**
 * 全量数据和外部传入数据isEnable数据进行比对。
 */
const mergeList = (data: Array<TableOptionsProps>) => {
  /**
   * 外部传入配置要和内部所有点击确认 内存中的allSaveData配置进行对比
   * 读取全量的值进行使用 保存使用配置的值 因为取消的话要重读配置
   * 使用外部传入的props.modelValue 进行配置 然后进行排序
   */

  let allTableDataConfig = props.modelValue
  if (allSaveData?.length) {
    props.modelValue?.forEach((item) => {
      const commonIndex = allSaveData.findIndex((a) => a.prop === item.prop)
      if (commonIndex >= 0) {
        allSaveData[commonIndex] = item
      }
    })
    allTableDataConfig = allSaveData
  }

  const allTableData = cloneDeep(initTableData(data)) as TableOptionsConfigProps[]

  allTableDataConfig?.forEach((item) => {
    const commonIndex = allTableData.findIndex((a) => a.prop === item.prop)
    if (commonIndex >= 0) {
      allTableData[commonIndex] = item
    }
  })

  return handleSort(handleConfigList(allTableData))
}

const emtiFilterList = () => {

  const data = tableData.value.filter((item) => item.isEnable)
  console.log('emtiFilterList', data)
  emits('update:modelValue',data)
  
  // 还原成外部传进来的值,方便外部table表格组件处理数据
  const reverseTableConfig:any = {}
  for (const key in props.tableConfig) {
    reverseTableConfig[props.tableConfig[key]] = key
  }
  const restoreValue = transformTableData(data,reverseTableConfig)
  emits('restoreValue', restoreValue)
}

watch(
  () => props.tableList,
  (newVal) => {
    if (newVal?.length && !props?.modelValue?.length) {
      tableData.value = initTableData(newVal)
      if (isInit && !props?.modelValue?.length) {
        emtiFilterList()
      }
    }
  },
  {
    deep: true,
    immediate: true
  }
)
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal?.length) {
      tableData.value = mergeList(props.tableList!)
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
        <ElButton class="m-0" type="primary" @click="formClick(true)">
          确认修改
        </ElButton>
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
