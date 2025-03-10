import { PurchaseRequestApi, PurchaseRequestVO } from '@/api/erp/purchase/request'
import { getDeptTree, getUserList } from '@/commonData'
import { FormOptions } from '@/components/SmForm/src/types/types'
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
      status: 5,
      remark: undefined,
      applicant: undefined,
      creator: undefined,
      inStatus: undefined,
      returnStatus: undefined
    }
    Object.assign(queryParams, initQueryParams)
  }
  resetQueryParams(queryParams)

  const handleQuery = () => {
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
    selectionList.value = []
    list.value = []
    resetQueryParams(queryParams)
  }

  const getList = async () => {
    selectionList.value = []
    loading.value = true
    try {
      // 展示分行数据
      const data = await PurchaseRequestApi.getPurchaseRequestPage(queryParams)
      list.value = mergeItemsToList(data.list, {
        id: 'purchaseApplyItemId',
        status: 'rowStatus',
        orderStatus: 'rowOrderStatus',
        offStatus: 'rowOffStatus'
      })

      // 内部有按顺序把对应item数据取出操作

      // list.value.forEach((item:any) => {
      //   const productId = item.purchaseApplyItemId
      //   if(item?.items?.length) {
      //     item.itemActTaxPrice = item.items.find(item.id === productId).actTaxPrice
      //   }
      // })

      // 后续需要补充itemsTotal
      total.value = data.itemsTotal || data.total
    } finally {
      loading.value = false
    }
  }


  const applicantItemDialog = ref(false)
  const selectApplicantItem = () => {
    resetApplicantTable()
    getList()
    applicantItemDialog.value = true
  }




    const userList = getUserList()
    const { deptList, defaultProps } = getDeptTree()
     const searchFormOptions = ref<Array<FormOptions>>([
       {
         type: 'input',
         label: '单据编号',
         prop: 'no',
         placeholder: '请输入单据编号',
         attrs: {
           class: '!w-160px',
           style: { width: '100%' },
           clearable: true
         }
       },
       {
         type: 'date-picker',
         placeholder: '请选择单据日期',
         prop: 'requestTime',
         label: '单据日期',
         attrs: {
           clearable: true,
           type: 'daterange',
           'value-format': 'YYYY-MM-DD HH:mm:ss',
           'start-placeholder': '开始日期',
           'end-placeholder': '结束日期',
           defaultTime: [new Date('1 00:00:00'), new Date('1 23:59:59')],
           class: '!w-240px',
           style: {
             width: '100%'
           }
         }
       },
       {
         type: 'select',
         placeholder: '请选择申请人',
         prop: 'applicantId',
         label: '申请人',
         attrs: {
           class: '!w-160px',
           filterable: true,
           clearable: true,
           style: {
             width: '100%'
           }
         },
         children: userList
       },
       {
         type: 'tree-select',
         placeholder: '请选择申请部门',
         prop: 'applicationDeptId',
         label: '申请部门',
         attrs: {
           class: '!w-160px',
           filterable: true,
           clearable: true,
           data: deptList,
           props: defaultProps,
           'check-strictly': true,
           'node-key': 'id'
           // style: {
           //   width: '100%'
           // }
         },
       },
       {
         type: 'select',
         placeholder: '请选择审核人',
         prop: 'auditorId',
         label: '审核人',
         attrs: {
           class: '!w-160px',
           filterable: true,
           clearable: true,
           style: {
             width: '100%'
           }
         },
         children: userList
       },
     ])
  
    const events = {
      'keyup.enter': (e, item) => {
        handleQuery()
        console.log(e, '回车事件出发了', item)
      }
    }
  
    searchFormOptions.value.forEach((item) => {
      item.events = events
    })


  const getSearchFormData = () => {
    return queryParams
  }
  const resetQuery = () => {
    resetQueryParams(queryParams)
    handleQuery()
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
    applicantItemDialog,
    getSearchFormData,
    searchFormOptions,
    handleQuery,
    resetQuery,
  }
}
