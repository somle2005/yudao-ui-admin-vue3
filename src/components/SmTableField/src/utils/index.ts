export const DEFAULT_TABLE_CONFIG_VAl = {
  originName: '',
  prop: '',
  // width: '120px',
  // 'min-width': '120px',
  align: 'center',
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

const dealTableField = (data,tableOptions) => {
  // 传递过来的数据已经排好序了
  const list = data.filter((item) => item.isEnable)
  const filterData:any = []
  list.forEach((item) => {
      const source = tableOptions.find((option) => option.prop === item.prop)
      if(!source)  return
      const obj = Object.assign(source, item)
      filterData.push(obj)
  })
  console.log(data,'获取原先传递的数据格式-tableOptions数据', tableOptions)
  console.log(filterData,'filterData')
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
