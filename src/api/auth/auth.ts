import request from '@/utils/request'
import type { LoginDto, ResponseResultLoginVo } from '@/types/modules/auth'

/**
 * 账号登录
 *
 * @param data 登录参数
 */
export async function postLoginByAccountApi(data: LoginDto) {
  return request.post<any, ResponseResultLoginVo>('/auth/loginByAccount', data)
}

/**
 * 手机号登录
 *
 * @param data 登录参数
 */
export async function postLoginByPhoneApi(data: LoginDto) {
  return request.post<any, ResponseResultLoginVo>('/auth/loginByPhone', data)
}

/**
 * 系统登录用户详情
 */
export async function getCurrentUserApi() {
  return request.get('/auth/currentUser')
}

/**
 * 退出登录
 */
export async function getLogoutApi() {
  return request.get('/auth/logout')
}
