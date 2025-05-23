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
export const deleteByIdsApi = (ids: string[]) => {
  return request.delete('/system/menu', { data: { ids } })
}

/**
 * 查询系统菜单详情
 *
 * @param id ID
 */
export const getByIdApi = (id: string) => {
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
export async function getPermissionApi() {
  return request.get('/system/menu/permission')
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
 * @param idRef 菜单ID
 */
export const getCheckAuthorityUniqueApi = (authority: string, idRef: Ref) => {
  return request.get('/system/menu/checkAuthorityUnique', { params: { id: idRef.value, authority } })
}
