import { AccountApi } from '@/api/erp/finance/account'
import { AccountVO } from '@/api/mp/account'
import { defaultProps, handleTree } from '@/utils/tree'
import { getSimpleDeptList } from '@/api/system/dept'
import { SupplierProductApi, SupplierProductVO } from '@/api/erp/purchase/product'
import { WarehouseApi, WarehouseVO } from '@/api/erp/stock/warehouse'
import { ProductApi, ProductVO, ProductVOSelectItem } from '@/api/erp/product/product'
import { cloneDeep } from 'lodash-es'
import { getSimpleUserList, UserVO } from '@/api/system/user'
import {CustomRuleCategoryApi} from '@/api/erp/logistic/custom-category'
import { ShopApi } from '@/api/erp/sale/shop'

interface SelectProp {
  value: number
  label: string
  type: string
}

// 获取部门编号列表
export const getDeptTree = (data?: any) => {
  const deptList = ref<Tree[]>([]) // 树形结构
  // 加载部门树
  // deptList.value = handleTree(await getSimpleDeptList())
  getSimpleDeptList().then((res) => {
    deptList.value = handleTree(res)
    if (data) {
      data.value = deptList.value
    }
  })
  return {
    deptList,
    defaultProps
  }
}

// 获取结算账户列表
export const getAccountList = () => {
  const accountList = ref<AccountVO[]>([]) // 账户列表
  // 加载账户列表
  AccountApi.getAccountSimpleList().then((res) => {
    accountList.value = res
  })
  return accountList
}

// 供应商产品编号列表
export const getSupplierProductList = (data?: any) => {
  const supplierProductList = ref<SupplierProductVO[]>([]) // 账户列表
  // 加载账户列表
  SupplierProductApi.getSupplierProductSimpleList().then((res) => {
    supplierProductList.value = res.map((item) => {
      item.label = item.code
      item.value = item.id
      item.type = 'option'
      return item
    })
    if (data) {
      data.value = supplierProductList.value
    }
  })
  return supplierProductList
}

// 获取仓库下拉列表
export const getWarehouseList = () => {
  const warehouseList = ref<WarehouseVO[]>([]) // 账户列表
  // 加载账户列表
  WarehouseApi.getWarehouseSimpleList().then((res) => {
    warehouseList.value = res.map((item) => {
      item.label = item.name
      item.value = item.id
      item.type = 'option'
      return item
    })
  })
  return warehouseList
}
// 获取产品列表
export const getProductList = (data?: any) => {
  const productList = ref<ProductVO[]>([]) // 产品列表
  ProductApi.getProductSimpleList().then((res) => {
    productList.value = res.map((item) => {
      item.label = item.name + '  ' + item.barCode
      item.value = item.id
      item.type = 'option'
      return item
    })
    if (data) {
      data.value = productList.value
    }
  })
  return productList
}

function getSelectItemList(list: Array<any>, key: string) {
  // 后期可以加一个valueKey适配value不同
  const map = {}
  const arr: any = []
  list.forEach((item) => {
    item.label = item[key]
    item.value = item[key]
    if (!map[item[key]]) {
      map[item[key]] = true
      arr.push(item)
    }
    return item
  })
  return arr.filter((item) => item.label)
}
// 搜索产品名称的数据
export const getProductNameList = () => {
  const productMap = {
    productNameList: ref<ProductVOSelectItem[]>([]), // 产品列表
    productSkuList: ref<ProductVOSelectItem[]>([]), // 产品sku列表
    productSeriesList: ref<ProductVOSelectItem[]>([]), // 产品系列列表
    productBrandList: ref<ProductVOSelectItem[]>([]) // 产品品牌列表
  }

  const tempList = [
    {
      productMapKey: 'productNameList',
      key: 'name'
    },
    {
      productMapKey: 'productSkuList',
      key: 'barCode'
    },
    {
      productMapKey: 'productSeriesList',
      key: 'series'
    },
    {
      productMapKey: 'productBrandList',
      key: 'brand'
    }
  ]
  ProductApi.getProductSimpleList().then((res) => {
    tempList.forEach((item) => {
      const arr = getSelectItemList(cloneDeep(res), item.key)
      productMap[item.productMapKey].value = arr
    })
  })
  return productMap
}

// 获取用户列表
export const getUserList = (data?: any) => {
  const userList = ref<(UserVO & SelectProp)[]>([]) // 用户列表
  getSimpleUserList().then((res: any) => {
    userList.value = res.map((item) => {
      item.label = item.nickname
      item.value = item.id
      item.type = 'option'
      return item
    })
    if (data) {
      data.value = userList.value
    }
  })
  return userList
}

// 获得海关分类组合值精简列表
export const getCustomRuleCategoryList = (data?: any) => {
  const customRuleCategoryList = ref<any[]>([]) // 用户列表
  CustomRuleCategoryApi.getCustomRuleCategorySimpleList().then((res: any) => {
    customRuleCategoryList.value = res.map((item) => {
      item.label = item.combinedValue
      item.value = item.customCategoryId
      item.type = 'option'
      return item
    })
    if (data) {
      data.value = customRuleCategoryList.value
    }
  })
  return customRuleCategoryList
}

// 获得店铺清单列表
export const getShopList = (data?: any) => {
  const shopList = ref<any[]>([]) // 用户列表
  ShopApi.getShopList().then((res: any) => {
    shopList.value = res.map((item) => {
      item.label = item.name
      item.value = item.id
      item.type = 'option'
      return item
    })
    if (data) {
      data.value = shopList.value
    }
  })
  return shopList
}