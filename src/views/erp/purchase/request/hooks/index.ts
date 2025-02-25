import { PurchaseRequestApi } from '@/api/erp/purchase/request'
import { getDeptTree, getProductList, getUserList, getSupplierProductList } from '@/commonData'
import { cloneDeep } from 'lodash-es'
import { formatTime } from '@/utils/formatTime'
import { defaultProps } from '@/utils/tree'

/**

是否必填根据文档来

申请人-applicant-下拉框(数据来源-/system/user/simple-list)
申请部门-applicationDept-下拉框(数据来源-参照产品信息-部门下拉框)
单据日期-requestTime-时间下拉单选(参照采购订单-订单时间)
供应商编号-supplierId-下拉框


items-商品信息-表格列(参照-采购订单-订单产品清单)

商品id-productId-下拉框
申请数量-count-数字输入框(整数>0)
仓库编号-warehouseId-下拉框 (数据来源-仓库精简列表接口)
批准数量-approveCount-数字输入框(整数>0)
含税单价-actTaxPrice-数字输入框(手动输入，价格保留小数点后两位。)
价税合计-allAmount-(显示在底部合计行-与含税单价联动，通过计算保持一致)
参考单价-referenceUnitPrice-数字输入框(整数>0)
税额，单位：元-taxPrice-(纯显示-保留小数点后两位   = 含税单价*税率   )
税率，百分比-taxPercent-数字输入框(手动输入，保留小数点后两位。)


税额的计算


单价 * (1+税率) = 含税单价
单价 = 含税单价/ (1+税率)
税额 = 单价 * 税率
税额 = 含税单价 * (税率/(1+税率))


产品带出 产品编码sku-barCode-change事件赋予值联动即可

必填项

单据日期
申请人
申请部门
产品名称
产品编码
供应商编号
单位
申请数量
 */



const mergeDetail = (formData, detail, formType, smFormRef) => {
  for (const key in detail) {
    formData[key] = detail[key]
  }
  // formData.requestTime = "2025-02-01 00:00:00"
  formData.requestTime = formatTime(formData.requestTime)
  formData.items.forEach((item) => {
    if (formType === 'audit') {
      item.approveCount = item.count
    }
    item.taxPercent = item.taxPercent * 100
  })

  nextTick(() => {
    const modelValue = smFormRef.value.getFormData()
    for (const key in formData) {
      modelValue[key] = formData[key]
    }
    console.log(modelValue, 'modelValue')
  })

  // modelValue = formData
  // modelValue.deliveryDelivery = '112121212'
  // modelValue.requestTime = dayjs(1739016534000).format('YYYY-MM-DD HH:mm:ss')
  // modelValue.applicant = 50025
  // modelValue.applicationDept = 50019
}

export const usePurchaseRequestForm = ({ getResetFormData, getFormData,emit }) => {
  const { t } = useI18n() // 国际化
  const message = useMessage() // 消息弹窗

  const dialogTitle = ref('')
  const dialogVisible = ref(false)

  // const productList1 = getProductList()
  // const applicantList = getUserList()
  // const { deptList, defaultProps } = getDeptTree()
  // const supplierProductList = getSupplierProductList()

  const applicantList = ref([])
  const supplierProductList = ref([])
  const deptList = ref([])

  // eslint-disable-next-line prefer-const
  // let formData = reactive({formData:{}})
  // const resetFormData = () => {
  //   return reactive({
  //     requestTime: undefined,
  //     applicant: undefined,
  //     applicationDept: undefined,
  //     productId: undefined,
  //     barCode: undefined
  //   })
  // }

  // formData.formData = resetFormData()

  const smFormRef = ref()

  /** 子表的表单 */
  const subTabsName = ref('item')
  const itemFormRef = ref()

  const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
  const formType = ref('') // 表单的类型：create - 新增；update - 修改；detail - 详情

 

  const openForm = async (type: string, id?: number) => {
    getResetFormData()
    formType.value = type
    dialogTitle.value = t('action.' + type)
    dialogVisible.value = true

    getUserList(applicantList)
    getSupplierProductList(supplierProductList)
    getDeptTree(deptList)

    // 修改时，设置数据
    if (id) {
      formLoading.value = true
      try {
        const formData = getFormData()
        const detailData = await PurchaseRequestApi.getPurchaseRequest(id)
        mergeDetail(formData, detailData, formType.value, smFormRef)
        console.log(formData, '修改时获取的数据')
      } finally {
        formLoading.value = false
      }
    }
  }

  const submitForm = async () => {
    // catch会拿到错误数据 没有进入catch说明校验通过了
    try {
      const valida1 = await itemFormRef.value.validate()
      const valiad2 = await smFormRef.value.validate()()
      if (!(valida1 && valiad2)) return

      console.log(itemFormRef.value, 'itemFormRef')
      console.log(smFormRef.value, 'smFormRef')

      console.log('拿到参数调用接口-注意重置 区分新增和编辑')
      // const formData = smFormRef.value.getFormData()

      // 提交请求
      formLoading.value = true

      const data = cloneDeep(getFormData())
      data.items.forEach((item) => {
        item.taxPercent = item.taxPercent / 100
        return item
      })

      // const data = getFormData()
      console.log(data, '点击确定的formData')

      if (formType.value === 'create') {
        await PurchaseRequestApi.createPurchaseRequest(data)
        message.success(t('common.createSuccess'))
      } else if (formType.value === 'audit') {
        await PurchaseRequestApi.updatePurchaseRequestAuditStatus({
          requestId: data.id,
          reviewed: true,
          obj: data
        })
        message.success(t('common.updateSuccess'))
      } else {
        await PurchaseRequestApi.updatePurchaseRequest(data)
        message.success(t('common.updateSuccess'))
      }

      dialogVisible.value = false
      // 拿到外部回调处理成功事件
      // successCallback() 
      emit('success')
    } catch (e) {
      console.log(e, '报错了')
    } finally {
      formLoading.value = false
    }
  }

  const requestFormOptions = ref([
    {
      type: 'date-picker',
      placeholder: '请选择单据日期',
      prop: 'requestTime',
      label: '单据日期',
      attrs: {
        clearable: true,
        type: 'date',
        'value-format': 'YYYY-MM-DD HH:mm:ss',
        class: '!w-1/1',
        style: {
          width: '100%'
        }
      },
      rules: [
        {
          required: true,
          message: '单据日期不能为空',
          trigger: 'blur'
        }
      ]
    },
    {
      type: 'select',
      placeholder: '请选择申请人',
      prop: 'applicantId',
      label: '申请人',
      attrs: {
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      rules: [
        {
          required: true,
          message: '申请人不能为空',
          trigger: 'blur'
        }
      ],
      children: applicantList
    },
    {
      type: 'tree-select',
      placeholder: '请选择申请部门',
      prop: 'applicationDeptId',
      label: '申请部门',
      attrs: {
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
      rules: [
        {
          required: true,
          message: '申请部门不能为空',
          trigger: 'blur'
        }
      ]
    },

    {
      type: 'select',
      placeholder: '请选择供应商产品',
      prop: 'supplierId',
      label: '供应商产品',
      attrs: {
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      // rules: [
      //   {
      //     required: true,
      //     message: '供应商产品不能为空',
      //     trigger: 'blur'
      //   }
      // ],
      children: supplierProductList
    },

    // {
    //   type: 'select',
    //   value: '',
    //   placeholder: '请选择产品',
    //   prop: 'productId',
    //   label: '产品',
    //   attrs: {
    //     clearable: true,
    //     filterable: true,
    //     style: {
    //       width: '100%'
    //     },
    //     onChange: (value) => {
    //       const productItem = productList1.value.find((item: any) => item.value === value)
    //       if (productItem) {
    //         const formData = getFormData()
    //         formData.barCode = productItem.barCode
    //         // const modelVal = smFormRef.value.getFormData()
    //         // modelVal.barCode = productItem.barCode
    //       }
    //     }
    //   },
    //   rules: [
    //     {
    //       required: true,
    //       message: '产品不能为空',
    //       trigger: 'blur'
    //     }
    //   ],
    //   children: productList1
    // },

    {
      type: 'input',
      label: '收货地址',
      prop: 'deliveryDelivery',
      placeholder: '请输入收货地址',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      colConfig: { span: 24 },
      slot: 'items',
      formItemConfig: {
        class: 'purchase-request-items'
      }
    }
  ])

  return {
    dialogTitle,
    dialogVisible,
    openForm,
    requestFormOptions,
    smFormRef,
    // formData:formData.formData,
    submitForm,
    subTabsName,
    itemFormRef,
    formLoading,
    formType,
    applicantList,
    supplierProductList
  }
}
