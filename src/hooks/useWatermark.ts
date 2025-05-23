import { useAppStore } from '@/stores/modules/app.ts'

const domSymbol = Symbol('watermark-dom')

export function useWatermark(appendEl: HTMLElement | null = document.body) {
  const appStore = useAppStore()
  const func: any = () => {}
  const id = domSymbol.toString()
  const clearWatermark = () => {
    const domId = document.getElementById(id)
    if (domId) {
      appendEl?.removeChild(domId)
    }
    window.removeEventListener('resize', func)
  }
  const createWatermark = (str: string) => {
    clearWatermark()

    const can = document.createElement('canvas')
    can.width = 300
    can.height = 240

    const cans = can.getContext('2d')
    if (cans) {
      cans.rotate((-20 * Math.PI) / 120)
      cans.font = '15px Verdana'
      cans.fillStyle = 'rgba(0, 0, 0, 0.15)'
      cans.textAlign = 'left'
      cans.textBaseline = 'middle'
      cans.fillText(str, can.width / 20, can.height)
    }

    const div = document.createElement('div')
    div.id = id
    div.style.pointerEvents = 'none'
    div.style.top = '0px'
    div.style.left = '0px'
    div.style.position = 'absolute'
    div.style.zIndex = '10000'
    div.style.width = document.documentElement.clientWidth + 'px'
    div.style.height = document.documentElement.clientHeight + 'px'
    div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'
    appendEl?.appendChild(div)
    return id
  }

  function setWatermark(str: string) {
    createWatermark(str)
    window.addEventListener('resize', () => createWatermark(appStore.theme.watermark))
  }

  return { setWatermark, clearWatermark }
}
