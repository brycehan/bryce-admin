import ImageViewer from './ImageViewer.vue'
import { isClient } from '@/utils/is'
import { createVNode, render, type VNode } from 'vue'

let instance: VNode

export interface ImageViewerProps {
  urlList?: string[]
  zIndex?: number
  initialIndex?: number
  infinite?: boolean
  hideOnClickModal?: boolean
  teleported?: boolean
  show?: boolean
}

export function createImageViewer(options: ImageViewerProps) {
  if (!isClient) return
  const {
    urlList,
    initialIndex = 0,
    infinite = true,
    hideOnClickModal = false,
    teleported = false,
    zIndex = 2000,
    show = true,
  } = options

  const propsData: Partial<ImageViewerProps> = {}
  const container = document.createElement('div')
  propsData.urlList = urlList
  propsData.initialIndex = initialIndex
  propsData.infinite = infinite
  propsData.hideOnClickModal = hideOnClickModal
  propsData.teleported = teleported
  propsData.zIndex = zIndex
  propsData.show = show

  document.body.appendChild(container)
  instance = createVNode(ImageViewer, propsData)
  render(instance, container)
}
