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
  saveOrUpdateUserConfig({ configKey, configValue: '' })
}


