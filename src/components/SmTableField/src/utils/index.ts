import { WHOLE_ORDER_TYPE } from '@/hooks/common/wholeOrder'
import { getUserId } from '@/utils/cache'

export const DEFAULT_TABLE_CONFIG_VAl = {
  originName: '',
  prop: '',
  // width: '120px',
  // 'min-width': '120px',
  align: 'center',
  isEnable: true,
  sort: 0 // 后期会排序
}

const tableFieldConfigKey = 'tableFieldConfig'

/**
 * 一个页面也有可能存在多个表格数据-多个配置
 * 一个页面只有一个唯一CacheKey 但是这个key下面可以有多个属性对象 (如果有多个key人为进行设置很容易进行冲突)
 * 外部自行拿到 getTableFieldConfig和saveTableFieldConfig进行处理
 * 一个页面很容易有多个表格-弹窗=== 所以默认自行做成多属性对象配置
 *
 * 后面大概率要改成接口调用-所以还是层级低一些好(key value格式给接口)
 */
const getCacheKey = () => {
  // tableFieldConfigKey + path+userId作为key
  return tableFieldConfigKey + '-' + getUserId() + '-' + window.location.pathname
}

const getTableFieldConfig = () => {
  const data = localStorage.getItem(getCacheKey())
  return data ? JSON.parse(data) : {}
}

const saveTableFieldConfig = (data, dataCacheKey) => {
  try {
    const cacheDataStr = localStorage.getItem(getCacheKey())
    const cacheData = cacheDataStr ? JSON.parse(cacheDataStr) : {}
    cacheData[dataCacheKey] = data
    localStorage.setItem(getCacheKey(), JSON.stringify(cacheData))
  } catch (e) {
    console.log(e, '报错缓存处理')
  }
}

const transformTableFieldConfig = (tableOptions) => {
  // 如果没有缓存或者数据库数据 初始化
  const persistData = getTableFieldConfig()
  if (!persistData?.length) return tableOptions
  return persistData
}

const dealTableField = (data, tableOptions) => {
  // 传递过来的数据已经排好序了
  const list = data.filter((item) => item.isEnable)
  const filterData: any = []
  list.forEach((item) => {
    const source = tableOptions.find((option) => option.prop === item.prop)
    if (!source) return
    const obj = Object.assign(source, item)
    filterData.push(obj)
  })
  // console.log(data,'获取原先传递的数据格式-tableOptions数据', tableOptions)
  // console.log(filterData,'filterData')
  return filterData
}

export const useSmTableField = (tableOptions) => {
  const tableFieldColumnList = ref([]) // 列表

  tableFieldColumnList.value = transformTableFieldConfig(tableOptions)

  return {
    tableFieldColumnList,
    saveTableFieldConfig,
    getTableFieldConfig,
    transformTableFieldConfig,
    dealTableField
  }
}

export const useTableFieldConfigConfirm = (
  dataCacheKey,
  tableFieldColumnList,
  allTableOptions,
  tableOptions
) => {
  // todo整单分行要做区分通过create整单分行区分
  const tableFieldConfigConfirm = (data) => {
    saveTableFieldConfig(data, dataCacheKey)
    tableFieldColumnList.value = data
    // 处理表格数据
    console.log('tableFieldConfigConfirm', data)
    // 如果是整单分行还要特殊处理
    tableOptions.value = dealTableField(data, allTableOptions.value)
  }
  return tableFieldConfigConfirm
}


export const useTableFieldConfigConfirmWholeOrder = (
  wholeOrderEnable,
  dataCacheKey,
  tableFieldColumnList,
  allTableOptions,
  tableOptions
) => {
  // todo整单分行要做区分通过create整单分行区分
  const tableFieldConfigConfirmWholeOrder = (data) => {

    // 内部有兜底处理成对象{}
    const cache = getTableFieldConfig()
    // 区分-分行整单作为key
    const cacheKey = wholeOrderEnable.value ? WHOLE_ORDER_TYPE.wholeOrder : WHOLE_ORDER_TYPE.items
    cache[dataCacheKey] = cache[dataCacheKey] || {}
    cache[dataCacheKey][cacheKey] = data


    saveTableFieldConfig(cache, dataCacheKey)
    tableFieldColumnList.value = data
    // 处理表格数据
    console.log('tableFieldConfigConfirm', data)
    // 如果是整单分行还要特殊处理
    tableOptions.value = dealTableField(data, allTableOptions.value)
  }
  return tableFieldConfigConfirmWholeOrder
}