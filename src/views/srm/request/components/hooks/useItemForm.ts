import { useTableData } from '@/components/SmTable/src/utils'
import { useListTableField, useTableField } from '@/components/SmTableField/src/hooks'
import {
  addFieldProp,
  TABLE_FIDLD_SUFFIX_MAP,
  WHOLE_ORDER_SAVE_DATA_MAP
} from '@/components/SmTableField/src/utils'

export const useItemForm = (props, formData) => {
  const productDisabled = computed(() => ['audit', 'detail', 'merge'].includes(props.formType))
  const allDisabled = computed(() => ['detail'].includes(props.formType))
  const disabled = computed(() => ['audit', 'detail'].includes(props.formType))
  // 批准数量在merge下要禁用
  const mergeDisabled = computed(() => props.formType === 'merge')
  // const showAudit = computed(() => props.formType === 'audit' || props.formType === 'merge')
  const showOperate = computed(() => ['create', 'update'].includes(props.formType))

  const approveCountDisabled = computed(() => !['audit'].includes(props.formType))
  const approveCountShow = computed(() =>
    ['detail', 'update', 'merge', 'audit'].includes(props.formType)
  )
  const showMerge = computed(() => props.formType === 'merge')
  const noCreate = computed(() => props.formType !== 'create')

  // 非新增下才会展示税额-价税合计

  // noCreate.value能否正确响应式要测试下-可以正确响应
  // :rules="formRules.qty" 测试检验功能是否ok

  // 选择项记得开启 isSelection isIndex
  //  <el-table-column fixed="left" width="40" label="选择" type="selection" align="center" />
  //     <el-table-column label="序号" type="index" align="center" width="60" />
  // 清单标记listDisabled 清单强制字段 无法被启用 应该会disabled
  // 抛出$index字段 <template #operate="{ scope }"> 直接取scope.$index  row, $index
  const fieldMap = {
    id: {
      width: '60',
      label: '行编号',
      isEnable: noCreate.value,
      listDisabled: true
    },

    productId: {
      width: '180',
      label: '*产品编码',
      slot: 'productId',
      fixed: 'left'
    },
    productName: {
      width: '160',
      label: '产品名称'
    },
    declaredType: {
      width: '180',
      label: '*海关品名',
      slot: 'declaredType'
    },

    containerRate: {
      width: '100',
      label: '箱率',
      slot: 'containerRate',
      isEnable: disabled.value,
      listDisabled: true
    },

    productUnitName: {
      width: '100',
      label: '单位'
    },

    warehouseId: {
      width: '120',
      label: '仓库',
      slot: 'warehouseId',
      isEnable: disabled.value,
      listDisabled: true
    },

    orderQuantity: {
      width: '80',
      label: '*下单数量',
      slot: 'orderQuantity',
      isEnable: mergeDisabled.value,
      listDisabled: true
    },
    unOrderCount: {
      width: '120',
      label: '未订购数量',
      slot: 'unOrderCount',
      isEnable: mergeDisabled.value,
      listDisabled: true
    },

    qty: {
      width: '100',
      label: '*申请数量',
      slot: 'qty'
    },

    approvedQty: {
      width: '100',
      label: '批准数量',
      slot: 'approvedQty',
      isEnable: approveCountShow.value,
      listDisabled: true
    },

    grossPrice: {
      width: '100',
      label: '含税单价',
      slot: 'grossPrice'
    },

    productPrice: {
      width: '100',
      label: '单价',
      slot: 'productPrice'
    },

    taxRate: {
      width: '100',
      label: '税率%',
      slot: 'taxRate'
    },

    tax: {
      width: '100',
      label: '税额',
      isEnable: showMerge.value,
      listDisabled: true
    },

    grossTotalPrice: {
      width: '100',
      label: '价税合计',
      isEnable: showMerge.value,
      listDisabled: true
    },

    referenceUnitPrice: {
      width: '100',
      label: '参考单价',
      slot: 'referenceUnitPrice'
    },

    expectArrivalDate: {
      width: '150',
      label: '期望到货日期',
      slot: 'expectArrivalDate'
    },

    deliveryTime: {
      width: '150',
      label: '*交货日期',
      slot: 'deliveryTime',
      isEnable: mergeDisabled.value,
      listDisabled: true
    },

    declaredTypeEn: {
      width: '150',
      label: '*海关品名(英文)',
      slot: 'declaredTypeEn'
    },

    remark: {
      width: '100',
      label: '备注',
      slot: 'remark',
      isEnable: mergeDisabled.value,
      listDisabled: true
    },

    applicant: {
      width: '160',
      label: '申请人',
      isEnable: mergeDisabled.value,
      listDisabled: true
    },
    applicationDept: {
      width: '160',
      label: '申请部门',
      isEnable: mergeDisabled.value,
      listDisabled: true
    },

    operate: {
      width: '60',
      label: '操作',
      slot: 'operate',
      isEnable: showOperate.value,
      listDisabled: true
    }
  }
  
  const { tableOptions, transformTableOptions } = useTableData()
  const allOptions = transformTableOptions(fieldMap)

  // 用详情接口+后缀
  const tableFieldKey = '/srm/purchase-request/get' + '-' + TABLE_FIDLD_SUFFIX_MAP.formList
  const { createTableFiledOptions, tableFieldOptions, tableFieldConfirm } = useListTableField(
    tableOptions,
    allOptions,
    tableFieldKey
  )

  // const tableFieldOptions = ref(addFieldProp(allOptions))
  // 内部 filterOptions帮你过滤了已经
  // tableOptions.value = tableFieldOptions.value.filter((item) => item.isEnable)

  const getTableData = () => {
    return formData
  }

  return {
    allDisabled,
    disabled,
    productDisabled,
    mergeDisabled,
    approveCountDisabled,

    tableOptions,
    tableFieldOptions,
    getTableData,
    tableFieldKey,
    tableFieldConfirm,
    createTableFiledOptions
  }
}
