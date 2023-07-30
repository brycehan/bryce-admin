const Cache = {
    tokenKey: 'token'
}

export const setToken = (token: any) => {
    localStorage.setItem(Cache.tokenKey, token)
}

export const getToken = () => {
    return localStorage.getItem(Cache.tokenKey)
} 