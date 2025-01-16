export const DEFAULT_TABLE_CONFIG_VAl = {
  originName: '',
  prop: '',
  width: '120px',
  isEnable: true,
  sort: 0 // 后期会排序
}

export const useSmTableField = (tableOptions) => {
  const tableFieldConfigList = ref([]) // 表格配置项
  const tableFieldColumnList = ref([]) // 列表
  const tableFieldConfigKey = 'tableFieldConfig'

  const saveTableFieldConfig = (data = tableFieldConfigList.value) => {
    localStorage.setItem(tableFieldConfigKey, JSON.stringify(data))
  }
  const getTableFieldConfig = () => {
    const data = localStorage.getItem(tableFieldConfigKey)
    return data ? JSON.parse(data) : []
  }

  const transformTableFieldConfig = (tableOptions) => {
    // 如果没有缓存或者数据库数据 初始化
    const persistData = getTableFieldConfig()
    console.log('persistData', persistData)
    if(!persistData?.length)  return tableOptions

    return persistData
  }
  tableFieldColumnList.value = transformTableFieldConfig(tableOptions)

  const dealTableOption = (tableOptions) => {
    console.log('处理tableOptions', tableOptions)
    return tableOptions
  }
  return {
    tableFieldConfigList,
    tableFieldColumnList,
    saveTableFieldConfig,
    getTableFieldConfig,
    dealTableOption,
    transformTableFieldConfig
  }
}
