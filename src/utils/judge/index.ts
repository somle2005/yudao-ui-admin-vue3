export const notEmpty = (val) => {
  return ![null, undefined, ''].includes(val)
}

export const hasRepeat = (
  list: any[],
  keyMap?: {
    parentKey
    sonKey
  }
) => {
  try {
    let hasRepeat = false
    const { parentKey = 'productId', sonKey = 'binId' } = keyMap || {}
    const map = {}
    for (const item of list) {
      const parentId = item[parentKey]
      const sonId = item[sonKey]

      if (!map[parentId]) {
        map[parentId] = {
          [sonId]: 1
        }
      } else {
        if (map[parentId][sonId]) {
          map[parentId][sonId] += 1
          hasRepeat = true
          break
        } else {
          map[parentId][sonId] = 1
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
