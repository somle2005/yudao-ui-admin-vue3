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
