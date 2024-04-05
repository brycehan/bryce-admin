<template>
  <el-dropdown class="avatar-container">
    <div class="avatar-wrapper">
      <el-avatar shape="circle" :size="30" :src="avatarImg"></el-avatar>
      <span>{{ username }}</span>
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <router-link to="/profile/password">
          <el-dropdown-item>修改密码</el-dropdown-item>
        </router-link>
        <el-dropdown-item divided @click="logout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/modules/auth'
import { ArrowDown } from '@element-plus/icons-vue'
import avatarImg from '@/assets/images/user1-128x128.jpg'
import { computed } from 'vue'

const authStore = useAuthStore()

const username = computed(() => authStore.user.username)

const logout = () => {
  authStore.logout().then(() => {
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
