import request from '@/utils/request'

export const saveOrUpdate = (data: any) => {
    if (data.id) {
        return request.put('/quartz/job', data)
    } else {
        return request.post('/quartz/job', data)
    }
}

export const deleteByIds = (ids: bigint[]) => {
    return request.delete('/quartz/job', { data: { ids } })
}

export const getById = (id: bigint) => {
    return request.get(`/quartz/job/${id}`)
}

export const page = (data: any) => {
    return request.post('/quartz/job/page', data)
}

export const run = (data: any) => {
    return request.put('/quartz/job/run', data)
}

export const changeStatus = (data: any) => {
    return request.put('/quartz/job/status', data)
}
