<template>
  <el-dialog
    v-model="state.visible"
    :title="!state.dataForm.id ? '新增菜单' : '修改菜单'"
    :close-on-click-modal="false"
  >
    <el-form
      ref="dataFormRef"
      :model="state.dataForm"
      :rules="dataRules"
      label-width="100"
      class="mr-4"
    >
      <el-form-item label="上级菜单" prop="parentId">
        <el-tree-select
          v-model="state.dataForm.parentId"
          ref="menuTreeRef"
          :data="menuList"
          :props="{ label: 'name', children: 'children' }"
          node-key="id"
          check-on-click-node
          check-strictly
          placeholder="请选择上级菜单"
          filterable
          clearable
          @current-change="handleMenuTreeChange"
        ></el-tree-select>
      </el-form-item>
      <el-form-item label="菜单类型" prop="type">
        <el-radio-group
          v-model="state.dataForm.type"
          :disabled="!!state.dataForm.id"
        >
          <el-radio value="C">目录</el-radio>
          <el-radio value="M">菜单</el-radio>
          <el-radio value="B">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-row>
        <el-col :span="12">
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="state.dataForm.name" placeholder="请输入菜单名称" />
      </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示顺序" prop="sort">
            <el-input-number v-model="state.dataForm.sort" :min="0" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        v-if="state.dataForm.type === 'C' || state.dataForm.type === 'M'"
        label="菜单图标"
        prop="icon"
        class="popover-container icon-list"
      >
        <popover-icon v-model="state.dataForm.icon" />
      </el-form-item>
      <el-row v-if="state.dataForm.type === 'M'">
        <el-col :span="12">
          <el-form-item prop="openStyle">
            <template #label>
              <el-tooltip effect="dark" content="选择是外部则地址需要以`http(s)://`开头" placement="top">
                <icon icon="ep:question-filled"/>
              </el-tooltip>
              <span>打开方式</span>
            </template>
            <el-radio-group v-model="state.dataForm.openStyle">
              <el-radio :value="false">内部</el-radio>
              <el-radio :value="true">外部</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item prop="url">
            <template #label>
              <el-tooltip effect="dark" content="访问的路由地址，如：`system/user/index`，或外网地址则以`http(s)://`开头" placement="top">
                <icon icon="ep:question-filled"/>
              </el-tooltip>
              <span>访问地址</span>
            </template>
            <el-input v-model="state.dataForm.url" placeholder="请输入地址" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="status" v-if="state.dataForm.type === 'C' || state.dataForm.type === 'M'">
            <template #label>
              <el-tooltip effect="dark" content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">
                <icon icon="ep:question-filled"/>
              </el-tooltip>
              <span>显示状态</span>
            </template>
            <dict-radio-group v-model="state.dataForm.visible" dict-type="sys_show_hide" />
          </el-form-item>
          <el-form-item prop="authority" v-if="state.dataForm.type === 'M' || state.dataForm.type === 'B'">
            <template #label>
              <el-tooltip effect="dark" content="控制器中定义的权限字符，如：@PreAuthorize(`@auth.hasAuthority('system:user:page')`)" placement="top">
                <icon icon="ep:question-filled"/>
              </el-tooltip>
              <span>权限标识</span>
            </template>
            <el-input v-model="state.dataForm.authority" placeholder="请输入权限标识" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item prop="status">
          <template #label>
            <el-tooltip effect="dark" content="选择停用则菜单将不会出现在侧边栏，也不能被访问" placement="top">
              <icon icon="ep:question-filled"/>
            </el-tooltip>
            <span>菜单状态</span>
          </template>
          <dict-radio-group v-model="state.dataForm.status" dict-type="sys_status" />
        </el-form-item>
          </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="state.visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, ref } from 'vue'
import {
  getByIdApi,
  saveOrUpdateApi,
  postListApi,
  getCheckAuthorityUniqueApi
} from '@/api/system/menu'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'
import { ElTreeSelect, type FormRules } from 'element-plus'

const emit = defineEmits(['refreshPage'])

const state: StateOptions = reactive({
  api: {
    saveOrUpdateApi,
    getByIdApi,
    emit
  },
  dataForm: {
    id: '',
    name: '',
    type: 'C',
    parentId: '',
    url: '',
    authority: '',
    icon: '',
    openStyle: false,
    sort: 0,
    remark: '',
    visible: 1,
    status: 1,
  }
})

// 异步加载
const PopoverIcon = defineAsyncComponent(() =>
  import('./popover-icon.vue')
)

const menuList = ref([] as any[])
const menuTreeRef = ref()
const dataFormRef = ref()

/**
 * 校验权限标识是否唯一
 *
 * @param _rule 校验规则
 * @param value 校验值
 * @param callback 回调
 */
const checkAuthorityUnique = (_rule: any, value: any, callback: any) => {
  // 值为空时，也校验通过
  if (!value) {
    callback()
    return
  }
  // 后端校验唯一
  getCheckAuthorityUniqueApi(value, state.dataForm.id).then((res) => {
    if (res.data) {
      callback()
    } else {
      callback(new Error('权限标识已存在'))
    }
  })
}

const dataRules = reactive<FormRules>({
  name: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 2, max: 50, message: '长度为2~50个字符', trigger: 'blur' }
  ],
  parentId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  url: [{ min: 0, max: 255, message: '长度不能超过255个字符', trigger: 'blur' }],
  authority: [
    { min: 0, max: 100, message: '长度不能超过100个字符', trigger: 'blur' },
    { pattern: /^(?!ROLE_).*$/, message: '不能以 ROLE_ 开头', trigger: 'blur' },
    { validator: checkAuthorityUnique, trigger: 'blur' }
  ],
  icon: [{ min: 0, max: 100, message: '长度不能超过100个字符', trigger: 'blur' }],
  sort: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  remark: [{ min: 0, max: 500, message: '长度不能超过500个字符', trigger: 'blur' }]
})

const { handleSaveOrUpdate } = crud(state)

/**
 * 初始化详情数据
 *
 * @param id 菜单ID
 */
const init = async (id?: string) => {
  state.visible = true
  state.dataForm.id = ''

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }

  // 菜单列表
  getMenuList()

  // id 存在则为修改
  if (id) {
    getData(id)
  }
}

/**
 * 初始化详情数据，新增当前行数据的子菜单
 *
 * @param row 当前行数据
 */
const initAdd = async (row?: any) => {
  state.visible = true
  state.dataForm.id = null

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }

  // 菜单列表
  getMenuList()

  if (row) {
    handleTreeInitAdd(row)
  }
}

/**
 * 获取详情数据
 *
 * @param id 菜单ID
 */
const getData = (id: string) => {
  getByIdApi(id).then((res: any) => {
    Object.assign(state.dataForm, res.data)
    menuTreeRef.value.setCurrentKey(state.dataForm.parentId)
  })
}

/**
 * 获取菜单列表
 */
const getMenuList = () => {
  postListApi({}).then((res) => {
    const menuData = []
    const menu = { id: '0', name: '主类目', type: 'C', children: [] as any[]}
    menu.children = filterMenuTree(res.data)
    menuData.push(menu)
    menuList.value = menuData
  })
}

/**
 * 递归过滤菜单树，只保留类型为 C 或 M 的节点
 *
 * @param menus 菜单列表
 * @returns 过滤后的菜单列表
 */
const filterMenuTree = (menus: any[]): any[] => {
  return menus
    .filter((menu: any) => menu.type === 'C' || menu.type === 'M')
    .map((menu: any) => ({
      ...menu,
      children: menu.children ? filterMenuTree(menu.children) : []
    }))
}

/**
 * 菜单树初始化添加子菜单
 *
 * @param data 菜单树选中数据
 */
const handleTreeInitAdd = (data: any) => {
  state.dataForm.parentId = data.id
  if (data.type === 'M') {
    state.dataForm.type = 'B'
  }
}

/**
 * 表单提交
 */
const handleSubmit = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }

    handleSaveOrUpdate()
  })
}

/**
 * 菜单树选中事件（上线菜单是菜单类型时，添加/修改的子菜单类型自动切换为按钮类型）
 *
 * @param data
 */
const handleMenuTreeChange = (data: any) => {
  if (data.type === 'M') {
    state.dataForm.type = 'B'
  } else {
    state.dataForm.type = 'C'
  }
}

defineExpose({
  init,
  initAdd
})
</script>
