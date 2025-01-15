import { AccountApi } from "@/api/erp/finance/account"
import { AccountVO } from "@/api/mp/account"
import { defaultProps, handleTree } from '@/utils/tree'
import  {getSimpleDeptList} from '@/api/system/dept'
import { SupplierProductApi, SupplierProductVO } from "@/api/erp/purchase/product"
import { WarehouseApi, WarehouseVO } from "@/api/erp/stock/warehouse"
import { ProductApi, ProductVO } from "@/api/erp/product/product"

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