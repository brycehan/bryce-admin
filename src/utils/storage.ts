const Cache = {
  tokenKey: 'token',
  sidebarOpenedKey: 'sidebarOpened',
  componentSizeKey: 'componentSize'
}

class Storage {
  setToken = (token: any) => {
    localStorage.setItem(Cache.tokenKey, token)
  }

  getToken = () => {
    return localStorage.getItem(Cache.tokenKey)
  }

  removeToken = () => {
    return localStorage.removeItem(Cache.tokenKey)
  }

  setSidebarOpened = (status: boolean) => {
    return Tool.setItem(Cache.sidebarOpenedKey, status)
  }

  getSidebarOpened = (): boolean => {
    const sidebarOpened = Tool.getItem(Cache.sidebarOpenedKey)
    if (sidebarOpened === null) {
      return true
    }
    return sidebarOpened
  }

  setComponentSize = (fontSize: string) => {
    Tool.setItem(Cache.componentSizeKey, fontSize)
  }

  getComponentSize = (): string => {
    return Tool.getItem(Cache.componentSizeKey) || ''
  }
}
const Tool = {
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

export default new Storage()
