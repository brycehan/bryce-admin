<template>
  <el-dropdown class="avatar-container">
    <div class="avatar-wrapper">
      <el-avatar shape="circle" :size="30" :src="stores.authStore.user.avatar"></el-avatar>
      <span>{{ stores.authStore.user.username }}</span>
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>修改密码</el-dropdown-item>
        <el-dropdown-item divided @click="logout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import stores from '@/stores'
import {ArrowDown} from "@element-plus/icons-vue";
const logout = () => {
  stores.authStore.logout().then(() => {
    // 刷新页面
    location.reload()
  })
}
</script>

<style scoped lang="scss">
.avatar-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: var(--theme-header-height);

  .avatar-wrapper {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 0 8px;
    color: var(--theme-header-text-color);

    span {
      margin-left: 6px;
    }
  }
}
</style>
