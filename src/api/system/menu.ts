import request from '@/utils/request'

/**
 * 保存系统菜单
 *
 * @param data 参数
 */
export const saveOrUpdateApi = (data: any) => {
  if (data.id) {
    return request.put('/system/menu', data)
  } else {
    return request.post('/system/menu', data)
  }
}

/**
 * 删除系统菜单
 *
 * @param ids ID数组
 */
export const deleteByIdsApi = (ids: bigint[]) => {
  return request.delete('/system/menu', { data: { ids } })
}

/**
 * 查询系统菜单详情
 *
 * @param id ID
 */
export const getByIdApi = (id: bigint) => {
  return request.get(`/system/menu/${id}`)
}

/**
 * 系统菜单分页查询
 *
 * @param data 分页参数
 */
export const postPageApi = (data: any) => {
  return request.post('/system/menu/page', data)
}

/**
 * 系统菜单列表查询
 *
 * @param data 参数
 */
export const postListApi = (data: any) => {
  return request.post('/system/menu/list', data)
}

/**
 * 获取登录用户的权限集合
 */
export async function getAuthorityApi() {
  return request.get('/system/menu/authority')
}

/**
 * 获取菜单列表
 */
export async function getNavApi() {
  return request.get('/system/menu/nav')
}

/**
 * 校验权限标识是否唯一
 *
 * @param authority 权限标识
 * @param id 菜单ID
 */
export const getCheckAuthorityUniqueApi = (authority: string, id: number) => {
  return request.get('/system/menu/checkAuthorityUnique', { params: { id, authority } })
}
