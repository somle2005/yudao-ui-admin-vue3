export const useInitNum = () => {
  let initNum = 0
  const addInitNum = () => {
    nextTick(() => {
      initNum++
    })
  }
  const judgeNum = () => {
    return initNum < 1
  }
  return {
    addInitNum,
    judgeNum
  }
}
