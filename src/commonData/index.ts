import { AccountApi } from "@/api/erp/finance/account"
import { AccountVO } from "@/api/mp/account"
import { defaultProps, handleTree } from '@/utils/tree'
import  {getSimpleDeptList} from '@/api/system/dept'
import { SupplierProductApi, SupplierProductVO } from "@/api/erp/purchase/product"
import { WarehouseApi, WarehouseVO } from "@/api/erp/stock/warehouse"
import { ProductApi, ProductVO, ProductVOSelectItem } from "@/api/erp/product/product"
import { cloneDeep } from "lodash-es"

// 获取部门编号列表
export const getDeptTree = () => {
  const deptList = ref<Tree[]>([]) // 树形结构
  // 加载部门树
  // deptList.value = handleTree(await getSimpleDeptList())
  getSimpleDeptList().then(res => {
    deptList.value = handleTree(res)
  })
  return {
    deptList,
    defaultProps
  }
}


// 获取结算账户列表
export const getAccountList =  () => {
  const accountList = ref<AccountVO[]>([]) // 账户列表
  // 加载账户列表
  AccountApi.getAccountSimpleList().then(res => {
    accountList.value = res
  })
  return accountList
}

// 供应商产品编号列表
export const getSupplierProductList =  () => {
  const supplierProductList = ref<SupplierProductVO[]>([]) // 账户列表
  // 加载账户列表
  SupplierProductApi.getSupplierProductSimpleList().then(res => {
    supplierProductList.value = res
  })
  return supplierProductList
}

// 获取仓库下拉列表
export const getWarehouseList =  () => {
  const warehouseList = ref<WarehouseVO[]>([]) // 账户列表
  // 加载账户列表
  WarehouseApi.getWarehouseSimpleList().then(res => {
    warehouseList.value = res
  })
  return warehouseList
}
// 获取产品列表
export const getProductList =  () => {
  const productList = ref<ProductVO[]>([]) // 产品列表
  ProductApi.getProductSimpleList().then(res => {
    productList.value = res.map(item => {
      item.label = item.name + '  ' + item.barCode
      return item
    })
  })
  return productList
}

function getSelectItemList (list: Array<any>, key: string) {
  // 后期可以加一个valueKey适配value不同
  const map = {}
  const arr:any = []
  list.forEach(item => {
    item.label = item[key]
    item.value = item[key]
    if(!map[item[key]]) {
      map[item[key]] = true
      arr.push(item)
    }
    return item
  })
  return arr
}
// 搜索产品名称的数据
export const getProductNameList =  () => {
  const productMap = {
    productNameList: ref<ProductVOSelectItem []>([]), // 产品列表
    productSkuList: ref<ProductVOSelectItem []>([]), // 产品sku列表
    productSeriesList: ref<ProductVOSelectItem []>([]), // 产品系列列表
    productBrandList: ref<ProductVOSelectItem []>([]), // 产品品牌列表
  } 

  const tempList = [
    {
      productMapKey: 'productNameList',
      key: 'name',
    },
    {
      productMapKey: 'productSkuList',
      key: 'barCode',
    },
    {
      productMapKey: 'productSeriesList',
      key: 'series',
    },
    {
      productMapKey: 'productBrandList',
      key: 'brand',
    },
  ]
  ProductApi.getProductSimpleList().then(res => {
    tempList.forEach(item => {
      const arr = getSelectItemList(cloneDeep(res), item.key)
      productMap[item.productMapKey].value = arr
    })
  })
  return productMap
}