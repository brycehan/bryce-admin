<template>
  <el-dialog
    v-model="state.visible"
    :title="!state.dataForm.id ? '新增菜单' : '修改菜单'"
    :close-on-click-modal="false"
  >
    <el-form
      ref="dataFormRef"
      :model="state.dataForm"
      :rules="rules"
      label-width="100px"
      @keyup.enter="handleSubmit()"
      class="mr-4"
    >
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="state.dataForm.name" placeholder="请输入菜单名称" />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="state.dataForm.type" :disabled="!!state.dataForm.id" @change="handleMenuTypeChange">
          <el-radio label="M">菜单</el-radio>
          <el-radio label="B">按钮</el-radio>
          <el-radio label="I">接口</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="上级菜单" prop="parentName" class="popover-container menu-list">
        <el-popover ref="menuPopoverRef" placement="bottom-start" trigger="click" :width="400" popper-class="popover-pop">
          <template #reference>
            <el-input v-model="state.dataForm.parentName" :readonly="true" placeholder="上级菜单">
              <template #suffix>
                <svg-icon icon="icon-close-circle" @click.stop="handleTreeDefault()" />
              </template>
            </el-input>
          </template>
          <el-tree
              ref="menuTreeRef"
              :data="menuList"
              :props="{ label: 'name', children: 'children'}"
              node-key="id"
              :highlight-current="true"
              :expand-on-click-node="false"
              accordion
              @current-change="handleTreeCurrentChange"
          ></el-tree>
        </el-popover>
      </el-form-item>

      <el-form-item v-if="state.dataForm.type === 'M'" label="菜单图标" prop="icon" class="popover-container icon-list">
        <el-popover ref="iconPopoverRef" placement="top-start" trigger="click" width="40%" popper-class="icon-popover">
          <template #reference>
            <el-input v-model="state.dataForm.icon" :readonly="true" placeholder="请选择图标"/>
          </template>
          <div class="icon-popover-icon-inner">
            <el-scrollbar class="icon-popover-icon-list" height="250">
              <el-button
                v-for="(item, index) in iconList"
                :key="index"
                :class="{ 'is-active': state.dataForm.icon === item}"
                @click="handleIcon(item)"
              >
                <svg-icon :icon="item" size="20px"/>
              </el-button>
            </el-scrollbar>
          </div>
        </el-popover>
      </el-form-item>
      <el-row>
        <el-col :span="12">
      <el-form-item label="地址" prop="url">
        <el-input v-model="state.dataForm.url" placeholder="请输入地址" />
      </el-form-item>
        </el-col>

            <el-col :span="12">
      <el-form-item label="权限标识" prop="authority">
        <el-input v-model="state.dataForm.authority" placeholder="请输入权限标识" />
      </el-form-item>
            </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="打开方式" prop="openStyle">
            <el-radio-group v-model="state.dataForm.openStyle" >
              <el-radio :label="false">内部</el-radio>
              <el-radio :label="true">外部</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示顺序" prop="sort">
            <el-input-number v-model="state.dataForm.sort" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="状态" prop="status">
        <dict-radio-group v-model="state.dataForm.status" dict-type="sys_status" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="state.visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { getById, saveOrUpdate, list } from '@/api/system/menu'
import type { StateOptions } from "@/utils/state";
import { crud } from "@/utils/state";
import SvgIcon from "@/components/svg-icon/svg-icon.vue";
import {getIconList} from "@/utils/tool";

const emit = defineEmits(['refreshPage'])

const state: StateOptions  = reactive({
  api: {
    saveOrUpdate,
    getById,
    emit
  },
  dataForm: {
    id: undefined,
    name: '', 
    type: 'M',
    parentId: '',
    parentName: '',
    url: '',
    authority: '', 
    icon: '', 
    openStyle: false,
    sort: '', 
    remark: '', 
    status: true
  }
})

const menuList = ref([])
const iconList = ref<string[]>([])
const menuPopoverRef = ref()
const menuTreeRef = ref()
const iconPopoverRef = ref()

const dataFormRef = ref()

const rules = reactive({
    name: [
      { required: true, message: '必填项不能为空', trigger: 'blur' },
      { min: 0, max: 50, message: '菜单名称长度不能超过50个字符', trigger: 'blur' }
    ],
  parentName: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
  ],
    url: [{ min: 0, max: 255, message: '组件路径长度不能超过255个字符', trigger: 'blur' }],
    authority: [{ min: 0, max: 100, message: '权限标识长度不能超过100个字符', trigger: 'blur' }],
    icon: [{ min: 0, max: 100, message: '菜单图标长度不能超过100个字符', trigger: 'blur' }],
    sort: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    remark: [{ min: 0, max: 500, message: '备注长度不能超过500个字符', trigger: 'blur' }]
})

const { handleSaveOrUpdate } = crud(state)

/** 初始化详情数据 */
const init = (id?: bigint) => {
  state.visible = true
  state.dataForm.id = undefined

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }

  // id 存在则为修改
  if (id) {
    getData(id)
  } else {
    handleTreeDefault()
  }

  // 菜单列表
  getMenuList()

  // icon 列表
  iconList.value = getIconList()
}

/** 获取详情数据 */
const getData = (id: bigint) => {

  getById(id).then((res: any) => {
    Object.assign(state.dataForm, res.data)

    if(state.dataForm.parentId === 0) {
      return handleTreeDefault()
    }

    menuTreeRef.value.setCurrentKey(state.dataForm.parentId)
  })
}

/** 菜单类型改变 */
const handleMenuTypeChange = () => {
  getMenuList()

}

/** 获取菜单列表 */
const getMenuList = () => {
  list({}).then(res => {
    menuList.value = res.data
  })
}

/** 上级菜单树，设置默认值 */
const handleTreeDefault = () => {
  state.dataForm.parentId = 0
  state.dataForm.parentName = '主类目'
}

const handleTreeCurrentChange = (data: any) => {
  state.dataForm.parentId = data.id
  state.dataForm.parentName = data.name
  menuPopoverRef.value.hide()
}

/** 图标点击事件 */
const handleIcon = (icon: string) => {
  state.dataForm.icon = icon
  iconPopoverRef.value.hide()
}

/** 表单提交 */
const handleSubmit = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }

    handleSaveOrUpdate()
  })
}

defineExpose({
    init
})
</script>

<style scoped lang="scss">
.popover-container {
  ::v-deep(.el-input__suffix) {
    cursor: pointer;
  }
}

.icon-popover-icon-list {
  width: 100%;
  max-height: 260px;

  .el-button {
    margin: 15px 0 0 10px;
    height: 30px;
    width: 30px;
  }

}
</style>