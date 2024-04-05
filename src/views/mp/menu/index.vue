<template>
  <el-card shadow="never">
    <div id="app-menu">
      <!-- 预览窗 -->
      <div class="mp-preview">
        <div class="mp-bg">
          <div class="mp-header">公众号菜单</div>
          <ul class="mp-menu" id="mp-menu">
            <li
              v-for="(btn, i) in state.menu.buttons"
              :key="i"
              class="menu-item"
              :class="{ current: state.selectedMenuIndex === i && state.selectedMenuLevel == 1 }"
              @click="selectMenu(i)"
            >
              <div class="menu-item-title">
                <span>{{ btn.name }}</span>
              </div>
              <ul class="mp-sub-menu">
                <li
                  v-for="(subBtn, subI) in btn.subButtons"
                  :key="subI"
                  class="menu-sub-item"
                  :class="{
                    current:
                      state.selectedMenuIndex === i &&
                      state.selectedSubMenuIndex === subI &&
                      state.selectedMenuLevel == 2,
                    'on-drag-over': (state.onDragOverMenu = i + '_' + subI)
                  }"
                  @click.stop="selectSubMenu(i, subI)"
                  @dragstart="selectSubMenu(i, subI)"
                  @dragover.prevent="state.onDragOverMenu = i + '_' + subI"
                  @drop="onDrop(i, subI)"
                >
                  <div class="menu-item-title">
                    <span>{{ subBtn.name }}</span>
                  </div>
                </li>
                <li
                  v-if="btn.subButtons.length < 5"
                  class="menu-sub-item"
                  :class="{
                    'on-drag-over': (state.onDragOverMenu = i + '_' + btn.subButtons.length)
                  }"
                  @click.stop="addMenu(2, i)"
                  @dragover.prevent="state.onDragOverMenu = i + '_' + btn.subButtons.length"
                  @drop="onDrop(i, btn.subButtons.length)"
                >
                  <div class="menu-item-title">
                    <el-icon><Plus /></el-icon>
                  </div>
                </li>
                <i class="menu-arrow arrow_out"></i>
                <i class="menu-arrow arrow_in"></i>
              </ul>
            </li>
            <li class="menu-item" v-if="state.menu.buttons?.length < 3" @click="addMenu(1)">
              <el-icon><Plus /></el-icon>
            </li>
          </ul>
        </div>
      </div>
      <!-- 菜单编辑器 -->
      <div class="mp-menu-editor" v-if="state.selectedMenuLevel > 0">
        <mp-menu-button-editor
          :button="state.selectedButton"
          :selected-menu-level="state.selectedMenuLevel"
          @deleteMenu="deleteMenu"
        >
        </mp-menu-button-editor>
      </div>
    </div>
    <div class="mp-btn-group" v-auth="'mp:menu:saveOrUpdate'">
      <el-button type="success" icon="UploadFilled" @click="updateMpMenu">发布</el-button>
      <el-button type="danger" icon="DeleteFilled" @click="deleteMenu">清空菜单</el-button>
      <el-button type="warning" icon="Upload" @click="publishMpByCache">从缓存发布</el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { saveOrUpdate, getMenu, publishByCache } from '@/api/mp/menu'
import { ElMessage, ElMessageBox } from 'element-plus'
import MpMenuButtonEditor from '@/views/mp/menu/mp-menu-button-editor.vue'
import { Plus } from '@element-plus/icons-vue'

const state = reactive({
  menu: { buttons: [] as any[] }, //当前菜单
  selectedMenuIndex: -1, // 当前选中菜单索引
  selectedSubMenuIndex: -1, // 当前选中子菜单索引
  selectedMenuLevel: 0, // 当前选中菜单级别
  selectedButton: {} as any, // 当前选中的菜单按钮
  onDragOverMenu: '' // 当前鼠标拖动到的位置
})

onMounted(() => {
  getMpMenu()
})

/**
 * 获取公众号菜单
 */
const getMpMenu = () => {
  getMenu().then((res: any) => {
    state.menu = res.data.menu
  })
}

/**
 * 选中主菜单
 *
 * @param i 主菜单索引
 */
const selectMenu = (i: any) => {
  state.selectedMenuIndex = i
  state.selectedMenuLevel = 1
  state.selectedSubMenuIndex = -1
  state.selectedButton = state.menu.buttons[i]
}

/**
 * 选中子菜单
 *
 * @param i 一级菜单索引
 * @param subI 二级菜单索引
 */
const selectSubMenu = (i: any, subI: any) => {
  state.selectedMenuIndex = i
  state.selectedMenuLevel = 2
  state.selectedSubMenuIndex = subI
  state.selectedButton = state.menu.buttons[i].subButtons[subI]
}

/**
 * 添加菜单
 * @param level 菜单级别
 * @param i 菜单索引
 */
const addMenu = (level: number, i: any = '') => {
  if (level == 1 && state.menu.buttons?.length < 3) {
    state.menu.buttons.push({
      type: 'view',
      name: '菜单名称',
      subButtons: [],
      url: ''
    })
    selectMenu(state.menu.buttons.length - 1)
  }

  if (level == 2 && state.menu.buttons[i].subButtons.length < 5) {
    state.menu.buttons[i].subButtons.push({
      type: 'view',
      name: '子菜单名称',
      url: ''
    })
    selectSubMenu(i, state.menu.buttons[i].subButtons.length - 1)
  }
}

/**
 * 删除菜单
 */
const deleteMenu = () => {
  if (state.selectedMenuLevel == 1) {
    ElMessageBox.confirm('删除后菜单下设置的内容将被删除', '提示', {
      type: 'warning'
    })
      .then(() => {
        state.menu.buttons.splice(state.selectedMenuIndex, 1)
        unselectMenu()
      })
      .catch((error) => {
        console.warn(error)
      })
    return
  } else if (state.selectedMenuLevel == 2) {
    state.menu.buttons[state.selectedMenuIndex].subButtons.splice(state.selectedSubMenuIndex, 1)
    unselectMenu()
  }
}

/**
 * 不选中任何菜单
 */
const unselectMenu = () => {
  state.selectedMenuLevel = 0
  state.selectedMenuIndex = -1
  state.selectedSubMenuIndex = -1
  state.selectedButton = {}
}

const onDrop = (i: number, subI: number) => {
  state.onDragOverMenu = ''
  // 拖拽到了原位置
  if (state.selectedMenuIndex == i && state.selectedSubMenuIndex == subI) {
    return
  }
  if (state.selectedMenuIndex != i && state.menu.buttons[i].subButtons.length >= 5) {
    ElMessage.error('目标组已满')
    return
  }
  state.menu.buttons[i].subButtions.splice(subI, 0, state.selectedButton)
  let deleteSubIndex = state.selectedSubMenuIndex
  if (state.selectedMenuIndex == i && subI < state.selectedSubMenuIndex) {
    deleteSubIndex++
  }
  state.menu.buttons[state.selectedMenuIndex].subButtons.splice(deleteSubIndex, 1)
  unselectMenu()
}

/**
 * 更新微信公众号菜单
 */
const updateMpMenu = () => {
  saveOrUpdate(state.menu).then(() => {
    ElMessage.success('操作成功')
  })
}

/**
 * 从本地缓存发布
 */
const publishMpByCache = () => {
  publishByCache().then(() => {
    ElMessage.success('操作成功')
    getMpMenu()
  })
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

#app-menu ul {
  padding: 0;
}

#app-menu li {
  list-style: none;
}

#app-menu {
  overflow: hidden;
  width: 100%;
}

.mp-preview {
  position: relative;
  width: 320px;
  height: 540px;
  float: left;
  margin-right: 10px;
  border: 1px solid #e7e7eb;
}

.mp-preview a {
  text-decoration: none;
  color: #616161;
}

.mp-preview .mp-hd .mp-title {
  color: #fff;
  font-size: 15px;
  width: 100%;
  text-align: center;
  position: absolute;
  top: 33px;
  left: 0px;
}

.mp-preview .mp-header {
  text-align: center;
  padding: 10px 0;
  background-color: #616161;
  color: #ffffff;
}

.mp-preview .mp-menu {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border-top: 1px solid #e7e7e7;
  background-position: 0 0;
  background-repeat: no-repeat;
  margin-bottom: 0px;
}

/*一级*/
.mp-preview .mp-menu .menu-item {
  position: relative;
  float: left;
  line-height: 50px;
  height: 50px;
  text-align: center;
  width: 33.33%;
  border-left: 1px solid #e7e7e7;
  cursor: pointer;
  color: #616161;
}

/*二级*/
.mp-preview .mp-sub-menu {
  position: absolute;
  bottom: 60px;
  left: 0;
  right: 0;
  border-top: 1px solid #d0d0d0;
  margin-bottom: 0px;
  background: #fafafa;
  display: block;
  padding: 0;
}

.mp-preview .mp-sub-menu .menu-sub-item {
  line-height: 50px;
  height: 50px;
  text-align: center;
  width: 100%;
  border: 1px solid #d0d0d0;
  border-top-width: 0px;
  cursor: pointer;
  position: relative;
  color: #616161;
}

.mp-preview .mp-sub-menu .menu-sub-item.on-drag-over {
  border-top: 2px solid #44b549;
}

.mp-preview .menu-arrow {
  position: absolute;
  left: 50%;
  margin-left: -6px;
}

.mp-preview .arrow_in {
  bottom: -4px;
  display: inline-block;
  width: 0px;
  height: 0px;
  border-width: 6px 6px 0px;
  border-style: solid dashed dashed;
  border-color: #fafafa transparent transparent;
}

.mp-preview .arrow_out {
  bottom: -5px;
  display: inline-block;
  width: 0px;
  height: 0px;
  border-width: 6px 6px 0px;
  border-style: solid dashed dashed;
  border-color: #d0d0d0 transparent transparent;
}

.mp-preview .menu-item .menu-item-title,
.mp-preview .menu-sub-item .menu-item-title {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  box-sizing: border-box;
}

.mp-preview .menu-item.current,
.mp-preview .menu-sub-item.current {
  border: 1px solid #44b549;
  background: #fff;
  color: #44b549;
}

.mp-preview .mp-sub-menu.show {
  display: block;
}

.mp-preview .icon_menu_dot {
  /* background: url(../images/index_z354723.png) 0px -36px no-repeat; */
  width: 7px;
  height: 7px;
  vertical-align: middle;
  display: inline-block;
  margin-right: 2px;
  margin-top: -2px;
}

.mp-preview .icon14_menu_add {
  /* background: url(../images/index_z354723.png) 0px 0px no-repeat; */
  width: 14px;
  height: 14px;
  vertical-align: middle;
  display: inline-block;
  margin-top: -2px;
}

.mp-preview li:hover .icon14_menu_add {
  /* background: url(../images/index_z354723.png) 0px -18px no-repeat; */
}

.mp-preview .menu-item:hover {
  color: #000;
}

.mp-preview .menu-sub-item:hover {
  background: #eee;
}

.mp-preview li.current:hover {
  background: #fff;
  color: #44b549;
}

/*菜单内容*/
.mp-menu-editor {
  width: 600px;
  padding: 0px 20px 5px;
  background-color: #f4f5f9;
  border: 1px solid #e7e7eb;
  float: left;
  min-height: 540px;
}

.mp-menu-editor .menu-name {
  float: left;
  height: 40px;
  line-height: 40px;
  font-size: 18px;
}

.mp-menu-editor .menu-delete {
  float: right;
  height: 40px;
  line-height: 40px;
  color: #459ae9;
  cursor: pointer;
}

.mp-menu-editor .menu-input-group {
  width: 540px;
  margin: 10px 0 30px 0;
  overflow: hidden;
}

.mp-menu-editor .menu-label {
  float: left;
  height: 30px;
  line-height: 30px;
  width: 80px;
  text-align: right;
}

.mp-menu-editor .menu-input {
  float: left;
  width: 380px;
}

.mp-menu-editor .menu-input-text {
  border: 0px;
  outline: 0px;
  background: #fff;
  width: 300px;
  padding: 5px 0px 5px 0px;
  margin-left: 10px;
  text-indent: 10px;
  height: 35px;
}

.mp-menu-editor .menu-tips {
  color: #8d8d8d;
  padding-top: 4px;
  margin: 0;
}

.mp-menu-editor .menu-tips.cursor {
  color: #459ae9;
  cursor: pointer;
}

.mp-menu-editor .menu-input .menu-tips {
  margin: 0 0 0 10px;
}

.mp-menu-editor .menu-content {
  padding: 16px 20px;
  border: 1px solid #e7e7eb;
  background-color: #fff;
}

.mp-menu-editor .menu-content .menu-input-group {
  margin: 0px 0 10px 0;
}

.mp-menu-editor .menu-content .menu-label {
  text-align: left;
  width: 100px;
}

.mp-menu-editor .menu-content .menu-input-text {
  border: 1px solid #e7e7eb;
}

.mp-menu-editor .menu-content .menu-tips {
  padding-bottom: 10px;
}

.mp-menu-editor .menu-msg-content {
  padding: 0;
  border: 1px solid #e7e7eb;
  background-color: #fff;
}

.mp-menu-editor .menu-msg-content .menu-msg-head {
  overflow: hidden;
  border-bottom: 1px solid #e7e7eb;
  line-height: 38px;
  height: 38px;
  padding: 0 20px;
}

.mp-menu-editor .menu-msg-content .menu-msg-panel {
  padding: 30px 50px;
}

.mp-menu-editor .menu-msg-content .menu-msg-select {
  padding: 40px 20px;
  border: 2px dotted #d9dadc;
  text-align: center;
}

.mp-menu-editor .menu-msg-content .menu-msg-select:hover {
  border-color: #b3b3b3;
}

.mp-menu-editor .menu-msg-content strong {
  display: block;
  padding-top: 3px;
  font-weight: 400;
  font-style: normal;
}

.mp-menu-editor .menu-msg-content .menu-msg-title {
  float: left;
  width: 310px;
  height: 30px;
  line-height: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.icon36_common {
  width: 36px;
  height: 36px;
  vertical-align: middle;
  display: inline-block;
}

.icon_msg_sender {
  margin-right: 3px;
  margin-top: -2px;
  width: 20px;
  height: 20px;
  vertical-align: middle;
  display: inline-block;
  /* background: url(../images/msg_tab_z25df2d.png) 0 -270px no-repeat; */
}

.mp-btn-group {
  text-align: center;
  width: 100%;
  margin: 30px 0px;
  overflow: hidden;
}

.mp-btn-group .btn {
  width: 100px;
  border-radius: 0px;
}

#material-list {
  padding: 20px;
  overflow-y: scroll;
  height: 558px;
}

#news-list {
  padding: 20px;
  overflow-y: scroll;
  height: 558px;
}

#material-list table {
  width: 100%;
}
</style>
