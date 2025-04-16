interface ResponseResult<T> {
  code: number
  message: string
  data: T
  type: number
  time: string
}

interface PageResult<T> {
  total: number
  list: T[]
}
