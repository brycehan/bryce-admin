<template>
  <el-row :gutter="20" class="profile-container">
    <el-col :span="8">
      <el-card class="user-info-card" shadow="never">
        <template #header>{{ $t('profile.personal.title') }}</template>
        <div class="avatar">
          <user-avatar />
        </div>
        <ul>
          <li>
            <svg-icon icon="icon-user" /> {{ $t('profile.personal.account') }}
            <span class="li-text">{{ authStore.user.username }}</span>
          </li>
          <li>
            <svg-icon icon="icon-idcard" /> {{ $t('profile.personal.nickname') }}
            <span class="li-text">{{ authStore.user.nickname }}</span>
          </li>
          <li>
            <svg-icon icon="icon-phone" /> {{ $t('profile.personal.phone') }}
            <span class="li-text">{{ authStore.user.phone }}</span>
          </li>
          <li>
            <svg-icon icon="icon-mail" /> {{ $t('profile.personal.email') }}
            <span class="li-text">{{ authStore.user.email }}</span>
          </li>
          <li>
            <svg-icon icon="icon-apartment" /> {{ $t('profile.personal.affiliation') }}
            <span class="li-text"
              >{{ userInfo.deptName }} / {{ replaceComma(userInfo.postNameList, '、') }}</span
            >
          </li>
          <li>
            <svg-icon icon="icon-tag" /> {{ $t('profile.personal.role') }}
            <span class="li-text">{{ userInfo.roleNameList }}</span>
          </li>
          <li>
            <svg-icon icon="icon-calendar-check" /> {{ $t('profile.personal.createTime') }}
            <span class="li-text">{{ userInfo.createdTime }}</span>
          </li>
        </ul>
      </el-card>
    </el-col>
    <el-col :span="16">
      <el-card shadow="never">
        <template #header> {{ $t('profile.basic.title') }} </template>
        <el-tabs v-model="activeName">
          <el-tab-pane :label="$t('profile.basic.data.title')" name="info">
            <UserInfo />
          </el-tab-pane>
          <el-tab-pane :label="$t('profile.basic.password.title')" name="password">
            <Password />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import UserAvatar from '@/views/profile/user-avatar.vue'
import { useAuthStore } from '@/stores/modules/auth'
import UserInfo from '@/views/profile/user-info.vue'
import Password from '@/views/profile/password.vue'
import { getUserInfoApi } from '@/api/system/profile'
import { replaceComma } from '@/utils/tool'

const authStore = useAuthStore()
const activeName = ref('info')
const userInfo = ref({} as any)

const getUserInfo = () => {
  getUserInfoApi().then((res) => {
    userInfo.value = res.data
  })
}

onMounted(() => {
  getUserInfo()
})
</script>

<style scoped lang="scss">
.profile-container {
  .user-info-card {
    .avatar {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }
    ul {
      list-style: none;
      padding: 0;
      li {
        padding: 12px 0;
        border-bottom: 1px solid #f0f0f0;
      }
    }
    .li-text {
      float: right;
    }
  }
}
</style>
