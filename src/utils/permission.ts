// import { DictDataVO, getSimpleDictDataList } from '@/api/system/dict/dict.data'
// const { wsCache } = useCache('sessionStorage')
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import { useDictStoreWithOut } from '@/store/modules/dict'
import {hasPermission} from "@/directives/permission/hasPermi";


const { t } = useI18n() // 国际化

/**
 * 字符权限校验
 * @param {Array} value 校验值
 * @returns {Boolean}
 */
export function checkPermi(permission: string[]) {
  return hasPermission(permission)
}

/**
 * 角色权限校验
 * @param {string[]} value 校验值
 * @returns {Boolean}
 */
export function checkRole(value: string[]) {
  if (value && value instanceof Array && value.length > 0) {
    const { wsCache } = useCache()
    const permissionRoles = value
    const super_admin = 'super_admin'
    const userInfo = wsCache.get(CACHE_KEY.USER)
    const roles = userInfo?.roles || []
    const hasRole = roles.some((role: string) => {
      return super_admin === role || permissionRoles.includes(role)
    })
    return !!hasRole
  } else {
    console.error(t('permission.hasRole'))
    return false
  }
}

export async function resetDictCache(){
  // sessionStorage.removeItem(CACHE_KEY.DICT_CACHE)
  // wsCache.delete(CACHE_KEY.DICT_CACHE)
  // window.wsCahce= wsCache
  const dictStore = useDictStoreWithOut()
  dictStore.resetDict()
  console.log(dictStore,'dictStore-重置缓存')
}