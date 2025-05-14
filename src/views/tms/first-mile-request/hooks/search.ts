import { getDeptTree, getUserList } from '@/commonData'
import { getWMSWarehouseList } from '@/commonData/wms'
import { FormOptions } from '@/components/SmForm/src/types/types'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'

export const useSearchForm = (handleQuery, queryParams) => {
  const WMSWarehouseList = getWMSWarehouseList()
  const { deptList, defaultProps } = getDeptTree()
  getWMSWarehouseList(WMSWarehouseList)
  const userList = getUserList()
  const searchFormOptions = ref<Array<FormOptions>>([
    {
      type: 'input',
      placeholder: '请输入单据编号',
      prop: 'code',
      label: '单据编号',
      attrs: {
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      }
    },
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
    // },

    {
      type: 'select',
      label: '目的仓',
      prop: 'toWarehouseId',
      placeholder: '请选择目的仓',
      attrs: {
        style: { width: '100%' },
        filterable: true,
        clearable: true
      },
      children: WMSWarehouseList
    },

    {
      requiredFlag: true,
      type: 'select',
      placeholder: '请选择申请人',
      prop: 'requesterId',
      label: '申请人',
      attrs: {
        class: '!w-240px',
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: userList
    },

    {
      requiredFlag: true,
      type: 'tree-select',
      label: '申请部门',
      prop: 'requestDeptId',
      placeholder: '请选择申请部门',
      attrs: {
        'node-key': 'id',
        'check-strictly': true,
        props: defaultProps,
        data: deptList,
        style: { width: '100%' },
        filterable: true,
        clearable: true
      }
    },

    {
      type: 'select',
      label: '审核状态',
      prop: 'auditStatus',
      placeholder: '请选择审核状态',
      attrs: {
        style: { width: '100%' },
        filterable: true,
        clearable: true
      },
      children: getIntDictOptions(DICT_TYPE.SRM_AUDIT_STATUS)
    },
    {
      type: 'select',
      label: '关闭状态',
      prop: 'offStatus',
      placeholder: '请选择关闭状态',
      attrs: {
        style: { width: '100%' },
        filterable: true,
        clearable: true
      },
      children: getIntDictOptions(DICT_TYPE.SRM_OFF_STATUS)
    },
    {
      type: 'select',
      label: '订购状态',
      prop: 'orderStatus',
      placeholder: '请选择订购状态',
      attrs: {
        style: { width: '100%' },
        filterable: true,
        clearable: true
      },
      children: getIntDictOptions(DICT_TYPE.SRM_ORDER_STATUS)
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
