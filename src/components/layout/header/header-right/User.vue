<template>
  <el-dropdown class="avatar-container">
    <div class="avatar-wrapper">
      <el-avatar shape="circle" :size="30" :src="authStore.user.avatar || avatarImg"></el-avatar>
      <span>{{ username }}</span>
      <icon icon="ep:arrow-down" class="ml-1" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <router-link to="/profile">
          <el-dropdown-item>{{ t('profile.title') }}</el-dropdown-item>
        </router-link>
        <el-dropdown-item divided @click="logout">{{ t('login.signOut') }}</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/modules/auth'
import avatarImg from '@/assets/images/user1-128x128.jpg'
import { useTabsStore } from '@/stores/modules/tabs.ts'
import modal from '@/utils/modal.ts'

const authStore = useAuthStore()

const username = computed(() => authStore.user.username)
const { t } = useI18n()

const logout = () => {
  modal
    .confirm('确定注销并退出系统吗？')
    .then(() => authStore.logout())
    .then(() => {
      // 刷新页面
      location.reload()
    })
    .finally(() => useTabsStore()?.deleteAllViews())
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
    padding: 0 8px;
    color: var(--theme-header-text-color);
    cursor: pointer;

    span {
      margin-left: 6px;
    }
  }
}
</style>
