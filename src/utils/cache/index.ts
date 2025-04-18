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

