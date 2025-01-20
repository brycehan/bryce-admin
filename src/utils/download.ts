import request from '@/utils/request'
import { ElLoading, ElMessage } from 'element-plus'

/**
 * 下载
 *
 * @param config 请求配置
 */
const download = (config?: any) => {
  const downloadLoadingInstance = ElLoading.service({text: '正在下载数据，请稍候', background: "rgba(0, 0, 0, 0.7)"})
  // 设置responseType 响应类型为blob，响应的直接是个blob对象
  request
    .request({
      ...config,
      timeout: 60000,
      responseType: 'blob'
    })
    .then((response) => {
      const blob = new Blob([response.data])
      const reader = new FileReader()

      // 请求结果处理
      if (toString.call(response.data) === '[object Blob]') {
        reader.readAsDataURL(blob)
        reader.onload = function (e: any) {
          // 转换完成，创建一个a标签用于下载
          const a = document.createElement('a')
          const contentDisposition = decodeURI(response.headers['content-disposition'])
          let filename = contentDisposition.split("''")[1] || config.filename
          if (typeof filename === 'undefined') {
            filename = contentDisposition.split(';')
              .map((item: string) => item.trim().replaceAll('"', ''))
              .filter((item: string) => item.startsWith('filename='))
              .map((item: string) => item.split('filename=')[1])
          }
          a.download = filename
          a.href = e.target.result
          // 在body中插入a元素
          document.body.insertAdjacentElement('afterend', a)
          a.click()
          a.remove()
        }
      } else {
        reader.readAsText(blob)
        reader.onload = function (e: any) {
          ElMessage.error('下载文件出现错误，请联系管理员！')
          console.error('下载文件出现错误', JSON.parse(e.target.result))
        }
      }
    })
    .catch((error) => {
      ElMessage.error('下载文件出现错误，请联系管理员！')
      console.error('下载文件出现错误', error)
    })
    .finally(() => {
      // 隐藏loading
      downloadLoadingInstance.close()
    })
}

/**
 * get请求
 *
 * @param url 请求地址
 * @param config 请求配置
 */
const get = (url: string, config?: any) => {
  return download({
    url: url,
    method: 'GET',
    ...config
  })
}

/**
 * post请求
 *
 * @param url 请求地址
 * @param data 请求数据
 * @param config 请求配置
 */
const post = (url: string, data?: any, config?: any) => {
  return download({
    url: url,
    method: 'POST',
    data: data,
    ...config
  })
}

export default { get, post }
