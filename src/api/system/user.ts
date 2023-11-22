import request from '@/utils/request'
import download from "@/utils/download";

export const saveOrUpdate = (data: any) => {
    if (data.id) {
        return request.put('/system/user', data)
    } else {
        return request.post('/system/user', data)
    }
}

export const deleteByIds = (ids: bigint[]) => {
    return request.delete('/system/user', { data: { ids } })
}

export const getById = (id: bigint) => {
    return request.get(`/system/user/${id}`)
}

export const page = (data: any) => {
    return request.post('/system/user/page', data)
}

export const downloadExcel = (data: any) => {
    download.post('/system/user/export', data)
}

/**
 * 导入地址
 */
export const importUrl = import.meta.env.VITE_API_URL + '/system/user/import'

