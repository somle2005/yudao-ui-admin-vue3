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

  { name: '入库', type: 1, dictType: 'wms_inbound_type', getValue: 'inbound.type' }, // split('.')[0][1]
  { name: '拣货', type: 2, dictType: 'wms_inbound_type', getValue: 'inbound.type' },

  { name: '出库', type: 3, dictType: 'wms_outbound_type', getValue: 'outbound.type' },
  { name: '提交出库单', type: 4, dictType: 'wms_outbound_type', getValue: 'outbound.type' },
  { name: '拒绝出库单', type: 5, dictType: 'wms_outbound_type', getValue: 'outbound.type' },

  { name: '换货单', type: 11, dictType: 'wms_exchange_type', getValue: 'exchange.type' },

  // 只有出库单-入库单状态
  // { name: '拒绝出库单', type: 6, dictType: 'wms_outbound_type', getValue: 'pickup.status' }, // 库位移动单等后端加字典

  // { name: '所有者移动单', type: 7, dictType: 'wms_move_execute_status', getValue: 'pickup.status' },

  // { name: '盘赢', type: 8, dictType: 'wms_inventory_audit_status', getValue: 'inventory.status' },
  // { name: '盘亏', type: 9, dictType: 'wms_inventory_audit_status', getValue: 'inventory.status' }
]

export const getCodeType = (type: number) => {
  const item = codeTypeList.find((item) => item.type === type)
  if (item) {
    return DICT_TYPE[item.dictType.toUpperCase()]
  }
}
export const getCodeValue = (row: any, type: number) => {
  const item = codeTypeList.find((item) => item.type === type)
  if (item) {
    const link = item.getValue.split('.')
    return row[link[0]][link[1]]
  }
}

// 入库单号会一直存在-其他只会存在一种
export const getOperateNo = (row: any) => {
  return row.exchangeCode || row.outboundCode || row.pickupCode || row.inboundCode 
}

const getWarehousesBinExchangeParams = (formDataCopy) => {
  const { type, warehouseId } = formDataCopy
  return { partitionType: type, warehouseId }
}

const changeSourceBinList = (data,sourceBinList) => {
  const { type, warehouseId } = data || {}
  if (type && warehouseId) {
    getWarehouseBinExchangeList({ partitionType: type, warehouseId }, sourceBinList)
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
  const getCacheStr = (formDataCopy) => {
    return JSON.stringify(getWarehousesBinExchangeParams(formDataCopy))
  }
  const canSourceBinList = (formData,sourceBinList) => {
    const formDataCopy = unref(formData)
    const str = getCacheStr(formDataCopy)
    if (cacheStr === str) {
      return
    } else {
      cacheStr = str
      changeSourceBinList(formDataCopy,sourceBinList)
    }
  }
  return {
    canSourceBinList
  }
}
