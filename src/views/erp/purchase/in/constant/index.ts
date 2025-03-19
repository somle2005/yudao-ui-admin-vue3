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
