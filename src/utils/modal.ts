import { ElLoading } from 'element-plus'

/**
 * 打开遮罩层
 *
 * @param text 遮罩文本
 */
const loading = (text: string) => {
  return ElLoading.service({ lock: true, text: text, background: "rgba(0, 0, 0, 0.7)"})
}

/**
 * 关闭遮罩层
 *
 * @param loadingInstance 遮罩层实例
 */
const closeLoading = (loadingInstance: any) => {
  loadingInstance.close()
}

export default {
  loading,
  closeLoading
}
