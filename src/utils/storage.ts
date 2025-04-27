import type { ThemeConfig } from '@/stores/theme/typings'
import { themeConfig } from '@/stores/theme/config'

const Cache = {
  userKey: 'user',
  componentSizeKey: 'componentSize',
  languageKey: 'language',
  themeKey: 'theme',
}

class Storage {
  setUser = (value: any) => {
    return Tool.setItem(Cache.userKey, value)
  }

  getUser = (): any => {
    return Tool.getItem(Cache.userKey)
  }

  getTheme = (): ThemeConfig => {
    return (Tool.getItem(Cache.themeKey) as ThemeConfig) || themeConfig
  }

  setTheme(theme: ThemeConfig) {
    Tool.setItem(Cache.themeKey, theme)
  }

  removeTheme() {
    Tool.removeItem(Cache.themeKey)
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
  },
}

export default new Storage()
