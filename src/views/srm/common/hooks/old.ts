/**
 old代码
 order-PurchaseOrderForm
 // const createRequestFormOptions = () => {
//   const list = [
//     {
//       type: 'input',
//       label: '单据编号',
//       prop: 'code',
//       placeholder: '请输入单据编号',
//       attrs: {
//         style: { width: '100%' },
//         clearable: true
//       }
//     },
//     {
//       type: 'date-picker',
//       placeholder: '请选择单据日期',
//       prop: 'billTime',
//       label: '单据日期',
//       attrs: {
//         clearable: true,
//         type: 'date',
//         'value-format': 'x',
//         class: '!w-1/1',
//         style: {
//           width: '100%'
//         }
//       }
//       // rules: [
//       //   {
//       //     required: true,
//       //     message: '单据日期不能为空',
//       //     trigger: 'blur'
//       //   }
//       // ]
//     },

//     {
//       type: 'select',
//       placeholder: '请选择供应商',
//       prop: 'supplierId',
//       label: '供应商',
//       attrs: {
//         filterable: true,
//         clearable: true,
//         style: {
//           width: '100%'
//         },
//         onChange: supplierChange
//       },
//       children: supplierList
//     },

//     {
//       type: 'select',
//       placeholder: '请选择采购公司',
//       prop: 'purchaseCompanyId',
//       label: '采购公司',
//       attrs: {
//         filterable: true,
//         clearable: true,
//         style: {
//           width: '100%'
//         }
//       },
//       children: financeSubjectList
//     },

//     // {
//     //   type: 'cascader',
//     //   placeholder: '请选择付款条款',
//     //   prop: 'paymentTerms',
//     //   label: '付款条款',
//     //   attrs: {
//     //     'show-all-levels': false,
//     //     props: { emitPath: false },
//     //     filterable: true,
//     //     clearable: true,
//     //     style: {
//     //       width: '100%'
//     //     },
//     //     options: paymentTermsList
//     //   }
//     // },
//     {
//       type: 'select',
//       placeholder: '请选择付款条款',
//       prop: 'paymentTerms',
//       label: '付款条款',
//       attrs: {
//         filterable: true,
//         clearable: true,
//         style: {
//           width: '100%'
//         }
//       },
//       children: paymentTermsList
//     },

//     {
//       type: 'select',
//       placeholder: '请选择币种',
//       prop: 'currencyName',
//       label: '币种',
//       attrs: {
//         filterable: true,
//         clearable: true,
//         style: {
//           width: '100%'
//         },
//         onChange: (val) => {
//           const item = currencyList.value.find((item) => item.label === val)
//           if (item) {
//             const formData = getFormData()
//             formData.currencyId = item.id
//           }
//         }
//       },
//       children: currencyList
//     },
//     {
//       type: 'select',
//       placeholder: '请选择装运港',
//       prop: 'portOfLoading',
//       label: '装运港',
//       attrs: {
//         filterable: true,
//         clearable: true,
//         style: {
//           width: '100%'
//         }
//       },
//       children: portInfoList
//       // children: getStrDictOptions(DICT_TYPE.ERP_PORT_OF_LOADING)
//     },
//     {
//       type: 'select',
//       placeholder: '请选择目的港',
//       prop: 'portOfDischarge',
//       label: '目的港',
//       attrs: {
//         filterable: true,
//         clearable: true,
//         style: {
//           width: '100%'
//         }
//       },
//       children: portInfoList
//       // children: getStrDictOptions(DICT_TYPE.ERP_PORT_OF_DISCHARGE)
//     },
//     // {
//     //   type: 'date-picker',
//     //   placeholder: '请选择结算日期',
//     //   prop: 'settlementDate',
//     //   label: '结算日期',
//     //   attrs: {
//     //     clearable: true,
//     //     type: 'date',
//     //     'value-format': 'x',
//     //     class: '!w-1/1',
//     //     style: {
//     //       width: '100%'
//     //     }
//     //   }
//     // },

//     {
//       type: 'input',
//       label: '收货地址',
//       prop: 'address',
//       placeholder: '请输入收货地址',
//       attrs: {
//         style: { width: '100%' },
//         clearable: true
//       }
//     },

//     {
//       type: 'input',
//       label: '备注',
//       prop: 'remark',
//       placeholder: '请输入备注',
//       attrs: {
//         type: 'textarea',
//         style: { width: '100%' },
//         clearable: true
//       }
//     },
//     {
//       colConfig: { span: 24 },
//       prop: 'fileUrl',
//       label: '附件',
//       slot: 'fileUrl'
//     },
//     {
//       colConfig: { span: 24 },
//       slot: 'items',
//       formItemConfig: {
//         class: 'purchase-request-items'
//       }
//     },

//     {
//       type: 'input-number',
//       placeholder: '请输入优惠率',
//       prop: 'discountPercent',
//       label: '优惠率%',
//       attrs: {
//         'controls-position': 'right',
//         min: 0,
//         precision: 2,
//         style: {
//           width: '100%'
//         }
//       }
//     },
//     {
//       type: 'input-number',
//       prop: 'discountPrice',
//       label: '付款优惠',
//       attrs: {
//         disabled: true,
//         'controls-position': 'right',
//         min: 0,
//         precision: 2,
//         style: {
//           width: '100%'
//         }
//       }
//     },
//     {
//       type: 'input-number',
//       prop: 'totalPrice',
//       label: '优惠后金额',
//       attrs: {
//         disabled: true,
//         'controls-position': 'right',
//         min: 0,
//         precision: 2,
//         style: {
//           width: '100%'
//         }
//       }
//     },
//     {
//       type: 'input-number',
//       placeholder: '请输入定金金额',
//       prop: 'depositPrice',
//       label: '定金金额',
//       attrs: {
//         'controls-position': 'right',
//         min: 0,
//         precision: 2,
//         style: {
//           width: '100%'
//         }
//       }
//     },
//     {
//       type: 'select',
//       placeholder: '请选择结算账户',
//       prop: 'accountId',
//       label: '结算账户',
//       attrs: {
//         filterable: true,
//         clearable: true,
//         style: {
//           width: '100%'
//         }
//       },
//       children: accountList
//     }
//   ]

//   addRules(list, ['purchaseCompanyId', 'paymentTerms', 'supplierId', 'currencyName'])
//   return list
// }


request-hooks-index.ts

 // const createMergeFormOptions = () => {
  //   const currencyList = getCurrencyList()
  //   const accountList = getAccountList()
  //   const list = [
  //     {
  //       type: 'input',
  //       label: '单据编号',
  //       prop: 'code',
  //       placeholder: '请输入单据编号',
  //       attrs: {
  //         class: '!w-240px',
  //         style: { width: '100%' },
  //         clearable: true
  //       }
  //     },
  //     {
  //       type: 'date-picker',
  //       placeholder: '请选择单据日期',
  //       prop: 'billTime',
  //       label: '单据日期',
  //       attrs: {
  //         clearable: true,
  //         type: 'date',
  //         'value-format': 'x',
  //         class: '!w-1/1',
  //         style: {
  //           width: '100%'
  //         }
  //       }
  //     },
  //     {
  //       type: 'select',
  //       placeholder: '请选择供应商',
  //       prop: 'supplierId',
  //       label: '供应商',
  //       attrs: {
  //         filterable: true,
  //         clearable: true,
  //         style: {
  //           width: '100%'
  //         },
  //         onChange: supplierChange
  //       },
  //       children: supplierList
  //     },
  //     {
  //       type: 'select',
  //       placeholder: '请选择采购公司',
  //       prop: 'purchaseCompanyId',
  //       label: '采购公司',
  //       attrs: {
  //         filterable: true,
  //         clearable: true,
  //         style: {
  //           width: '100%'
  //         }
  //       },
  //       children: financeSubjectList
  //     },
  //     // {
  //     //   type: 'date-picker',
  //     //   placeholder: '请选择期望采购时间',
  //     //   prop: 'orderTime',
  //     //   label: '期望采购时间',
  //     //   attrs: {
  //     //     clearable: true,
  //     //     type: 'date',
  //     //     'value-format': 'x',
  //     //     class: '!w-1/1',
  //     //     style: {
  //     //       width: '100%'
  //     //     }
  //     //   },
  //     //   rules: [
  //     //     {
  //     //       required: true,
  //     //       message: '期望采购时间不能为空',
  //     //       trigger: 'blur'
  //     //     }
  //     //   ]
  //     // },
  //     {
  //       type: 'select',
  //       placeholder: '请选择付款条款',
  //       prop: 'paymentTerms',
  //       label: '付款条款',
  //       attrs: {
  //         filterable: true,
  //         clearable: true,
  //         style: {
  //           width: '100%'
  //         }
  //       },
  //       children: paymentTermsList
  //     },
  //     // {
  //     //   type: 'cascader',
  //     //   placeholder: '请选择付款条款',
  //     //   prop: 'paymentTerms',
  //     //   label: '付款条款',
  //     //   attrs: {
  //     //     'show-all-levels': false,
  //     //     props: { emitPath: false },
  //     //     filterable: true,
  //     //     clearable: true,
  //     //     style: {
  //     //       width: '100%'
  //     //     },
  //     //     options: paymentTermsList
  //     //   }
  //     // },
  //     {
  //       type: 'select',
  //       placeholder: '请选择币种',
  //       prop: 'currencyName',
  //       label: '币种',
  //       attrs: {
  //         filterable: true,
  //         clearable: true,
  //         style: {
  //           width: '100%'
  //         },
  //         onChange: (val) => {
  //           const item = currencyList.value.find((item) => item.label === val)
  //           if (item) {
  //             const formData = getFormData()
  //             formData.currencyId = item.id
  //           }
  //         }
  //       },
  //       children: currencyList
  //     },
  //     {
  //       type: 'select',
  //       placeholder: '请选择装运港',
  //       prop: 'portOfLoading',
  //       label: '装运港',
  //       attrs: {
  //         filterable: true,
  //         clearable: true,
  //         style: {
  //           width: '100%'
  //         }
  //       },
  //       children: getStrDictOptions(DICT_TYPE.ERP_PORT_OF_LOADING)
  //     },
  //     {
  //       type: 'select',
  //       placeholder: '请选择目的港',
  //       prop: 'portOfDischarge',
  //       label: '目的港',
  //       attrs: {
  //         filterable: true,
  //         clearable: true,
  //         style: {
  //           width: '100%'
  //         }
  //       },
  //       children: getStrDictOptions(DICT_TYPE.ERP_PORT_OF_DISCHARGE)
  //     },
  //     // {
  //     //   type: 'date-picker',
  //     //   placeholder: '请选择结算日期',
  //     //   prop: 'settlementDate',
  //     //   label: '结算日期',
  //     //   attrs: {
  //     //     clearable: true,
  //     //     type: 'date',
  //     //     'value-format': 'x',
  //     //     class: '!w-1/1',
  //     //     style: {
  //     //       width: '100%'
  //     //     }
  //     //   }
  //     // },

  //     {
  //       type: 'input',
  //       label: '收货地址',
  //       prop: 'address',
  //       placeholder: '请输入收货地址',
  //       attrs: {
  //         style: { width: '100%' },
  //         clearable: true
  //       }
  //     },
  //     {
  //       type: 'input',
  //       label: '备注',
  //       prop: 'remark',
  //       placeholder: '请输入备注',
  //       attrs: {
  //         type: 'textarea',
  //         style: { width: '100%' },
  //         clearable: true
  //       }
  //     },
  //     {
  //       colConfig: { span: 24 },
  //       prop: 'fileUrl',
  //       label: '附件',
  //       slot: 'fileUrl'
  //     },

  //     {
  //       colConfig: { span: 24 },
  //       slot: 'items',
  //       formItemConfig: {
  //         class: 'purchase-request-items'
  //       }
  //     },

  //     {
  //       type: 'input-number',
  //       placeholder: '请输入优惠率',
  //       prop: 'discountPercent',
  //       label: '优惠率%',
  //       attrs: {
  //         'controls-position': 'right',
  //         min: 0,
  //         precision: 2,
  //         style: {
  //           width: '100%'
  //         }
  //       }
  //     },
  //     {
  //       type: 'input-number',
  //       prop: 'discountPrice',
  //       label: '付款优惠',
  //       attrs: {
  //         disabled: true,
  //         'controls-position': 'right',
  //         min: 0,
  //         precision: 2,
  //         style: {
  //           width: '100%'
  //         }
  //       }
  //     },
  //     {
  //       type: 'input-number',
  //       prop: 'totalPrice',
  //       label: '优惠后金额',
  //       attrs: {
  //         disabled: true,
  //         'controls-position': 'right',
  //         min: 0,
  //         precision: 2,
  //         style: {
  //           width: '100%'
  //         }
  //       }
  //     },
  //     {
  //       type: 'input-number',
  //       placeholder: '请输入定金金额',
  //       prop: 'depositPrice',
  //       label: '定金金额',
  //       attrs: {
  //         'controls-position': 'right',
  //         min: 0,
  //         precision: 2,
  //         style: {
  //           width: '100%'
  //         }
  //       }
  //     },
  //     {
  //       type: 'select',
  //       placeholder: '请选择结算账户',
  //       prop: 'accountId',
  //       label: '结算账户',
  //       attrs: {
  //         filterable: true,
  //         clearable: true,
  //         style: {
  //           width: '100%'
  //         }
  //       },
  //       children: accountList
  //     }
  //   ]

  //   addRules(list, ['purchaseCompanyId', 'paymentTerms', 'supplierId', 'currencyName'])
  //   return list as FormOptions[]
  // }
 */