import { addProperty } from '@/components/SmForm/src/utils'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { formatDecimal } from '@/utils/num'
import { VOLUMN_PRECISION } from '../constant'
import { CustomRuleApi } from '@/api/tms/customrule'
import { getFinanceSubjectList } from '@/commonData'
import { getPortInfoList } from '@/commonData/tms'

// 合并头程申请单 头程申请合并和头程订单复用
export const useMergeFirstMileOptions = (warehouse, WMSWarehouseList, financeSubjectList) => {
  const mergeOptions = () => {
    const list = [
      {
        type: 'input',
        label: '单据编码',
        prop: 'code',
        placeholder: '请输入单据编码',
        attrs: {
          style: { width: '100%' },
          clearable: true
        }
      },
      {
        requiredFlag: true,
        type: 'select',
        label: '目的仓',
        prop: 'toWarehouseId',
        placeholder: '请选择目的仓',
        attrs: {
          style: { width: '100%' },
          filterable: true,
          clearable: true,
          onChange: (val) => {
            warehouse.value = WMSWarehouseList.value.find((item: any) => item.value === val) || {}
            console.log(val, '目的仓')
          }
        },
        children: WMSWarehouseList
      },

      {
        type: 'input',
        label: '提单号',
        prop: 'ladingNo',
        placeholder: '请输入提单号',
        attrs: {
          style: { width: '100%' },
          clearable: true
        }
      },

      {
        type: 'select',
        label: '柜型',
        prop: 'cabinetType',
        placeholder: '请选择柜型',
        attrs: {
          style: { width: '100%' },
          filterable: true,
          clearable: true
        },
        children: getIntDictOptions(DICT_TYPE.TMS_CABINET_TYPE)
      },

      {
        type: 'date-picker',
        placeholder: '请选择装柜日期',
        prop: 'packTime',
        label: '装柜日期',
        attrs: {
          clearable: true,
          type: 'date',
          'value-format': 'x',
          class: '!w-1/1',
          style: {
            width: '100%'
          }
        }
      },
      {
        type: 'date-picker',
        placeholder: '请选择预计到货日期',
        prop: 'arrivePlanTime',
        label: '预计到货日期',
        attrs: {
          clearable: true,
          type: 'date',
          'value-format': 'x',
          class: '!w-1/1',
          style: {
            width: '100%'
          }
        }
      },
      {
        type: 'date-picker',
        placeholder: '请选择预计送仓时间',
        prop: 'deliveryEstimateTime',
        label: '预计送仓时间',
        attrs: {
          clearable: true,
          type: 'date',
          'value-format': 'x',
          class: '!w-1/1',
          style: {
            width: '100%'
          }
        }
      },
      {
        type: 'date-picker',
        placeholder: '请选择实际送仓时间',
        prop: 'deliveryActualTime',
        label: '实际送仓时间',
        attrs: {
          clearable: true,
          type: 'date',
          'value-format': 'x',
          class: '!w-1/1',
          style: {
            width: '100%'
          }
        }
      },

      {
        type: 'input-number',
        label: '货柜体积(m³)',
        prop: 'totalVolume',
        attrs: {
          disabled: true,
          style: { width: '100%' },
          clearable: true
        }
      },
      {
        type: 'input-number',
        label: '货柜毛重(kg)',
        prop: 'totalWeight',
        attrs: {
          disabled: true,
          style: { width: '100%' },
          clearable: true
        }
      },
      {
        type: 'input-number',
        label: '货柜净重(kg)',
        prop: 'netWeight',
        attrs: {
          disabled: true,
          style: { width: '100%' },
          clearable: true
        }
      },

      // totalValue 货柜货值（按最近采购价） 问后端哪里去取-后端说先空着

      {
        type: 'input-number',
        label: '货柜件数',
        prop: 'totalQty',
        attrs: {
          disabled: true,
          style: { width: '100%' },
          clearable: true
        }
      },

      {
        type: 'input',
        label: '备注',
        prop: 'remark',
        placeholder: '请输入备注',
        attrs: {
          style: { width: '100%' },
          clearable: true
        }
      },
      {
        colConfig: { span: 24 },
        slot: 'vesselTrackingItems',
        formItemConfig: {
          class: 'common-form-tabs-items'
        }
      },
      {
        colConfig: { span: 24 },
        slot: 'mergeItems',
        formItemConfig: {
          class: 'common-form-items'
        }
      }
    ]

    addProperty(list)
    list.forEach((item: any) => {
      if (!['mergeItems', 'vesselTrackingItems'].includes(item.slot)) {
        item.colConfig = { span: 8 }
      }
    })
    return list
  }

  const vesselTrackingOptions = () => {
    // 船名-航次-货代公司-装运港-中转港-目的港-出口公司-中转公司-箱号-船公司
    const financeSubjectList = getFinanceSubjectList()
    const portInfoList = getPortInfoList()

    const list = [
      {
        type: 'input',
        label: '船名',
        prop: 'vessel',
        placeholder: '请输入船名',
        attrs: {
          style: { width: '100%' },
          clearable: true
        }
      },
      {
        type: 'input',
        label: '航次',
        prop: 'voyage',
        placeholder: '请输入航次',
        attrs: {
          style: { width: '100%' },
          clearable: true
        }
      },

      {
        type: 'select',
        label: '货代公司',
        prop: 'forwarderCompanyId',
        placeholder: '请选择货代公司',
        attrs: {
          style: { width: '100%' },
          filterable: true,
          clearable: true
        },
        children: financeSubjectList
      },

      {
        type: 'select',
        label: '装运港',
        prop: 'fromPort',
        placeholder: '请选择装运港',
        attrs: {
          style: { width: '100%' },
          filterable: true,
          clearable: true
        },
        children: portInfoList
      },
      {
        type: 'select',
        label: '中转港',
        prop: 'transitPort',
        placeholder: '请选择中转港',
        attrs: {
          style: { width: '100%' },
          filterable: true,
          clearable: true
        },
        children: portInfoList
      },
      {
        type: 'select',
        label: '目的港',
        prop: 'toPort',
        placeholder: '请选择目的港',
        attrs: {
          style: { width: '100%' },
          filterable: true,
          clearable: true
        },
        children: portInfoList
      },

      // 缺少 出口公司-中转公司-等后端提供字段

      {
        type: 'select',
        label: '出口公司',
        prop: 'exportCompanyId',
        placeholder: '请选择出口公司',
        attrs: {
          style: { width: '100%' },
          filterable: true,
          clearable: true
        },
        children: financeSubjectList
      },
      {
        type: 'select',
        label: '中转公司',
        prop: 'transitCompanyId',
        placeholder: '请选择中转公司',
        attrs: {
          style: { width: '100%' },
          filterable: true,
          clearable: true
        },
        children: financeSubjectList
      },

      {
        type: 'input',
        label: '箱号',
        prop: 'containerNo',
        placeholder: '请输入箱号',
        attrs: {
          style: { width: '100%' },
          clearable: true
        }
      },
      {
        type: 'select',
        label: '船公司',
        prop: 'carrierCompanyId',
        placeholder: '请选择船公司',
        attrs: {
          style: { width: '100%' },
          filterable: true,
          clearable: true
        },
        children: financeSubjectList
      }
    ]

    return list
  }

  return {
    mergeOptions,
    vesselTrackingOptions
  }
}

// 体积= 长*宽*高*数量
export const computeVolume = (item) => {
  const { packageHeight, packageLength, packageWidth, qty } = item
  if ([packageHeight, packageLength, packageWidth, qty].every((item) => item)) {
    item.volume = Number(
      formatDecimal(
        (packageHeight * packageLength * packageWidth * qty) / 1000000,
        VOLUMN_PRECISION
      )
    )
  }
}

export const computeList = (
  mapList: Array<{ computeKey: string; targetKey: string }>,
  list: any[],
  data: any
) => {
  // 用来存储变量的
  const map: any = {}
  mapList.forEach((item) => {
    map[item.targetKey] = 0
  })

  list.forEach((item) => {
    mapList.forEach((mapItem) => {
      map[mapItem.targetKey] += (item[mapItem.computeKey] || 0) * item.qty
    })
  })
  for (const key in map) {
    unref(data)[key] = Number(formatDecimal(map[key], VOLUMN_PRECISION))
  }
  return data
}

export const computeFirstMileList = (list: any[], data: any) => {
  const mapList = [
    { computeKey: 'volume', targetKey: 'totalVolume' },
    { computeKey: 'packageWeight', targetKey: 'totalWeight' },
    { computeKey: 'weight', targetKey: 'netWeight' },
    { computeKey: 'qty', targetKey: 'totalQty' }
  ]
  return computeList(mapList, list, data)
}

// 编辑回显也给它最新带过来
export const addFbaBarCode = (val, formData) => {
  if (!val?.country) return
  // 合并的时候props.items后进来所以需要延迟调用-但是变化核心是这里
  setTimeout(async () => {
    const productIds = formData.value.map((item) => item.productId)
    if (!productIds?.length) return
    try {
      const countryList = getIntDictOptions(DICT_TYPE.COUNTRY_CODE)
      const countryCode = countryList.find((item) => val.country === item.label)?.value as number

      const changeUnde = () => {
        formData.value.forEach((item) => {
          item.fbaBarCode = undefined
        })
      }

      if (!countryCode && countryCode !== 0) {
        changeUnde()
        return
      }

      const data = await CustomRuleApi.getCustomRuleListByCountryProduct({
        // country: val.country,
        countryCode,
        productIds
      })
      if (data?.length) {
        formData.value.forEach((item) => {
          const fbaBarCode = data.find((a) => a.productId === item.productId)?.fbaBarCode
          item.fbaBarCode = fbaBarCode
        })
      } else {
        changeUnde()
      }
    } catch (e) {
      console.log(e, 'e')
    }
  }, 100)
}

export const addCompanyList = (val, formData) => {
  const changeUnde = () => {
    formData.value.forEach((item) => {
      item.companyList = []
    })
  }

  // 目的仓被叉掉删除
  if (!val?.value) {
    changeUnde()
    return
  }

  // 伪代码开发
  // 合并的时候props.items后进来所以需要延迟调用-但是变化核心是这里
  setTimeout(async () => {
    // const productIds = formData.value.map((item) => item.productId)
    // const deptIds = formData.value.map((item) => item.deptId)
    // if (!productIds?.length || !deptIds?.length) return

    try {
      const idList: any = []
      formData.value.forEach((item) => {
        const obj = {
          productId: item.productId,
          deptId: item.deptId
        }
        idList.push(obj)
      })

      if (!idList?.length) return

      const queryData = {
        warehouseId: val.value,
        idList
      }

      // 假设查询到了数据
      // const data = await CustomRuleApi.getCustomRuleListByCountryProduct(queryData)
      const data = [{ companyList: [], productId: 1, deptId: 1 }] as any // 二维数组

      // 返回的应该是对应companyList数组

      if (data?.length) {
        formData.value.forEach((item) => {
          const target = data.find(
            (a) => a.productId === item.productId && a.deptId === item.deptId
          )
          if (target) {
            item.companyList = target.companyList || []
          } else {
            item.companyList = []
          }
        })
      } else {
        changeUnde()
      }

      // const countryList = getIntDictOptions(DICT_TYPE.COUNTRY_CODE)
      // const countryCode = countryList.find((item) => val.country === item.label)?.value as number

      // const data = await CustomRuleApi.getCustomRuleListByCountryProduct({
      //   : val.country,
      //   productIds
      // })

      // const changeUnde = () => {
      //   formData.value.forEach((item) => {
      //     item.fbaBarCode = undefined
      //   })
      // }

      // if (!countryCode && countryCode !== 0) {
      //   changeUnde()
      //   return
      // }

      // const data = await CustomRuleApi.getCustomRuleListByCountryProduct({
      //   // country: val.country,
      //   countryCode,
      //   productIds
      // })
      // if (data?.length) {
      //   formData.value.forEach((item) => {
      //     const fbaBarCode = data.find((a) => a.productId === item.productId)?.fbaBarCode
      //     item.fbaBarCode = fbaBarCode
      //   })
      // } else {
      //   changeUnde()
      // }
    } catch (e) {
      console.log(e, 'e')
    }
  }, 100)
}

// 添加单个company
export const addCompany = (warehouse, row) => {
  // const changeUnde = () => {
  //   formData.value.forEach((item) => {
  //     item.companyList = []
  //   })
  // }

  // 目的仓被叉掉删除-批量监听warehouse会替你处理
  if (!warehouse?.value) {
    // changeUnde()
    return
  }
  if (!row.productId || row.deptId) {
    row.companyList = []
    return
  }

  // 伪代码开发
  // 合并的时候props.items后进来所以需要延迟调用-但是变化核心是这里
  setTimeout(async () => {
    try {
      const { productId, deptId } = row
      const idList = [{ productId, deptId }]
      if (!idList?.length) return

      const queryData = {
        warehouseId: warehouse.value,
        idList
      }

      // 假设查询到了数据
      // const data = await CustomRuleApi.getCustomRuleListByCountryProduct(queryData)
      const data = [{ companyList: [], productId: 1, deptId: 1 }] as any // 二维数组

      // 返回的应该是对应companyList数组
      if (data?.length) {
        row.companyList = data[0].companyList || []
      } else {
        row.companyList = []
      }
    } catch (e) {
      console.log(e, 'e')
    }
  }, 100)
}
