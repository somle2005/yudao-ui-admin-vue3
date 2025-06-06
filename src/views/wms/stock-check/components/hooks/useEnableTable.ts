import { StockBinApi } from '@/api/wms/stock-bin'
import { getProductList } from '@/commonData'
import { getWarehouseBinList } from '@/commonData/wms'
import { FormOptions } from '@/components/SmForm/src/types/types'
import { getItemProp, getItemPropList, useTableData } from '@/components/SmTable/src/utils'
import { resetQueryParams } from '@/utils/transformData'

export const useEnableTable = () => {
  const loading = ref(false)
  const total = ref(0)
  const list = ref<any[]>([]) // 列表的数据
  const queryFormRef = ref()

  const { tableOptions, transformTableOptions } = useTableData()

  const fieldMap = {
    productName: '产品名称',
    productCode: '产品编码',
    warehouseName: '仓库',
    binName: '库位',

    availableQty: '可用量',
    // updateTime: {
    //   label: '更新时间',
    //   formatter: dateFormatter,
    //   width: '200px'
    // },
    updaterName: '更新人',
    // createTime: {
    //   label: '创建时间',
    //   formatter: dateFormatter,
    //   width: '200px'
    // },
    creatorName: '创建人'
  }
  tableOptions.value = transformTableOptions(fieldMap, { allWrap: true })

  // 注意外面都要用let
  // eslint-disable-next-line prefer-const
  let queryParams: any = reactive({})

  const handleQuery = () => {
    queryParams.pageNo = 1
    getList()
  }

  const selectionList = ref<any[]>([])
  const handleSelectionChange = (rows: any[]) => {
    selectionList.value = rows
  }

  // 弹窗关闭的时候清空选择
  const resetApplicantTable = () => {
    selectionList.value = []
    list.value = []
    resetQueryParams(queryParams, queryFormRef)
  }

  const getList = async () => {
    selectionList.value = []
    list.value = []
    loading.value = true
    try {
      const data = await StockBinApi.getStockBinPage(queryParams)
      list.value = getItemPropList(data.list, [
        { prop: 'warehouse', keyList: ['name'] },
        { prop: 'product', keyList: ['name', 'productCode'] },
        { prop: 'bin', keyList: ['name'] }
      ]) as any[]

      total.value = data.total
    } finally {
      loading.value = false
    }
  }

  const productList = getProductList()
  const warehouseBinList = ref<any[]>([])
  const searchFormOptions = ref<Array<FormOptions>>([
    {
      type: 'select',
      placeholder: '请选择产品编码',
      prop: 'productId',
      label: '产品编码',
      attrs: {
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: productList
    },
    {
      type: 'select',
      label: '库位',
      prop: 'binId',
      placeholder: '请选择库位',
      attrs: {
        style: { width: '100%' },
        filterable: true,
        clearable: true
      },
      children: warehouseBinList
    },
    {
      componentType: 'sm-range',
      label: '可用量',
      prop: 'availableQty',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    }
  ])

  const events = {
    'keyup.enter': (e, item) => {
      handleQuery()
    }
  }

  searchFormOptions.value.forEach((item) => {
    item.events = events
    if (item.attrs) {
      item.attrs.class = '!w-160px'
    } else {
      item.attrs = {
        class: '!w-160px'
      }
    }
  })

  const getSearchFormData = () => {
    return queryParams
  }

  const resetQuery = (fn?) => {
    resetQueryParams(queryParams, queryFormRef)
    queryParams.availableQty = [1]
    fn && fn(queryParams)
    getWarehouseBinList(warehouseBinList, { warehouseId: queryParams.warehouseId })
    handleQuery()
  }

  return {
    queryFormRef,
    queryParams,
    resetQueryParams,
    list,
    tableOptions,
    loading,
    total,
    selectionList,
    handleSelectionChange,
    getList,
    // resetApplicantTable,
    getSearchFormData,
    searchFormOptions,
    handleQuery,
    resetQuery
  }
}
