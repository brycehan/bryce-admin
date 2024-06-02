<template>
  <el-row :gutter="20" class="profile-container">
    <el-col :span="8">
      <el-card class="user-info-card" shadow="never">
        <template #header>个人信息</template>
        <div class="avatar">
          <user-avatar />
        </div>
        <ul>
          <li>
            <svg-icon icon="icon-user" /> 用户账号
            <span class="li-text">{{ authStore.user.username }}</span>
          </li>
          <li>
            <svg-icon icon="icon-idcard" /> 用户昵称
            <span class="li-text">{{ authStore.user.fullName }}</span>
          </li>
          <li>
            <svg-icon icon="icon-phone" /> 手机号码
            <span class="li-text">{{ authStore.user.phone }}</span>
          </li>
          <li>
            <svg-icon icon="icon-mail" /> 用户邮箱
            <span class="li-text">{{ authStore.user.email }}</span>
          </li>
          <li>
            <svg-icon icon="icon-apartment" /> 所属机构
            <span class="li-text"
              >{{ userInfo.orgName }} / {{ replaceComma(userInfo.postNameList, '、') }}</span
            >
          </li>
          <li>
            <svg-icon icon="icon-tag" /> 所属角色
            <span class="li-text">{{ userInfo.roleNameList }}</span>
          </li>
          <li>
            <svg-icon icon="icon-calendar-check" /> 创建日期
            <span class="li-text">{{ userInfo.createdTime }}</span>
          </li>
        </ul>
      </el-card>
    </el-col>
    <el-col :span="16">
      <el-card shadow="never">
        <template #header> 基本信息 </template>
        <el-tabs v-model="activeName">
          <el-tab-pane label="基本资料" name="info">
            <UserInfo />
          </el-tab-pane>
          <el-tab-pane label="修改密码" name="password">
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
import { getUserInfo } from '@/api/auth/profile'
import { replaceComma } from '@/utils/tool'

const authStore = useAuthStore()
const activeName = ref('info')
const userInfo = ref({} as any)

const getUserInfoApi = () => {
  getUserInfo().then((res) => {
    userInfo.value = res.data
  })
}

onMounted(() => {
  getUserInfoApi()
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
