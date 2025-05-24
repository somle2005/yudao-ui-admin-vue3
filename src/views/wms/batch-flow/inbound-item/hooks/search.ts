import { getDeptTree, getFinanceSubjectList, getProductList } from '@/commonData'
import { getWarehouseBinList, getWMSWarehouseList } from '@/commonData/wms'
import { FormOptions } from '@/components/SmForm/src/types/types'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'

export const useSearchForm = (handleQuery, queryParams) => {
  // const { deptList, defaultProps } = getDeptTree()
  // const financeSubjectList = getFinanceSubjectList()
  const productList = getProductList() // 产品列表
  const warehouseBinList = getWarehouseBinList()
  const WMSWarehouseList = getWMSWarehouseList()

  const searchFormOptions = ref<Array<FormOptions>>([
    {
      type: 'input',
      label: '入库单编号',
      prop: 'inboundNo',
      placeholder: '请输入入库单编号',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'select',
      placeholder: '请选择产品编码',
      prop: 'productId',
      label: '产品编码',
      attrs: {
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: productList
    },
    {
      type: 'select',
      label: '仓库',
      prop: 'warehouseId',
      placeholder: '请选择仓库',
      attrs: {
        style: { width: '100%' },
        filterable: true,
        clearable: true
      },
      children: WMSWarehouseList
    },
    {
      type: 'select',
      label: '库位',
      prop: 'binId',
      placeholder: '请选择库位',
      attrs: {
        style: { width: '100%' },
        filterable: true,
        clearable: true
      },
      children: warehouseBinList
    },

    // {
    //   type: 'tree-select',
    //   label: '库存归属',
    //   prop: 'deptId',
    //   placeholder: '请选择库存归属',
    //   attrs: {
    //     'node-key': 'id',
    //     'check-strictly': true,
    //     props: defaultProps,
    //     data: deptList,
    //     style: { width: '100%' },
    //     filterable: true,
    //     clearable: true
    //   }
    // },
    // {
    //   type: 'select',
    //   placeholder: '请选择库存公司',
    //   prop: 'companyId',
    //   label: '库存公司',
    //   attrs: {
    //     filterable: true,
    //     clearable: true,
    //     style: {
    //       width: '100%'
    //     }
    //   },
    //   children: financeSubjectList
    // },

    // {
    //   type: 'tree-select',
    //   label: '入库库存归属',
    //   prop: 'inboundDeptId',
    //   placeholder: '请选择入库库存归属',
    //   attrs: {
    //     'node-key': 'id',
    //     'check-strictly': true,
    //     props: defaultProps,
    //     data: deptList,
    //     style: { width: '100%' },
    //     filterable: true,
    //     clearable: true
    //   }
    // },
    // {
    //   type: 'select',
    //   placeholder: '请选择入库库存公司',
    //   prop: 'inboundCompanyId',
    //   label: '入库库存公司',
    //   attrs: {
    //     filterable: true,
    //     clearable: true,
    //     style: {
    //       width: '100%'
    //     }
    //   },
    //   children: financeSubjectList
    // },

    // {
    //   type: 'date-picker',
    //   placeholder: '请选择创建时间',
    //   prop: 'createTime',
    //   label: '创建时间',
    //   attrs: {
    //     clearable: true,
    //     type: 'daterange',
    //     'value-format': 'x',
    //     'start-placeholder': '开始日期',
    //     'end-placeholder': '结束日期',
    //     defaultTime: [new Date('1 00:00:00'), new Date('1 23:59:59')],
    //     class: '!w-240px',
    //     style: {
  //       width: '100%'
    //     }
    //   }
    // }
  ])

  const events = {
    'keyup.enter': (e, item) => {
      handleQuery()
    }
  }

  searchFormOptions.value.forEach((item) => {
    item.events = events
    if (item.attrs) {
      item.attrs.class = '!w-240px'
    } else {
      item.attrs = {
        class: '!w-240px'
      }
    }
  })
  const getSearchFormData = () => {
    return queryParams
  }
  return {
    searchFormOptions,
    getSearchFormData
  }
}
