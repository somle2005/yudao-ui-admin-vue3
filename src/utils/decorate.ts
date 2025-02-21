import { debounce } from 'lodash-es'
export const createDBFn = (fn: () => void, delay = 500) => {
  const DBFn = debounce(fn, delay)
  return DBFn
}
