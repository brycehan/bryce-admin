<template>
  <el-row :gutter="20" class="profile-container">
    <el-col :span="8">
      <el-card class="user-info-card" shadow="never">
        <template #header>{{ t('profile.personal.title') }}</template>
        <div class="avatar">
          <user-avatar />
        </div>
        <ul>
          <li class="flex items-center justify-between">
            <div class="flex items-center gap-1">
              <icon icon="ion:person-outline" /> {{ t('profile.personal.account') }}
            </div>
            <span class="li-text">{{ authStore.user.username }}</span>
          </li>
          <li class="flex items-center justify-between">
            <div class="flex items-center gap-1">
              <icon icon="brc:icon-idcard" /> {{ t('profile.personal.nickname') }}
            </div>
            <span class="li-text">{{ authStore.user.nickname }}</span>
          </li>
          <li class="flex items-center justify-between">
            <div class="flex items-center gap-1"><icon icon="brc:icon-phone" /> {{ t('profile.personal.phone') }}</div>
            <span class="li-text">{{ authStore.user.phone }}</span>
          </li>
          <li class="flex items-center justify-between">
            <div class="flex items-center gap-1"><icon icon="brc:icon-mail" /> {{ t('profile.personal.email') }}</div>
            <span class="li-text">{{ authStore.user.email }}</span>
          </li>
          <li class="flex items-center justify-between">
            <div class="flex items-center gap-1">
              <icon icon="brc:icon-apartment" /> {{ t('profile.personal.affiliation') }}
            </div>
            <span class="li-text">{{ userInfo.deptName }} / {{ replaceComma(userInfo.postNameList, '、') }}</span>
          </li>
          <li class="flex items-center justify-between">
            <div class="flex items-center gap-1"><icon icon="brc:icon-tag" /> {{ t('profile.personal.role') }}</div>
            <span class="li-text">{{ userInfo.roleNameList }}</span>
          </li>
          <li class="flex items-center justify-between">
            <div class="flex items-center gap-1">
              <icon icon="brc:icon-calendar-check" /> {{ t('profile.personal.createTime') }}
            </div>
            <span class="li-text">{{ userInfo.createdTime }}</span>
          </li>
        </ul>
      </el-card>
    </el-col>
    <el-col :span="16">
      <el-card shadow="never">
        <template #header> {{ t('profile.basic.title') }} </template>
        <el-tabs v-model="activeName">
          <el-tab-pane :label="t('profile.basic.data.title')" name="info">
            <UserInfo />
          </el-tab-pane>
          <el-tab-pane :label="t('profile.basic.password.title')" name="password">
            <Password />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import UserAvatar from '@/views/profile/user-avatar.vue'
import UserInfo from '@/views/profile/user-info.vue'
import Password from '@/views/profile/password.vue'
import { getUserInfoApi } from '@/api/system/profile'
import { replaceComma } from '@/utils/tool'

const authStore = useAuthStore()
const activeName = ref('info')
const userInfo = ref({} as any)
const { t } = useI18n()

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
      padding: 0;
      list-style: none;

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
