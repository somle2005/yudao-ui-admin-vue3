import { getRepeatMap } from '@/utils/judge'
import { DICT_TYPE } from '@/utils/dict'
import { getWarehouseBinExchangeList } from '@/commonData/wms'

export const isAbandon = (status: any) => {
  return [0, 2].includes(status) //草稿0 驳回2
}

export const addComment = (formOptions, slotKey = 'items') => {
  const index = formOptions.findIndex((item) => item.slot === slotKey)
  if (index === -1) {
    console.log('items.slot没有找到')
    return
  }
  const obj: any = {
    type: 'input',
    placeholder: '请输入审核意见',
    prop: 'comment',
    label: '审核意见',
    attrs: {
      clearable: true,
      class: '!w-1/1',
      style: {
        width: '100%'
      }
    }
  }
  formOptions.splice(index, 0, obj)
  return formOptions
}

export const addAuditAdvice = (formOptions, slotKey = 'items', propKey = 'auditAdvice') => {
  const index = formOptions.findIndex((item) => item.slot === slotKey)
  if (index === -1) {
    console.log('items.slot没有找到')
    return
  }
  const obj: any = {
    type: 'input',
    placeholder: '请输入审核意见',
    prop: propKey,
    label: '审核意见',
    attrs: {
      clearable: true,
      class: '!w-1/1',
      style: {
        width: '100%'
      }
    }
  }
  formOptions.splice(index, 0, obj)
  return formOptions
}

export const getBinIdRules = (formData) => {
  const binIdRuleList = [
    { required: true, message: '库位不能为空', trigger: 'blur' },
    {
      validator: function (rule, value, callback, source, options) {
        const productId = rule.row.productId
        const repeatMap = getRepeatMap(formData.value)!
        const hasRepeat = repeatMap[productId][value] > 1
        if (hasRepeat) {
          callback(new Error('相同产品库位不能重复'))
        } else {
          //校验通过
          callback()
        }
      },
      trigger: 'blur'
    }
  ]

  const createBinIdRule = (row: any) => {
    return [
      binIdRuleList[0],
      {
        ...binIdRuleList[1],
        row
      }
    ] as any[]
  }

  return {
    binIdRuleList,
    createBinIdRule
  }
}

export const codeTypeList = [
  // { name: '入库', type: 1, dictType: 'wms_inbound_status', getValue: 'inbound.inboundStatus' }, // split('.')[0][1]
  // { name: '拣货', type: 2, dictType: 'wms_inbound_status', getValue: 'inbound.inboundStatus' },

  { name: '出库', type: 3, dictType: 'wms_outbound_type', getValue: 'outbound.type' },
  { name: '提交出库单', type: 4, dictType: 'wms_outbound_type', getValue: 'outbound.type' },
  { name: '拒绝出库单', type: 5, dictType: 'wms_outbound_type', getValue: 'outbound.type' },

  // { name: '上架单', type: 6, dictType: 'wms_outbound_type', getValue: 'pickup.status' },

  { name: '换货单', type: 10, dictType: 'wms_exchange_type', getValue: 'exchange.type' },

  // 入库单优先级放最后了  split('.')[0][1]
  { name: '入库', type: 1, dictType: 'wms_inbound_type', getValue: 'inbound.type' },
  { name: '拣货', type: 2, dictType: 'wms_outbound_type', getValue: 'pickup.status' }
]

// 根据存在进行返回
const existReturn = (row) => {
  const list = Array.from(new Set(codeTypeList.map((item) => item.getValue)))
  let saveLink: any = []
  let saveGetValue
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    const link = item.split('.')
    if (row[link[0]]) {
      saveLink = link
      saveGetValue = item
      break
    }
  }

  if (saveGetValue && saveLink?.length) {
    const dictType = codeTypeList.find((item) => item.getValue === saveGetValue)?.dictType
    return {
      dictType,
      val: row[saveLink[0]][saveLink[1]]
    }
  }
  return {
    dictType: '',
    val: ''
  }
}

export const getCodeType = (type: number, row: any) => {
  const item = codeTypeList.find((item) => item.type === type)
  if (item) {
    return DICT_TYPE[item.dictType.toUpperCase()]
  }
  return DICT_TYPE[existReturn(row)?.dictType!.toUpperCase()]
}
export const getCodeValue = (row: any, type: number) => {
  const item = codeTypeList.find((item) => item.type === type)
  try {
    if (item) {
      const link = item.getValue.split('.')
      if (row[link[0]]) {
        return row[link[0]][link[1]]
      }
    }
    return existReturn(row).val
  } catch (e) {
    console.log(e, '报错了')
  }
}

// 入库单号会一直存在-其他只会存在一种
export const getOperateNo = (row: any) => {
  const codeList = [
    { name: '入库', type: 1, getValue: 'inbound' },
    { name: '拣货', type: 2, getValue: 'pickup' },
    { name: '完成出库', type: 3, getValue: 'outbound' },
    { name: '同意出库单', type: 11, getValue: 'outbound' },
    { name: '提交出库单', type: 4, getValue: 'outbound' },
    { name: '拒绝出库单', type: 5, getValue: 'outbound' },

    { name: '库位库存移动', type: 6, getValue: 'stockBinMove' },
    { name: '逻辑库存移动', type: 7, getValue: 'stockLogicMove' },

    { name: '盘赢', type: 8, getValue: 'stockCheck' },
    { name: '盘亏', type: 9, getValue: 'stockCheck' },
    { name: '良次转换', type: 10, getValue: 'exchange' }
  ]

  const item = codeList.find((item) => item.type === row.reason)
  try {
    if (item) {
      return row[item.getValue].code
    }
  } catch (e) {
    console.log(e, '报错了', item,'item-row',row)
  }

  // 入库单优先级放最后了  split('.')[0][1]
  // return row.exchangeCode || row.outboundCode || row.pickupCode || row.inboundCode
}

const getWarehousesBinExchangeParams = (formDataCopy, targetType?) => {
  const { type, warehouseId } = formDataCopy
  if (targetType === 'toBin') {
    // 源良-目的次
    return { partitionType: type === 1 ? 2 : 1, warehouseId }
  }
  return { partitionType: type, warehouseId }
}

const changeSourceBinList = (data, sourceBinList, targetType?) => {
  const { type, warehouseId } = data || {}
  if (type && warehouseId) {
    getWarehouseBinExchangeList(getWarehousesBinExchangeParams(data, targetType), sourceBinList)
  } else {
    sourceBinList.value = []
  }
}

export const useSourceBinList = () => {
  /**
   *  因为接口修改后-值还会watch再调用一次接口
   *  eslint-disable-next-line prefer-const
   *  方便统一管理-否则两个调用方都要触发一次方法-并且-编辑接口调用处-还需要再调用接口处理
   */
  let cacheStr = ''
  const getCacheStr = (formDataCopy, targetType) => {
    return JSON.stringify(getWarehousesBinExchangeParams(formDataCopy, targetType))
  }
  const canSourceBinList = (formData, sourceBinList, targetType?) => {
    const formDataCopy = unref(formData)
    const str = getCacheStr(formDataCopy, targetType)
    if (cacheStr === str) {
      return
    } else {
      cacheStr = str
      changeSourceBinList(formDataCopy, sourceBinList, targetType)
    }
  }
  return {
    canSourceBinList
  }
}
