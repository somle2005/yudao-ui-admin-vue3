import { getUserPage } from '@/api/system/user'

const userKey = 'userInfo'
export const saveUser = (user: any) => {
  localStorage.setItem(userKey, JSON.stringify(user))
}

export const getUser = () => {
  const data = localStorage.getItem(userKey)
  return data ? JSON.parse(data) : {}
}

export const getUserId = () => {
  return getUser().userId
}

const deptKey = 'deptInfo'
export const saveDept = (user: any) => {
  localStorage.setItem(deptKey, JSON.stringify(user))
}

export const getDept = () => {
  const data = localStorage.getItem(deptKey)
  return data ? JSON.parse(data) : {}
}

export const getDeptAndSaveCache = (userInfo: any) => {
  getUserPage({ nickname: userInfo?.user?.nickname })
    .then((res) => {
      if (res?.list.length) {
        saveDept(res.list[0])
      } else {
        saveDept({})
      }
    })
    .catch((e) => {
      console.log(e, '报错了')
    })
}
