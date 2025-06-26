// import { getUserId } from '@/utils/cache'
import { getUserConfigList, saveOrUpdateUserConfig } from '@/api/system/user'
import { WHOLE_ORDER_TYPE } from '@/hooks/common/wholeOrder'
import { cloneDeep } from 'lodash-es'

export const DEFAULT_TABLE_CONFIG_VAl = {
  // originLabel: '',
  prop: '',
  // width: '120px',
  // 'min-width': '120px',
  align: 'center',
  isEnable: true,
  sort: -1 // 后期会排序 后面出去排序按照index最小0 但是新增项要是-1排到最前面
}

export const TABLE_FIDLD_MAP = {
  originLabel: 'originLabel',
  label: 'label',
  prop: 'prop',
  width: 'width',
  align: 'align',
  isEnable: 'isEnable',
  sort: 'sort',
  fixed: 'fixed'
}

// 整单分行取值Map
export const WHOLE_ORDER_SAVE_DATA_MAP = {
  itemsList: 'itemsList',
  wholeOrderList: 'wholeOrderList'
}

export const TABLE_FIDLD_SUFFIX_MAP = {
  enable: 'enable' // 可用列表
}

// 添加额外补充字段比如原字段-显示字段-进行区分
export const addFieldProp = (data: any[]) => {
  //  originLabel: 'originLabel', label
  return cloneDeep(data).map((item) => {
    if (!item.saveFlag) {
      item.originLabel = item.label
      item.isEnable = DEFAULT_TABLE_CONFIG_VAl.isEnable
      item.sort = DEFAULT_TABLE_CONFIG_VAl.sort
      item.width = Number(item.width.toString().replace('px', ''))
    }
    return item
  })
}

const tableFieldConfigKey = 'tableFieldConfig'

/**
 * 一个页面也有可能存在多个表格数据-多个配置
 * 一个页面只有一个唯一CacheKey 但是这个key下面可以有多个属性对象 (如果有多个key人为进行设置很容易进行冲突)
 * 外部自行拿到 getTableFieldOptions和saveTableFieldConfig进行处理
 * 一个页面很容易有多个表格-弹窗=== 所以默认自行做成多属性对象配置
 *
 * 后面大概率要改成接口调用-所以还是层级低一些好(key value格式给接口)
 * http://localhost/erp/purchase/return?abc=3 pathName经过检验不会带上url参数后缀可以作为唯一页面key
 */

/**
  saveOrUpdateUserConfig(data: { configKey: string; configValue: string })
  getUserConfigList(configKey)
 */
/**
 *   cachekey默认使用查询接口字符串 例如/system/user-config/page 但是为了去重可以后面自己 + -1 -2 进行去重
 *   携带这个路径的话 window.location.pathname 就会无法复用暂时去掉 唯一性交给用户cachekey去处理 去重可以比如加统一前缀 enable
 */
const getCacheKey = (cachekey: string) => {
  // tableFieldConfigKey + path+userId作为key
  // return tableFieldConfigKey + '-' + getUserId() + '-' + window.location.pathname
  return tableFieldConfigKey + '-' + cachekey
}

// 直接取cachekey减少歧义
export const getTableFieldOptions = async (cachekey: string) => {
  // const configKey = getCacheKey(cachekey)
  const configKey = cachekey
  const data = await getUserConfigList({ configKey })

  let configValue = ''
  if (data?.list?.length) {
    configValue = data.list[0].configValue
  }

  // 一般列表空数组-整单分行{itemsList,wholeOrderList}
  return configValue ? JSON.parse(configValue) : configValue
}

// dataCacheKey
export const saveTableFieldConfig = async (data, configKey) => {
  try {
    const cache = { configKey, configValue: JSON.stringify(data) }
    await saveOrUpdateUserConfig(cache)
  } catch (e) {
    console.log(e, '报错缓存处理')
  }
}

export const saveWholeOrderTableFieldConfig = async (data, configKey) => {
  try {
    const cacheData = (await getTableFieldOptions(configKey)) || {}
    Object.assign(cacheData, data)
    const cache = { configKey, configValue: JSON.stringify(cacheData) }
    await saveOrUpdateUserConfig(cache)
  } catch (e) {
    console.log(e, '报错缓存处理')
  }
}

// 有问题的时候注意清空缓存
export const clearTableFieldConfig = (configKey) => {
  // configValue可以为空-等架构师操作
  const itemsList = [
    {
      originLabel: '单据日期',
      label: '单据日期',
      prop: 'billTime',
      width: 180,
      align: 'center',
      isEnable: true,
      sort: 0,
      sortable: true,
      saveFlag: true
    },
    {
      originLabel: '行编号',
      label: '行编号',
      prop: 'purchaseOrderId',
      width: 100,
      align: 'center',
      isEnable: true,
      sort: 1,
      noWidth: true,
      wholeOrderEnable: 'items',
      saveFlag: true
    },
    {
      originLabel: '单据编码',
      label: '单据编码',
      prop: 'code',
      width: 200,
      align: 'center',
      isEnable: true,
      sort: 2,
      slot: 'code',
      wrap: true,
      saveFlag: true
    },
    {
      originLabel: '申请人',
      label: '申请人',
      prop: 'applicant',
      width: 100,
      align: 'center',
      isEnable: true,
      sort: 3,
      noWidth: true,
      saveFlag: true
    },
    {
      originLabel: '申请部门',
      label: '申请部门',
      prop: 'applicationDept',
      width: 150,
      align: 'center',
      isEnable: true,
      sort: 4,
      slot: 'applicationDept',
      wrap: true,
      saveFlag: true
    },
    {
      originLabel: '审核状态',
      label: '审核状态',
      prop: 'auditStatus',
      width: 120,
      align: 'center',
      isEnable: true,
      sort: 5,
      slot: 'auditStatus',
      saveFlag: true
    },
    {
      originLabel: '订购状态',
      label: '订购状态',
      prop: 'orderStatus',
      width: 120,
      align: 'center',
      isEnable: true,
      sort: 6,
      slot: 'orderStatus',
      saveFlag: true
    },
    {
      originLabel: '关闭状态',
      label: '关闭状态',
      prop: 'offStatus',
      width: 120,
      align: 'center',
      isEnable: true,
      sort: 7,
      slot: 'offStatus',
      saveFlag: true
    },
    {
      originLabel: '未订购数量',
      label: '未订购数量',
      prop: 'itemsUnOrderCount',
      width: 100,
      align: 'center',
      isEnable: true,
      sort: 8,
      noWidth: true,
      wholeOrderEnable: 'items',
      saveFlag: true
    },
    {
      originLabel: '已订购数量',
      label: '已订购数量',
      prop: 'itemsOrderClosedQty',
      width: 100,
      align: 'center',
      isEnable: true,
      sort: 9,
      noWidth: true,
      wholeOrderEnable: 'items',
      saveFlag: true
    },
    {
      originLabel: '已入库数量',
      label: '已入库数量',
      prop: 'itemsInboundClosedQty',
      width: 100,
      align: 'center',
      isEnable: true,
      sort: 10,
      noWidth: true,
      wholeOrderEnable: 'items',
      saveFlag: true
    },
    {
      originLabel: '行采购状态',
      label: '行采购状态',
      prop: 'itemsOrderStatus',
      width: 100,
      align: 'center',
      isEnable: true,
      sort: 11,
      noWidth: true,
      slot: 'itemsOrderStatus',
      wholeOrderEnable: 'items',
      saveFlag: true
    },
    {
      originLabel: '行关闭状态',
      label: '行关闭状态',
      prop: 'itemsOffStatus',
      width: 100,
      align: 'center',
      isEnable: true,
      sort: 12,
      noWidth: true,
      slot: 'itemsOffStatus',
      wholeOrderEnable: 'items',
      saveFlag: true
    },
    {
      originLabel: '产品编码',
      label: '产品编码',
      prop: 'itemsCode',
      width: 200,
      align: 'center',
      isEnable: true,
      sort: 13,
      slot: 'itemsCode',
      wrap: true,
      wholeOrderEnable: 'items',
      saveFlag: true
    },
    {
      originLabel: '产品名称',
      label: '产品名称',
      prop: 'itemsProductName',
      width: 200,
      align: 'center',
      isEnable: true,
      sort: 14,
      slot: 'productName',
      wrap: true,
      wholeOrderEnable: 'items',
      saveFlag: true
    },
    {
      originLabel: '海关品名',
      label: '海关品名',
      prop: 'itemsDeclaredType',
      width: 200,
      align: 'center',
      isEnable: true,
      sort: 15,
      slot: 'declaredType',
      wrap: true,
      wholeOrderEnable: 'items',
      saveFlag: true
    },
    {
      originLabel: '海关品名(英文)',
      label: '海关品名(英文)',
      prop: 'itemsDeclaredTypeEn',
      width: 200,
      align: 'center',
      isEnable: true,
      sort: 16,
      slot: 'declaredTypeEn',
      wrap: true,
      wholeOrderEnable: 'items',
      saveFlag: true
    },
    {
      originLabel: '单位',
      label: '单位',
      prop: 'itemsProductUnitName',
      width: 100,
      align: 'center',
      isEnable: true,
      sort: 17,
      noWidth: true,
      wholeOrderEnable: 'items',
      saveFlag: true
    },
    {
      originLabel: '申请数量',
      label: '申请数量',
      prop: 'itemsQty',
      width: 100,
      align: 'center',
      isEnable: true,
      sort: 18,
      noWidth: true,
      wholeOrderEnable: 'items',
      saveFlag: true
    },
    {
      originLabel: '批准数量',
      label: '批准数量',
      prop: 'itemsApprovedQty',
      width: 100,
      align: 'center',
      isEnable: true,
      sort: 19,
      noWidth: true,
      wholeOrderEnable: 'items',
      saveFlag: true
    },
    {
      originLabel: '参考单价',
      label: '参考单价',
      prop: 'itemsReferenceUnitPrice',
      width: 100,
      align: 'center',
      isEnable: true,
      sort: 20,
      noWidth: true,
      wholeOrderEnable: 'items',
      saveFlag: true
    },
    {
      originLabel: '含税单价',
      label: '含税单价',
      prop: 'itemsGrossPrice',
      width: 100,
      align: 'center',
      isEnable: true,
      sort: 21,
      noWidth: true,
      wholeOrderEnable: 'items',
      saveFlag: true
    },
    {
      originLabel: '税额',
      label: '税额',
      prop: 'itemsTax',
      width: 100,
      align: 'center',
      isEnable: true,
      sort: 22,
      noWidth: true,
      wholeOrderEnable: 'items',
      saveFlag: true
    },
    {
      originLabel: '价税合计',
      label: '价税合计',
      prop: 'itemsGrossTotalPrice',
      width: 100,
      align: 'center',
      isEnable: true,
      sort: 23,
      noWidth: true,
      wholeOrderEnable: 'items',
      saveFlag: true
    },
    {
      originLabel: '制单人',
      label: '制单人',
      prop: 'creator',
      width: 100,
      align: 'center',
      isEnable: true,
      sort: 24,
      noWidth: true,
      saveFlag: true
    },
    {
      originLabel: '制单时间',
      label: '制单时间',
      prop: 'createTime',
      width: 180,
      align: 'center',
      isEnable: true,
      sort: 25,
      sortable: true,
      saveFlag: true
    },
    {
      originLabel: '审核意见',
      label: '审核意见',
      prop: 'auditAdvice',
      width: 200,
      align: 'center',
      isEnable: true,
      sort: 26,
      slot: 'auditAdvice',
      wrap: true,
      saveFlag: true
    },
    {
      originLabel: '审核人',
      label: '审核人',
      prop: 'auditor',
      width: 100,
      align: 'center',
      isEnable: true,
      sort: 27,
      noWidth: true,
      saveFlag: true
    },
    {
      originLabel: '审核时间',
      label: '审核时间',
      prop: 'auditTime',
      width: 180,
      align: 'center',
      isEnable: true,
      sort: 28,
      sortable: true,
      saveFlag: true
    },
    {
      originLabel: '期望到货日期',
      label: '期望到货日期',
      prop: 'expectArrivalDate',
      width: 180,
      align: 'center',
      isEnable: true,
      sort: 29,
      sortable: true,
      saveFlag: true
    },
    {
      originLabel: '操作',
      label: '操作',
      prop: 'operate',
      width: 320,
      align: 'center',
      isEnable: true,
      sort: 30,
      fixed: 'right',
      slot: 'operate',
      saveFlag: true
    }
  ]
  saveOrUpdateUserConfig({ configKey, configValue: JSON.stringify({ itemsList }) })
  // saveOrUpdateUserConfig({ configKey, configValue: '' })
}

const transformTableFieldConfig = (tableOptions) => {
  // 如果没有缓存或者数据库数据 初始化
  const persistData = getTableFieldOptions()
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
    getTableFieldOptions,
    transformTableFieldConfig,
    dealTableField
  }
}

// 整单分行处理
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
    const cache = getTableFieldOptions()
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
