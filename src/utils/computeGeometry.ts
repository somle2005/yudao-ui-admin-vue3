/**
 *
 * @param list 数组列表
 * @param type 想要动态计算数组column字段的prop
 * @returns 返回计算后的最大长度 单位为px(最大长度30 最小长度10)
 */
export const computeColumnMinWidth = (list: Ref<any>, type: string) => {
  return computed(() => {
    const fontSize = 14
    const maxLength = 30
    const minLength = 10
    if (!list?.value?.length) return `${minLength * fontSize}px`
    let count = 0
    const strList = list.value.map((item) => item[type] && item[type].length).filter((item) => item)
    count = Math.max(...strList)
    count = Math.max(count, minLength)
    count = Math.min(count, maxLength)
    return `${count * fontSize}px`
  })
}
