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
  uploadUrl: import.meta.env.VITE_API_URL + '/storage/uploadFile',

  /**
   * 系统用户的初始密码
   */
  SYSTEM_USER_INIT_PASSWORD : "system.user.init.password"

}

// Dict 字典

/**
 * 字典系统显示隐藏类型
 */
export const DictSysShowHide = {
  SHOW: 1, // 显示
  HIDE: 0, // 隐藏
}

// 通用状态枚举
export const StatusType = {
  ENABLE: 1, // 开启
  DISABLE: 0 // 停用
}
