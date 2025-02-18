import { ProductVO } from '@/api/crm/product'
import { ProductApi } from '@/api/erp/product/product'
import { getProductNameList } from '@/commonData'
import { useTableData } from '@/components/SmTable/src/utils'

export const useProductItemForm = () => {
  // eslint-disable-next-line prefer-const
  let queryParams: any = reactive({})
  const initQueryParams = (queryParams) => {
    const initQueryParams = {
      pageNo: 1,
      pageSize: 10,
      name: undefined,
      barCode: undefined
    }
    for (const key in initQueryParams) {
      queryParams[key] = initQueryParams[key]
    }
  }
  initQueryParams(queryParams)

  /** 选中操作 */
  const selectionList = ref<any[]>([])
  const handleSelectionChange = (rows: any[]) => {
    selectionList.value = rows
    console.log(rows, '选中的产品')
  }

  const loading = ref(false) // 列表的加载中
  const list = ref<ProductVO[]>([]) // 列表的数据
  const total = ref(0) // 列表的总页数
  const getList = async () => {
    loading.value = true
    try {
      const data = await ProductApi.getProductPage(queryParams)
      list.value = data.list
      total.value = data.total
    } finally {
      loading.value = false
    }
  }

  const productVisible = ref(false)
  const queryFormRef = ref() // 搜索的表单

  const handleQuery = () => {
    queryParams.pageNo = 1
    getList()
  }

  /** 重置按钮操作 */
  const resetQuery = () => {
    nextTick(() => {
      // queryFormRef.value.resetFields()
      selectionList.value = []
      initQueryParams(queryParams)
      handleQuery()
    })
  }
  const selectProduct = () => {
    productVisible.value = true
    resetQuery()
  }

  const { tableOptions, transformTableOptions } = useTableData()
  // 图片-sku编码-产品名称

  const fieldMap = {
    primaryImageUrl: {
      label: '图片',
      // fixed: 'left',
      slot: 'primaryImageUrl'
      // width: '20%'
    },
    barCode: {
      label: 'SKU（编码）',
      slot: 'barCode',
      wrap: true,
      width: '300px'
    },
    name: {
      label: '产品名称',
      slot: 'name',
      wrap: true,
      width: '350px'
    }
  }
  tableOptions.value = transformTableOptions(fieldMap, { noWidth: true })

  const { productNameList, productSkuList } = getProductNameList()

  return {
    selectProduct,
    getList,
    tableOptions,
    list,
    total,
    loading,
    queryParams,
    productVisible,
    handleQuery,
    productNameList,
    productSkuList,
    queryFormRef,
    handleSelectionChange,
    selectionList
  }
}
