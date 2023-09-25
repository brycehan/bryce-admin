import {addDateRange, mergeDefaultOptions} from "@/utils/tool";
import {ElMessage, ElMessageBox} from "element-plus";
import {list} from "@/api/system/org";

export type StateOptions = {
    api: {
        saveOrUpdate?: Function
        getById?: Function
        emit?: Function
        page?: Function
        list?: Function
        deleteByIds?: Function
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
        layout: "total,sizes,prev,pager,next,jumper",
        data: [],
        dataSelections: [],
        loading: false,
        visible: false
    }

    // 覆盖默认值
    const state = mergeDefaultOptions(defaultOptions, options)

    /** 分页查询 */
    const getPage = (current: number = 1, size?: number) => {
        state.current = current

        if(size !== undefined){
            state.size = size
        }
        state.loading = true

        // 添加范围查询条件
        let queryParams = state.queryForm
        for(const key in state.range) {
            queryParams = addDateRange(state.queryForm, state.range[key], key)
        }

        const body = {
            current: state.current,
            size: state.size,
            orderItems: state.orderItems,
            ...queryParams
        }

        state.api.page(body).then((response: any) => {
            const { list, total } = response.data
            state.data = list
            state.total = total
        })
        state.loading = false
    }

    /** 列表查询 */
    const getList = () => {
        state.loading = true

        state.api.list(state.queryForm).then((response: any) => {
            state.data = response.data
        })
        state.loading = false
    }

    /** 调整当前显示条数 */
    const handleSizeChange = (size: number) => {
        getPage(1, size)
    }

    /** 跳转到指定页 */
    const handleCurrentChange = (current: number) => {
        getPage(current)
    }

    /** 批量删除 */
    const handleDeleteBatch = (id?: bigint) => {
        let data: any[] = []
        if (id) {
            data = [id]
        } else {
            data = state.dataSelections ? state.dataSelections : []
            if (data.length === 0) {
                ElMessage.warning('请选择删除的记录')
                return
            }
        }
        ElMessageBox.confirm('确定进行删除操作？', '提示', {
            type: 'warning'
        })
            .then(() => {
                state.api.deleteByIds(data).then(() => {
                    ElMessage.success('删除成功')
                    getPage()
                })
            })
            .catch((error) => {
                console.error(error)
            })
    }

    /** 多选 */
    const handleSelectionChange = (selections: any[]) => {
        state.dataSelections = selections.map((item: any) => item.id)
    }

    /** 获取详情数据 */
    const getData = (id: bigint) => {

        state.api.getById(id).then((res: any) => {
            Object.assign(state.dataForm, res.data)
        })
    }

    /** 表单提交 */
    const handleSaveOrUpdate = () => {
        state.api.saveOrUpdate(state.dataForm).then(() => {
            ElMessage.success({
                message: '操作成功',
                duration: 500,
                onClose: () => {
                    state.visible = false
                    state.api.emit('refreshPage')
                }
            })
        })

    }

    return {
        getPage,
        getList,
        handleSizeChange,
        handleCurrentChange,
        handleDeleteBatch,
        handleSelectionChange,
        getData,
        handleSaveOrUpdate
    }
}