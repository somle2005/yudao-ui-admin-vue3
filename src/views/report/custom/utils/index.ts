import { getDept } from '@/utils/cache'
import { DICT_TYPE, getDictOptions } from '@/utils/dict'

export const createMapStyle = (key: string) => {
  try {
    const dictOptions = getDictOptions(DICT_TYPE.REPORT_MAP)

    const dict = dictOptions.find((item) => item.label === key)
    if (!dict) {
      return ref({
        width: '100%',
        height: '1200px'
      })
    }
    const height = dict.value + 'px'
    return ref({
      width: '100%',
      height
    })
  } catch (e) {
    console.log(e, '查询地图字典报错')
  }
}

// export const toUrl = (value: string): string => {
//   const deptList = getDept()
//   let valueStr = value
//   // dept会包含至少 AOK 、CBD、HCD、EBD
//   const containList = ['AOK', 'CBD', 'HCD', 'EBD']
//   // AOK部门专设角色-所以实际上只会匹配到一个
//   let containStr
//   for (let i = 0; i < deptList.length; i++) {
//     const item = deptList[i]
//     const { name } = item
//     const matchStr = containList.find((item) => name.includes(item))
//     if (matchStr) {
//       containStr = matchStr
//       break
//     }
//   }
//   if (containStr) {
//     valueStr = valueStr + '&dept=' + containStr
//   }
//   console.log(valueStr, 'valueStr-报表拼接url')
//   return valueStr
// }

export const toUrl = (value: string): string => {
  const deptList = getDept()
  let valueStr = value

  const extractLetters = (str) => {
    // 匹配所有英文字母（不包含数字和其他字符）
    return str.match(/[a-zA-Z]+/g) || []
  }
  
  const deptStrList: string[] = []
  for (let i = 0; i < deptList.length; i++) {
    const item = deptList[i]
    const { name } = item
    const lettersList = extractLetters(name)
    if (lettersList.length && !deptStrList.includes(lettersList[0])) {
      deptStrList.push(lettersList[0])
    }
  }

  if (deptStrList.length) {
    valueStr = valueStr + '&dept=' + deptStrList.join(',')
  }
  console.log(valueStr, 'valueStr-报表拼接url')
  return valueStr
}
