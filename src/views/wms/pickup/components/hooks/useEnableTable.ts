import { InboundItemApi } from '@/api/wms/inbound-item'
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
    inboundNo: '入库单编号',
    productName: '产品名称',
    productBarCode: '产品编码',
    warehouseName: '仓库名称',
    // binName: '库位名称',
    // age: '库龄',
    // actualQty: '实际入库量',
    // outboundAvailableQty: '批次剩余库存',
    // planQty: '计划入库量',
    // shelvedQty: '已上架量',

    inboundStatus: {
      label: '入库状态',
      slot: 'inboundStatus',
      dictAttrs: { type: DICT_TYPE.WMS_INBOUND_STATUS }
    },

    updateTime: {
      label: '更新时间',
      formatter: dateFormatter,
      width: '200px'
    },
    updaterName: '更新人',
    createTime: {
      label: '创建时间',
      formatter: dateFormatter,
      width: '200px'
    },
    creatorName: '创建人',
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
      const data = await InboundItemApi.getPickupPendingPage(queryParams)
      list.value = getItemProp(data.list, ['warehouse', 'bin', 'product','inbound'])
      total.value = data.total
    } finally {
      loading.value = false
    }
  }

  const searchFormOptions = ref<Array<FormOptions>>([
    {
      type: 'input',
      label: '入库单编号',
      prop: 'inboundNo',
      placeholder: '请输入入库单编号',
      attrs: {
        class: '!w-160px',
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
