import { getUserDataPermission } from '@/api/system/user'

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
  return data ? JSON.parse(data) : []
}

export const getDeptAndSaveCache = (userInfo: any) => {
  getUserDataPermission({ id: userInfo?.user?.id })
    .then((res) => {
      saveDept(res.deptList)
    })
    .catch((e) => {
      console.log(e, '报错了')
    })
}
