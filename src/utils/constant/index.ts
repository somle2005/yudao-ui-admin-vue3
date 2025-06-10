export const AUDIT_TYPE = {
  agree: '审核同意',
  reject: '审核不同意',
  agreeOutbound: '同意出库',
  agreeInventory: '同意盘点',
}

export const TAX_PERCENT = 13


export const RECONCILIATION_STSTUS = [
  { label: '未对账', value: false, colorType: 'primary' },
  { label: '已对账', value: true, colorType: 'success' }
]

const createMap = (list) => {
  const map = {}
  list.forEach(item => {
    map[item.value] = {
      label: item.label,
      colorType: item.colorType
    }
  })
  return map
}

export const RECONCILIATION_STSTUS_MAP = createMap(RECONCILIATION_STSTUS)





