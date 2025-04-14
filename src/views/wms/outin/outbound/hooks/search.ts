import { getDeptTree, getFinanceSubjectList } from '@/commonData'
import { getWMSWarehouseList } from '@/commonData/wms'
import { FormOptions } from '@/components/SmForm/src/types/types'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'

export const useSearchForm = (handleQuery, queryParams) => {
  const WMSWarehouseList = getWMSWarehouseList()
  const { deptList, defaultProps } = getDeptTree()
  const financeSubjectList = getFinanceSubjectList()
  const searchFormOptions = ref<Array<FormOptions>>([
    {
      type: 'input',
      label: '单据号',
      prop: 'no',
      placeholder: '请输入单据号',
      attrs: {
        style: { width: '100%' },
        clearable: true
      }
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
    // {
    //   type: 'select',
    //   placeholder: '请选择状态',
    //   prop: 'status',
    //   label: '状态',
    //   attrs: {
    //     filterable: true,
    //     clearable: true,
    //     style: {
    //       width: '100%'
    //     }
    //   },
    //   children: getIntDictOptions(DICT_TYPE.WMS_VALID_STATUS)
    // },

    {
      type: 'select',
      placeholder: '请选择审核状态',
      prop: 'status',
      label: '审核状态',
      attrs: {
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: getIntDictOptions(DICT_TYPE.WMS_OUTBOUND_AUDIT_STATUS)
    },
    {
      requiredFlag: true,
      type: 'select',
      placeholder: '请选择库存主体',
      prop: 'companyId',
      label: '库存主体',
      attrs: {
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: financeSubjectList
    },
    {
      type: 'tree-select',
      label: '库存归属',
      prop: 'deptId',
      placeholder: '请选择库存归属',
      attrs: {
        'node-key': 'id',
        'check-strictly': true,
        props: defaultProps,
        data: deptList,
        style: { width: '100%' },
        filterable: true,
        clearable: true
      }
    }
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
