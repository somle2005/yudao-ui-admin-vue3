// 7-审核撤销,6-审核不通过,5-已审核,4-审核中,3-未审核,2-已提交,1-草稿, btnManage-createStr1创建 srm_audit_status
// 驳回(审核不通过) 反审核(审核撤销)
const message = useMessage() // 消息弹窗

export const isAbandon = (status: any) => {
  return [1, 7].includes(status) //草稿1 驳回6-审核不通过
}

export const isUpdate = (status: any) => {
  return [1, 6, 7].includes(status) //草稿1 驳回6-审核不通过 反审核-7审核撤销
}

export const isDelete = (status: any) => {
  return [1].includes(status) //草稿1
}

// 提交审批
export const isSubmitAudit = (status: any) => {
  return [1, 6, 7].includes(status) //1草稿，驳回6-审核不通过 反审核-7审核撤销
}

// 审核
export const isAudit = (status: any) => {
  return [2].includes(status) //2提交审核-已提交 -待入库
}

// 提交审核
export const isSubmitAuditBatch = (list: any[]) => {
  const flag = list.every((item) => isSubmitAudit(item.auditStatus))
  return flag
  // if (!flag) {
  //   message.error('选中行有未包含 草稿或审核不通过单据，请检查')
  // }
}

export const isMerge = (list: any[]) => {
  const auditType = 5 // 5已审核
  const flag = list.every((item: any) => item['auditStatus'] === auditType)
  return flag
  // if (!hasAudit) {
  //   message.error('选中行有未审核单据，请检查')
  // }
}
