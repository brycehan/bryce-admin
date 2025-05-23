import { addDateRange, mergeDefaultOptions } from '@/utils/tool'
import { ElMessage } from 'element-plus'
import modal from '@/utils/modal'

const authStore = useAuthStore()

export type StateOptions = {
  api: {
    saveOrUpdateApi?: Function
    getByIdApi?: Function
    postPageApi?: Function
    postListApi?: Function
    deleteByIdsApi?: Function
    postExportExcelApi?: Function
    emit?: Function
  }
  /** 查询条件 */
  queryForm?: any
  /** 范围查询条件 */
  range?: any
  /** 当前页码 */
  current?: number
  /** 每页条数 */
  size?: number
  /** 总条数 */
  total?: number
  /** 排序项 */
  orderItems?: any[]
  /** 分页显示可选择条数 */
  pageSizes?: any
  layout?: string
  /** 查询结果数据 */
  data?: any[]
  /** 数据选择集合 */
  dataSelections?: any[]
  /** 加载状态 */
  loading?: boolean
  /** 数据表单 */
  dataForm?: any
  /** 是否可见 */
  visible?: boolean
}

/** 通用增改删查功能封装 */
export const crud = (options: StateOptions) => {
  const defaultOptions: StateOptions = {
    api: {},
    queryForm: {},
    range: {},
    current: 1,
    size: 10,
    total: 0,
    orderItems: [],
    pageSizes: [10, 20, 50, 100, 200],
    layout: 'total,sizes,prev,pager,next,jumper',
    data: [],
    dataSelections: [],
    loading: false,
    visible: false,
  }

  // 覆盖默认值
  const state = mergeDefaultOptions(defaultOptions, options)

  /**
   * 分页查询
   *
   * @param current 当前页码
   * @param size 每页条数
   */
  const getPage = (current: number = 1, size?: number) => {
    state.current = current

    if (size !== undefined) {
      state.size = size
    }
    state.loading = true

    // 添加范围查询条件
    let queryParams = state.queryForm
    for (const key in state.range) {
      queryParams = addDateRange(state.queryForm, state.range[key], key)
    }

    const body = {
      current: state.current,
      size: state.size,
      orderItems: state.orderItems,
      ...queryParams,
    }

    state.api.postPageApi(body).then((response: any) => {
      const { list, total } = response.data
      state.data = list
      state.total = total
    })
    state.loading = false
  }

  /**
   * 列表查询
   */
  const getList = () => {
    state.loading = true

    state.api.postListApi(state.queryForm).then((response: any) => {
      state.data = response.data
    })
    state.loading = false
  }

  /**
   * 调整当前显示条数
   *
   * @param size 每页条数
   */
  const handleSizeChange = (size: number) => {
    getPage(1, size)
  }

  /**
   * 跳转到指定页
   *
   * @param current 当前页码
   */
  const handleCurrentChange = (current: number) => {
    getPage(current)
  }

  /**
   * 批量删除
   *
   * @param row 当前行数据
   * @param column 列字段名
   * @param columnName 列中文名
   * @param isPage 是否分页
   */
  const handleDeleteBatch = (column: string, columnName: string, row?: any, isPage: boolean = true) => {
    if (!authStore.permitAccess()) return

    let data: any[] = []
    if (row) {
      data.push(row)
    } else {
      data = state.dataSelections as []
    }

    if (data.length === 0) {
      ElMessage.warning('请选择删除的记录')
      return
    }
    const columns = data.map((item: any) => item[column]).join(',')
    modal
      .confirm(`是否确认删除${columnName}为“${columns}”的数据项？`)
      .then(() => {
        state.api.deleteByIdsApi(data.map((item) => item.id)).then(() => {
          ElMessage.success('删除成功')
          if (isPage) {
            getPage()
          } else {
            getList()
          }
        })
      })
      .catch((error) => {
        console.error(error)
      })
  }

  /**
   * 处理勾选变更
   *
   * @param selections 选中数据
   */
  const handleSelectionChange = (selections: any[]) => {
    state.dataSelections = selections
  }

  /**
   * 获取详情数据
   *
   * @param id ID
   */
  const getData = (id: string) => {
    return state.api.getByIdApi(id).then((res: any) => {
      Object.assign(state.dataForm, res.data)
    })
  }

  /**
   * 表单提交
   */
  const handleSaveOrUpdate = () => {
    state.api.saveOrUpdateApi(state.dataForm).then(() => {
      state.visible = false
      state.api.emit('refreshPage')
      if (state.dataForm.id) {
        ElMessage.success('修改成功')
      } else {
        ElMessage.success('新增成功')
      }
    })
  }

  /**
   * 导出
   */
  const handleDownloadExcel = () => {
    if (!authStore.permitAccess()) return

    // 添加范围查询条件
    let queryParams = state.queryForm
    for (const key in state.range) {
      queryParams = addDateRange(state.queryForm, state.range[key], key)
    }

    const body = {
      current: state.current,
      size: state.size,
      orderItems: state.orderItems,
      ...queryParams,
    }
    state.api.postExportExcelApi(body)
    return
  }

  /**
   * 处理排序
   */
  const handleSortChange = (data: any) => {
    const { prop, order } = data
    state.orderItems = [{ column: prop, asc: order === 'ascending' }]
    getPage()
  }

  return {
    getPage,
    getList,
    handleSizeChange,
    handleCurrentChange,
    handleDeleteBatch,
    handleSelectionChange,
    getData,
    handleSaveOrUpdate,
    handleDownloadExcel,
    handleSortChange,
  }
}
