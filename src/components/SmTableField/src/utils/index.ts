export const DEFAULT_TABLE_CONFIG_VAl = {
  originName: '',
  prop: '',
  // width: '120px',
  // 'min-width': '120px',
  isEnable: true,
  sort: 0, // 后期会排序
}

const tableFieldConfigKey = 'tableFieldConfig'



const getTableFieldConfig = () => {
  const data = localStorage.getItem(tableFieldConfigKey)
  return data ? JSON.parse(data) : []
}
const saveTableFieldConfig = (data) => {
  localStorage.setItem(tableFieldConfigKey, JSON.stringify(data))
}

const transformTableFieldConfig = (tableOptions) => {
  // 如果没有缓存或者数据库数据 初始化
  const persistData = getTableFieldConfig()
  if(!persistData?.length)  return tableOptions
  return persistData
}

export const useSmTableField = (tableOptions) => {
  const tableFieldColumnList = ref([]) // 列表

  tableFieldColumnList.value = transformTableFieldConfig(tableOptions)
  
  return {
    tableFieldColumnList,
    saveTableFieldConfig,
    getTableFieldConfig,
    transformTableFieldConfig
  }
}
