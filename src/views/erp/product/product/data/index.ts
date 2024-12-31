import { handleTree } from '@/utils/tree'
import * as DeptApi from '@/api/system/dept'

export const getDeptTree = async () => {
  const deptList = ref<Tree[]>([]) // 树形结构
  // 加载部门树
  deptList.value = handleTree(await DeptApi.getSimpleDeptList())
  return deptList
}
