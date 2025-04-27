import type { ThemeConfig } from '@/stores/theme/typings'

/**
 * 主题色处理
 *
 * @param theme 主题
 */
export const handleThemePrimary = (theme: ThemeConfig) => {
  document.documentElement.style.setProperty('--el-color-primary', theme.primaryColor)
  for (let i = 1; i <= 9; i++) {
    document.documentElement.style.setProperty(
      `--el-color-primary-light-${i}`,
      `${getLightColor(theme.primaryColor, i / 10)}`,
    )
    document.documentElement.style.setProperty(
      `--el-color-primary-dark-${i}`,
      `${getDarkColor(theme.primaryColor, i / 10)}`,
    )
  }
}

/**
 * hex颜色转rgb颜色
 *
 * @param hex 颜色，如：#409eff
 * @returns rgb数组 如：[64,158,255]
 */
const hexToRgb = (hex: any) => {
  const reg = /^#?[0-9A-Fa-f]{6}$/
  if (!reg.test(hex)) {
    console.error('hexToRgb:', '颜色格式不正确')
    return null
  }
  return hex
    .replace(/#/, '')
    .match(/../g)
    .map((x: any) => parseInt(x, 16))
}

/**
 * rgb颜色转hex颜色
 *
 * @param rgb rgb数组 如：[64,158,255]
 * @returns hex 颜色，如：#409eff
 */
const rgbToHex = (rgb: any) => {
  return '#' + rgb.map((x: any) => ('0' + parseInt(x).toString(16)).slice(-2)).join('')
}

/**
 * 变浅颜色值
 *
 * @param color hex 颜色值 如：#409eff
 * @param level 百分比，如0.1
 * @returns 浅级别的颜色值
 */
const getLightColor = (color: string, level: number) => {
  const rgb = hexToRgb(color)
  for (let i = 0; i < 3; i++) {
    rgb[i] = Math.floor((255 - rgb[i]) * level + rgb[i])
  }
  return rgbToHex(rgb)
}

/**
 * 变深颜色值
 *
 * @param color hex 颜色值 如：#409eff
 * @param level 百分比，如0.1
 * @returns 深级别的颜色值
 */
const getDarkColor = (color: string, level: number) => {
  const rgb = hexToRgb(color)
  for (let i = 0; i < 3; i++) {
    rgb[i] = Math.floor(rgb[i] * (1 - level))
  }
  return rgbToHex(rgb)
}
