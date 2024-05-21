/**
 * 常量
 */
export default {
  /**
   * API地址
   */
  apiUrl: import.meta.env.VITE_API_URL,

  /**
   * 第三方登录地址
   */
  thirdLoginUrl: import.meta.env.VITE_API_URL + '/third/login',

  /**
   * 登录成功页面地址
   */
  loginSuccessPage: import.meta.env.VITE_API_URL + '/',

  /**
   * 文件上传地址
   */
  uploadUrl: import.meta.env.VITE_API_URL + '/storage/uploadFile'

}
