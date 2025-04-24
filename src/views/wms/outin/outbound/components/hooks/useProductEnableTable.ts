import { StockBinApi } from '@/api/wms/stock-bin'
import { getProductList } from '@/commonData'
import { getWarehouseBinList } from '@/commonData/wms'
import { FormOptions } from '@/components/SmForm/src/types/types'
import { getItemProp, useTableData } from '@/components/SmTable/src/utils'
import { dateFormatter } from '@/utils/formatTime'
import { resetQueryParams } from '@/utils/transformData'

export const useProductEnableTable = () => {
  const loading = ref(false)
  const total = ref(0)
  const list = ref<any[]>([]) // 列表的数据
  const queryFormRef = ref()

  const { tableOptions, transformTableOptions } = useTableData()

  const fieldMap = {
    productName: '产品名称',
    productBarCode: '产品编码',
    // warehouseName: '仓库名称',
    binName: '库位名称',
    outboundPendingQty: '待出库数',
    sellableQty: '可售数',
    availableQty: '可用数',

    // updateTime: {
    //   label: '更新时间',
    //   formatter: dateFormatter,
    //   width: '200px'
    // },
    // updaterName: '更新人',
    // createTime: {
    //   label: '创建时间',
    //   formatter: dateFormatter,
    //   width: '200px'
    // },
    // creatorName: '创建人'
  }
  tableOptions.value = transformTableOptions(fieldMap, {
    allWrap: true,
    // noWidthList: ['outboundPendingQty', 'sellableQty', 'availableQty']
    computePropList: [
      'binName',
      'outboundPendingQty',
      'sellableQty',
      'availableQty',
    ]
  })

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
    queryParams.sellableQty = [0]
    selectionList.value = []
    list.value = []
    loading.value = true
    try {
      const data = await StockBinApi.getStockBinPage(queryParams)
      list.value = getItemProp(data.list, ['warehouse', 'bin', 'product'])
      total.value = data.total
    } finally {
      loading.value = false
    }
  }

  const productList = getProductList()
  // const wmsWarehouseList = getWMSWarehouseList()
  const warehouseBinList = getWarehouseBinList()

  const searchFormOptions = ref<Array<FormOptions>>([
    // {
    //   componentType: 'sm-range',
    //   label: '可售量',
    //   prop: 'sellableQty',
    //   // placeholder: '请输入可售量范围',
    //   attrs: {
    //     class: '!w-160px',
    //     style: { width: '100%' },
    //     clearable: true
    //   }
    // }

    {
      type: 'select',
      placeholder: '请选择产品编码',
      prop: 'productId',
      label: '产品编码',
      attrs: {
        clearable: true,
        filterable: true,
        style: {
          width: '100%'
        }
      },
      children: productList
    },
    {
      type: 'select',
      placeholder: '请选择库位',
      prop: 'binId',
      label: '库位',
      attrs: {
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: warehouseBinList
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
    fn(queryParams)
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
