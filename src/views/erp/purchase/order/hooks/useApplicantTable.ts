import { PurchaseRequestApi, PurchaseRequestVO } from '@/api/erp/purchase/request'
import { useTableData } from '@/components/SmTable/src/utils'
import { dateFormatter, dateFormatter2 } from '@/utils/formatTime'
import { mergeItemsToList } from '@/utils/transformData'
import { cloneDeep } from 'lodash-es'

export const useApplicantTable = () => {
  const loading = ref(false)
  const total = ref(0)
  const list = ref<PurchaseRequestVO[]>([]) // 列表的数据

  const { tableOptions, transformTableOptions } = useTableData()

  const fieldMap = {
    requestTime: {
      label: '单据日期',
      formatter: dateFormatter2, // 年月日-金蝶
      width: '180px'
    },
    no: {
      label: '单据编号',
      width: '200px',
      slot: 'no',
      wrap: true
    },
    applicant: '申请人',
    applicationDept: {
      label: '申请部门',
      slot: 'applicationDept',
      width: '150px',
      wrap: true
    },
    status: {
      label: '审核状态',
      slot: 'status',
      width: '120px'
    },
    orderStatus: {
      label: '订购状态',
      slot: 'orderStatus',
      width: '120px'
    },
    offStatus: {
      label: '关闭状态',
      slot: 'offStatus',
      width: '120px'
    },

    unOrderCount: '未订购数量',
    orderCount: '已订购数量',
    inQty: '已入库数量',
    // 改造别名
    rowOrderStatus: {
      label: '行采购状态',
      slot: 'rowOrderStatus'
    },
    // 改造别名
    rowOffStatus: {
      label: '行关闭状态',
      slot: 'rowOffStatus'
    },
    barCode: '商品编码',
    productName: {
      label: '商品名称',
      slot: 'productName',
      width: '200px',
      wrap: true
    },
    productUnitName: '单位',
    count: '申请数量',
    approveCount: '批准数量',
    referenceUnitPrice: '参考单价',
    actTaxPrice: '含税单价',
    taxPrice: '税额',
    allAmount: '价税合计',

    creator: '制单人',
    createTime: {
      label: '制单时间',
      formatter: dateFormatter,
      width: '180px'
    },
    auditor: '审核人',
    auditTime: {
      label: '审核时间',
      formatter: dateFormatter,
      width: '180px'
    },
    expectArrivalDate: {
      label: '期望到货日期',
      formatter: dateFormatter,
      width: '180px'
    },
  }
  const branchOptions = transformTableOptions(fieldMap)
  tableOptions.value = cloneDeep(branchOptions)

  // 注意外面都要用let
  // eslint-disable-next-line prefer-const
  let queryParams: any = reactive({})

  const resetQueryParams = (queryParams) => {
    const initQueryParams = {
      pageNo: 1,
      pageSize: 10,
      no: undefined,
      // supplierId: undefined,
      productId: undefined,
      requestTime: [],
      status: undefined,
      remark: undefined,
      applicant: undefined,
      creator: undefined,
      inStatus: undefined,
      returnStatus: undefined
    }
    Object.assign(queryParams, initQueryParams)
  }
  resetQueryParams(queryParams)

  const handleSearch = () => {
    queryParams.pageNo = 1
    getList()
  }

  const handlePageChange = (pageNo: number) => {
    queryParams.pageNo = pageNo
    getList()
  }

  const handleSizeChange = (pageSize: number) => {
    queryParams.pageSize = pageSize
    getList()
  }

  const selectionList = ref<PurchaseRequestVO[]>([])
  const handleSelectionChange = (rows: PurchaseRequestVO[]) => {
    selectionList.value = rows
  }

  // 弹窗关闭的时候清空选择
  const resetApplicantTable = () => {
    console.log('打开前重置-关闭清空-重置queryParams')
    selectionList.value = []
    resetQueryParams(queryParams)
  }

  const getList = async () => {
    selectionList.value = []
    loading.value = true
    try {
      // 展示分行数据
      const data = await PurchaseRequestApi.getPurchaseRequestPage(queryParams)
      list.value = mergeItemsToList(data.list, {
        id: 'erpPurchaseRequestItemId',
        status: 'rowStatus',
        orderStatus: 'rowOrderStatus',
        offStatus: 'rowOffStatus'
      })
      // 后续需要补充itemsTotal
      total.value = data.itemsTotal || data.total
    } finally {
      loading.value = false
    }
  }
  getList()

  const applicantItemDialog = ref(false)
  const selectApplicantItem = () => {
    applicantItemDialog.value = true
    resetApplicantTable()
  }

  return {
    queryParams,
    resetQueryParams,
    list,
    tableOptions,
    loading,
    total,
    selectionList,
    handleSelectionChange,
    getList,
    resetApplicantTable,
    selectApplicantItem,
    applicantItemDialog
  }
}
