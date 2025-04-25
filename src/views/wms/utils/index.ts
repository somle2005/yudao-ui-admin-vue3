export const isAbandon = (status: any) => {
  return [0, 2].includes(status) //草稿0 驳回2
}
