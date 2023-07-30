declare namespace API {
  type ResponseResultVoid = {
    /** 响应编码 */
    code?: number
    /** 响应消息 */
    message?: string
    /** 响应数据 */
    data?: Record<string, any>
    /** 响应时间 */
    time?: string
  }
}
