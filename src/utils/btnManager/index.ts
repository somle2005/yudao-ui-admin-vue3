import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

export const btnManage = (type) => {
  /**
    其他入库
    WMS_INBOUND_AUDIT_STATUS

    出库单管理
    WMS_OUTBOUND_AUDIT_STATUS

    盘点单管理
    WMS_INVENTORY_AUDIT_STATUS
    作废

    直接这样写-后面新增状态了 这里就会持续的加东西-

    变更-还是直接在 页面上面加注释比较好
   */

  // 5-已通过,3-已驳回,2-待审批,0-起草中
  const inventoryAuditList = [
    { name: '已通过', status: 5 },
    { name: '已驳回', status: 3 },
    { name: '待审批', status: 2 },
    { name: '起草中', status: 0 }
  ]

  // 5-作废,4-强制入库,3-已入库,2-驳回,1-待入库,0-草稿 btnManage-createStr1创建
  const inboundAuditList = [
    {
      name: '作废',
      status: '5'
    },
    {
      name: '强制入库',
      status: '4'
    },
    {
      name: '已入库',
      status: '3'
    },
    {
      name: '驳回',
      status: '2'
    },
    {
      name: '待入库',
      status: '1'
    },
    {
      name: '草稿',
      status: '0'
    }
  ]

  // 4-已出库,3-已通过,2-已驳回,1-待审批,0-起草中,
  const outboundAuditList = [
    {
      name: '已出库',
      status: '4'
    },
    {
      name: '已通过',
      status: '3'
    },
    {
      name: '已驳回',
      status: '2'
    },
    {
      name: '待审批',
      status: '1'
    },
    {
      name: '起草中',
      status: '0'
    }
  ]

  const map = {}
}

const createList = (list) => {
  return list.map((item) => {
    const obj = {
      name: item.label,
      status: item.value
    }
    return obj
  })
}

const createStr = (list) => {
  let str = ''
  list.forEach((item) => {
    str += item.status + '-' + item.name + ','
  })
  return str
}

// 直接拉页面数据
const createStr1 = (list) => {
  let str = ''
  list.forEach((item) => {
    str += item.value + '-' + item.label + ','
  })
  return str + ' btnManage-createStr1创建'
}

export const isAbandon = (status: any) => {
  return [0, 2].includes(status) //草稿0 驳回2
}

export const isUpdate = (status: any) => {
  return [0, 2].includes(status) //草稿0 驳回2
}

export const isDelete = (status: any) => {
  return [0].includes(status) //草稿0
}

// 提交审批
export const isSubmitAudit = (status: any) => {
  return [0, 2].includes(status) //0草稿，2审批驳回
}

// 审核
export const isAudit = (status: any) => {
  return [1].includes(status) //1提交审核-待入库
}
