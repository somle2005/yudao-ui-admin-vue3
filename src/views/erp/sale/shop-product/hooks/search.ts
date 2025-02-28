import { FormOptions } from '@/components/SmForm/src/types/types'
import { getIntDictOptions } from '@/utils/dict'
import { getShopList, getDeptTree } from '@/commonData/index'
import { defaultProps } from '@/utils/tree'

export const useSearchForm = (handleQuery, queryParams) => {
  const shopList = ref([])
  const deptList = ref([])
  getShopList(shopList)
  getDeptTree(deptList)
  const searchFormOptions = ref<Array<FormOptions>>([
    {
      type: 'input',
      label: '店铺SKU',
      prop: 'name',
      placeholder: '请输入店铺SKU',
      attrs: {
        class: '!w-240px',
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'input',
      label: '平台',
      prop: 'platform',
      placeholder: '请输入平台',
      attrs: {
        class: '!w-240px',
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'select',
      placeholder: '请选择店铺名称',
      // prop: 'shopId',
      prop: 'account',
      label: '店铺名称',
      attrs: {
        class: '!w-240px',
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: shopList
    },
    {
      type: 'tree-select',
      placeholder: '请选择部门',
      prop: 'deptId',
      label: '部门',
      attrs: {
        class: '!w-240px',
        filterable: true,
        clearable: true,
        data: deptList,
        props: defaultProps,
        'check-strictly': true,
        'node-key': 'id'
        // style: {
        //   width: '100%'
        // }
      }
    },
    // {
    //   type: 'input',
    //   label: '店铺名称',
    //   prop: 'account',
    //   placeholder: '请输入店铺名称',
    //   attrs: {
    //     class: '!w-240px',
    //     style: { width: '100%' },
    //     clearable: true
    //   }
    // },
    {
      type: 'input',
      label: 'SKU编码',
      prop: 'barCode',
      placeholder: '请输入SKU编码',
      attrs: {
        class: '!w-240px',
        style: { width: '100%' },
        clearable: true
      }
    },
    {
      type: 'select',
      placeholder: '请选择状态',
      prop: 'status',
      label: '状态',
      // formItemConfig: {
      //   class: '!w-240px',
      // },
      attrs: {
        class: '!w-240px',
        filterable: true,
        clearable: true,
        style: {
          width: '100%'
        }
      },
      children: getIntDictOptions(DICT_TYPE.ERP_PRODUCT_LISTING_STATUS)
    }
  ])

  const events = {
    'keyup.enter': (e, item) => {
      handleQuery()
    }
  }

  searchFormOptions.value.forEach((item) => {
    item.events = events
  })
  const getSearchFormData = () => {
    return queryParams
  }
  return {
    searchFormOptions,
    getSearchFormData
  }
}
