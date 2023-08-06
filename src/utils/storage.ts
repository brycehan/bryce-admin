const Cache = {
  tokenKey: 'token',
  sidebarOpenedKey: 'sidebarOpened'
}

export const setToken = (token: any) => {
  localStorage.setItem(Cache.tokenKey, token)
}

export const getToken = () => {
  return localStorage.getItem(Cache.tokenKey)
}

export const removeToken = () => {
  return localStorage.removeItem(Cache.tokenKey)
}

export const getSidebarOpened = (): boolean => {
  return Storage.getItem(Cache.sidebarOpenedKey) || false
}

export const setSidebarOpened = (status: boolean) => {
    return Storage.setItem(Cache.sidebarOpenedKey, status)
  }


const Storage = {
  setItem(key: string, value: any) {
    if (value === undefined) {
      return
    }
    localStorage.setItem(key, JSON.stringify(value))
  },
  getItem(key: string) {
    const json: any = localStorage.getItem(key)
    return JSON.parse(json)
  },
  removeItem(key: string) {
    localStorage.removeItem(key)
  },
  clear() {
    localStorage.clear()
  }
}
