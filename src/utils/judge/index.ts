export const notEmpty = (val) => {
  return ![null, undefined, ''].includes(val)
}

export const isValRepeat = (list: any[], val: any, key: string) => {
  try {
    let hasRepeat = false
    const map = {}

    for (const item of list) {
      const keyId = item[key]
      if (val === keyId) {
        if (!map[keyId]) {
          map[keyId] = 1
        } else {
          hasRepeat = true
          break
        }
      }
    }
    return hasRepeat
  } catch (e) {
    console.log(e, '报错了')
  }
}

export const getRepeatMap = (
  list: any[],
  keyMap?: {
    parentKey
    sonKey
  }
) => {
  try {
    let repeatFlag = false
    const { parentKey = 'productId', sonKey = 'binId' } = keyMap || {}
    const repeatMap = {}
    for (const item of list) {
      const parentId = item[parentKey]
      const sonId = item[sonKey]

      if (!repeatMap[parentId]) {
        repeatMap[parentId] = {
          [sonId]: 1
        }
      } else {
        if (repeatMap[parentId][sonId]) {
          repeatFlag = true
          repeatMap[parentId][sonId] += 1
        } else {
          repeatMap[parentId][sonId] = 1
        }
      }
    }
    return repeatMap
  } catch (e) {
    console.log(e, '报错了')
  }
}

// 查找数组中是否有不同prop属性
export const isDifferentProp = (list: any[], prop: string) => {
  // prop-supplierId
  const saveList: number[] = []
  let flag = false
  for (let i = 0; i < list.length; i++) {
    const propId = list[i][prop]
    if (!saveList.includes(propId)) {
      saveList.push(propId)
      // 说明有不同的
      if (saveList.length > 1) {
        flag = true
        break
      }
    }
  }
  return flag
}
