import { InboundItemApi } from '@/api/wms/inbound-item'
import { getProductList } from '@/commonData'
import { getWMSWarehouseList } from '@/commonData/wms'
import { FormOptions } from '@/components/SmForm/src/types/types'
import { getItemProp, useTableData } from '@/components/SmTable/src/utils'
import { dateFormatter, dateFormatter2 } from '@/utils/formatTime'
import { resetQueryParams } from '@/utils/transformData'

export const useEnableTable = () => {
  const loading = ref(false)
  const total = ref(0)
  const list = ref<any[]>([]) // 列表的数据
  const queryFormRef = ref()

  const { tableOptions, transformTableOptions } = useTableData()

  const fieldMap = {
    inboundCode: '入库单编号',
    productName: '产品名称',
    productCode: '产品编码',
    warehouseName: '仓库',
    // binName: '库位',
    // age: '库龄',
    // actualQty: '入库数量',
    // outboundAvailableQty: '批次剩余库存',
    // planQty: '计划入库量',
    // shelveClosedQty: '已上架数',

    shelveAvailableQty: '待上架数量',
    inboundStatus: {
      label: '入库状态',
      slot: 'inboundStatus',
      dictAttrs: { type: DICT_TYPE.WMS_INBOUND_STATUS }
    }

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
    computePropList: ['actualQty']
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
    queryParams.inboundStatus = 2 // 已入库
    selectionList.value = []
    list.value = []
    loading.value = true
    try {
      const data = await InboundItemApi.getPickupPendingPage(queryParams)
      list.value = getItemProp(data.list, ['warehouse', 'bin', 'product', 'inbound'])
      total.value = data.total
    } finally {
      loading.value = false
    }
  }

  const productList = getProductList()
  const WMSWarehouseList = getWMSWarehouseList()

  const searchFormOptions = ref<Array<FormOptions>>([
    {
      type: 'input',
      label: '入库单编号',
      prop: 'inboundCode',
      placeholder: '请输入入库单编号',
      attrs: {
        class: '!w-160px',
        style: { width: '100%' },
        clearable: true
      }
    },
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
      label: '仓库',
      prop: 'warehouseId',
      placeholder: '请选择仓库',
      attrs: {
        style: { width: '100%' },
        filterable: true,
        clearable: true
      },
      children: WMSWarehouseList
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
  const resetQuery = () => {
    resetQueryParams(queryParams, queryFormRef)
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
