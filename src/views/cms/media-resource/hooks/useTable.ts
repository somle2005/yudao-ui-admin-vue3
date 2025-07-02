import { useTableData } from '@/components/SmTable/src/utils'
import { dateFormatter } from '@/utils/formatTime'

export const useTable = () => {
  const { tableOptions, transformTableOptions } = useTableData()

  const fieldMap = {
    title: '资源标题',
    description: '资源描述',
    appCode: {
      label: '应用编码',
      slot: 'appCode',
      dictAttrs: { type: DICT_TYPE.CMS_APP_CODE }
    },
    moduleCode: {
      label: '应用编码',
      slot: 'moduleCode',
      dictAttrs: { type: DICT_TYPE.CMS_MODULE_CODE }
    },
    mediaType: {
      label: '资源类型',
      slot: 'mediaType',
      dictAttrs: { type: DICT_TYPE.CMS_MEDIA_TYPE }
    },
    // updateTime: {
    //   label: '更新时间',
    //   formatter: dateFormatter,
    //   width: '200px'
    // },
    // updaterName: '更新人',
    createTime: {
      label: '创建时间',
      formatter: dateFormatter,
      width: '200px'
    },
    // creatorName: '创建人',
    operate: {
      label: '操作',
      slot: 'operate',
      fixed: 'right',
      width: '200px'
    }
  }
  tableOptions.value = transformTableOptions(fieldMap)

  return {
    tableOptions
  }
}
