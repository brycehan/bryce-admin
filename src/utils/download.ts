import request from '@/utils/request'
import { ElLoading, ElMessage } from 'element-plus'

/**
 * 下载
 *
 * @param config 请求配置
 */
const download = (config?: any) => {
  if (!useAuthStore().permitAccess()) return
  const downloadLoadingInstance = ElLoading.service({ text: '正在下载数据，请稍候', background: 'rgba(0, 0, 0, 0.7)' })
  // 设置responseType 响应类型为blob，响应的直接是个blob对象
  request
    .request({
      ...config,
      timeout: 60000,
      responseType: 'blob',
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
            filename = contentDisposition
              .split(';')
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
    ...config,
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
    ...config,
  })
}

/**
 * json格式下载
 *
 * @param data 下载的数据
 * @param filename 文件名
 */
const json = (data: Blob, filename: string) => {
  downloadBlob(data, filename, 'application/json')
}

/**
 * 下载blob对象
 *
 * @param data 下载的数据
 * @param filename 文件名
 * @param type 下载文件类型
 */
const downloadBlob = (data: Blob, filename: string, type: string) => {
  const blob = new Blob([data], { type })
  const reader = new FileReader()
  reader.readAsDataURL(blob)
  reader.onload = function (e: any) {
    // 转换完成，创建一个a标签用于下载
    const a = document.createElement('a')
    a.download = filename
    a.href = e.target.result
    // 在body中插入a元素
    document.body.insertAdjacentElement('afterend', a)
    a.click()
    a.remove()
  }
}

const base64ToFile = (base64: any, fileName: string) => {
  // 将base64按照 , 进行分割 将前缀  与后续内容分隔开
  const data = base64.split(',')
  // 利用正则表达式 从前缀中获取图片的类型信息（image/png、image/jpeg、image/webp等）
  const type = data[0].match(/:(.*?);/)[1]
  // 从图片的类型信息中 获取具体的文件格式后缀（png、jpeg、webp）
  const suffix = type.split('/')[1]
  // 使用atob()对base64数据进行解码  结果是一个文件数据流 以字符串的格式输出
  const bstr = window.atob(data[1])
  // 获取解码结果字符串的长度
  let n = bstr.length
  // 根据解码结果字符串的长度创建一个等长的整形数字数组
  // 但在创建时 所有元素初始值都为 0
  const u8arr = new Uint8Array(n)
  // 将整形数组的每个元素填充为解码结果字符串对应位置字符的UTF-16 编码单元
  while (n--) {
    // charCodeAt()：获取给定索引处字符对应的 UTF-16 代码单元
    u8arr[n] = bstr.charCodeAt(n)
  }

  // 将File文件对象返回给方法的调用者
  return new File([u8arr], `${fileName}.${suffix}`, {
    type: type,
  })
}

export default { get, post, json, base64ToFile }
