<template>
  <div id="table-options">
    <Icon icon="ep:setting" :size="iconSize" style="cursor: pointer" @click="clickIcon" />
    <ElDialog :width="dialogWidth" v-model="dialogTable" draggable>
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
            :width="item.width"
            align="center"
          > 
            <!-- 方便注释label -->
            <template v-if="item.prop === 'originLabel'" #default="{ row }">
              <span>{{ row.originLabel }}</span>
            </template>
            <template v-else-if="item.prop === 'label'" #default="{ row }">
              <ElInput size="small" v-model="row.label" />
            </template>
            <template v-else-if="item.prop === 'width'" #default="{ row }">
              <SmNumber size="small" v-model="row.width" />
            </template>
            <template v-else-if="item.prop === 'isEnable'" #default="{ row }">
              <ElCheckbox v-model="row.isEnable" />
            </template>
            <!-- <template v-else-if="item.prop === 'align'" #default="{ row }">
              <el-select v-model="row.align" clearable placeholder="请选择左右固定">
                <el-option
                  v-for="dict in item.data"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
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
            </template> -->
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
              {{ item.originLabel }}
            </div>
          </div>
        </div>
      </div>
      <div class="table-btn">
        <ElButton @click="formClick(false)">取消</ElButton>
        <ElButton v-loading="loading" class="m-0" type="primary" @click="formClick(true)">
          确认修改
        </ElButton>
      </div>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@/components/Icon'
import { PropType, ref, watch } from 'vue'
import {
  DEFAULT_TABLE_CONFIG_VAl,
  saveTableFieldConfig,
  saveWholeOrderTableFieldConfig,
  TABLE_FIDLD_MAP,
  WHOLE_ORDER_SAVE_DATA_MAP
} from './utils'
import { cloneDeep, debounce } from 'lodash-es'

// 加配置项不要忘记在 SmTable里面进行处理操作
const props = defineProps({
  // 处理字段映射关系
  tableFieldMap: {
    type: Object as PropType<TableOptionsConfig>,
    default: () => {
      return TABLE_FIDLD_MAP
    }
  },
  tableFieldOptions: {
    type: Array as PropType<Array<any>>,
    default: () => {
      return []
    }
  },
  // 开启之后才是必填项
  tableFieldKey: {
    type: String,
    default: ''
  },
  iconSize: {
    type: Number,
    default: 25
  },
  // 是否开启整单分行表格配置项模式
  isWholeOrder: {
    type: Boolean,
    default: false
  },
  wholeOrderEnable: {
    type: Boolean,
    default: false
  }
})

const message = useMessage() // 消息弹窗

const dialogTable = ref(false)
const loading = ref(false)

// 这里还可以进行扩展提示-比如字段要求 排顺序可以把sort字段放出来
const columnData = [
  {
    prop: 'originLabel',
    label: '原名称',
    width: '150px'
  },
  // 留给多语言用户改字段
  {
    prop: 'label',
    label: '显示名称',
    width: '150px'
  },
  {
    prop: 'isEnable',
    label: '是否启用',
    width: '100px'
  },
  // 后续如果必要再扩展右侧单位下拉框
  {
    prop: 'width',
    label: '宽度(px)',
    width: '100px'
  },
  {
    prop: 'prop',
    label: '列prop',
    width: '200px'
  }
  // {
  //   prop: 'align',
  //   label: '居中方式',
  //   data: [
  //     {
  //       label: '左',
  //       value: 'left'
  //     },
  //     {
  //       label: '中',
  //       value: 'center'
  //     },
  //     {
  //       label: '右',
  //       value: 'right'
  //     }
  //   ]
  // },
  // {
  //   prop: 'fixed',
  //   label: '是否固定',
  //   data: [
  //     {
  //       label: '左固定',
  //       value: 'left'
  //     },
  //     {
  //       label: '右固定',
  //       value: 'right'
  //     }
  //   ]
  // }
]
const extraWidth = 240 // 包含table-config 200宽度+其余列paddding40
let dialogWidth =
  columnData.reduce((prev, cur) => {
    const { width } = cur
    if (width) {
      return (prev += Number(width.replace('px', '')))
    }
    return prev
  }, 0) +
  extraWidth +
  'px'

const tableData = ref<Array<any>>([])
const emits = defineEmits(['update:modelValue', 'TableField-confirm'])

let dragItem: any = {}

const clickIcon = () => {
  dialogTable.value = true
  // 重置数据 取消-右上角关闭按钮
  tableData.value = initTableData(cloneDeep(props.tableFieldOptions))
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

// 交换的时候替你排序了
const handleDragEnter = debounce((e, item) => {
  e.dataTransfer.effectAllowed = 'move'
  if (dragItem === item) {
    return
  }
  const updateItems = [...tableData.value]
  const src = updateItems.indexOf(dragItem)
  const dst = updateItems.indexOf(item)
  updateItems.splice(dst, 0, ...updateItems.splice(src, 1))
  tableData.value = handleSort(updateItems)
}, 100)

// const transformTableData = (data: Array<TableOptionsProps>): Array<TableOptionsProps> => {
// 通过对比是否有属性值-带上默认属性值  reverseTableConfig传递还原成外部传入的
// const transformTableData = (data: Array<TableOptionsProps>, config = props.tableFieldMap
const transformTableData = (data: Array<TableOptionsProps>, config) => {
  const tableData = cloneDeep(data).map((temp) => {
    // const item = {} as TableOptionsProps
    const item = {}
    for (const key in config) {
      // item[key] =
      //   temp[config[key]] !== undefined && temp[config[key]] !== null
      //     ? temp[config[key]]
      //     : DEFAULT_TABLE_CONFIG_VAl[key]
      item[key] = temp[config[key]]
    }
    Object.assign(item, temp)
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
  // const list = transformTableData(cloneDeep(data))
  const list = cloneDeep(data)
  return handleSort(list)
}

// 判断是不是单表还是整单分行表 取整单分行状态进行判断-存储的是整单还是分行
const createSaveData = (restoreValue) => {
  if (!props.isWholeOrder) return restoreValue
  return props.wholeOrderEnable
    ? { [WHOLE_ORDER_SAVE_DATA_MAP.wholeOrderList]: restoreValue }
    : { [WHOLE_ORDER_SAVE_DATA_MAP.itemsList]: restoreValue }
}

const emtiFilterList = async () => {
  try {
    // 还原成外部传进来的值,方便外部table表格组件处理数据-(同时内部组件的初始化逻辑始终一致)
    const reverseTableConfig: any = {}
    for (const key in props.tableFieldMap) {
      reverseTableConfig[props.tableFieldMap[key]] = key
    }
    const restoreValue = transformTableData(tableData.value, reverseTableConfig)
    // 需要有保存标记字段saveFlag=true 确保有没有保存过 内部addFieldProp才会带上默认值和扩展字段
    restoreValue.forEach((item: any) => {
      item.saveFlag = true
    })

    console.log(restoreValue, 'restoreValue')
    const saveData = createSaveData(restoreValue)

    if (props.isWholeOrder) {
      await saveWholeOrderTableFieldConfig(saveData, props.tableFieldKey)
    } else {
      await saveTableFieldConfig(saveData, props.tableFieldKey)
    }

    message.success('保存成功')

    // 还是得交给外部处理整单分行-交换的位置的时候已经排序了所以restoreValue无需排序
    emits('TableField-confirm', restoreValue, cloneDeep(tableData.value))
  } finally {
    loading.value = false
  }
}

watch(
  () => props.tableFieldOptions,
  (newVal) => {
    if (newVal?.length) {
      tableData.value = initTableData(cloneDeep(newVal))
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
  () => props.tableFieldMap,
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
.table-config {
  width: 200px; // 这里如果修改了记得修改上面的extraWidth 
}
.table-config-title {
  // 这里如果修改了记得修改上面的extraWidth 
  width: 200px;
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
