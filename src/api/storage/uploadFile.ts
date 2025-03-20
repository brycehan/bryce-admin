import request from '@/utils/request'

/**
 * 上传单个文件
 *
 * @param data 参数
 */
export const uploadFile = (data: any) => {
  return request.post('/storage/uploadFile', data)
}

/**
 * 上传多个文件
 *
 * @param data 参数
 */
export const uploadFileList = (data: any) => {
  return request.post('/storage/uploadFile/list', data)
}

export default {
  uploadFile,
  uploadFileList,
}
