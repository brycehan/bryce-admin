<template>
    <div class="login_container">
        <el-row>
            <el-col :span="12" :xs="0"></el-col>
            <el-col :span="12" :xs="24">
                <el-form class="login_form" :model="loginDto" :rules="rules" ref="loginForm">
                    <h1>Hello</h1>
                    <h2>欢迎来到 Bryce Admin</h2>
                    <el-form-item>
                        <el-input v-model="loginDto.username" :prefix-icon="User" />
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="loginDto.password" type="password" :prefix-icon="Lock" show-password />
                    </el-form-item>
                    <el-form-item>
                        <el-button class="login_btn" type="primary" size="default" @click="login()">登录</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { User, Lock } from "@element-plus/icons-vue";
import stores from "@/stores";
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from "vue-router";
import { ElNotification } from "element-plus";
import { router } from "@/router";


let loginForm = ref()
let $router = useRouter()
let $route = useRoute()
let loading = ref(false)

let loginDto = reactive({
    username: 'admin',
    password: '123456'
})
const login = async () => {
    await loginForm.value.validate()
    loading.value = true
    stores.authStore.login(loginDto)
        .then(() => {
            router.push({ path: '/' })
        })
        .catch((e: any) => {
            console.error(e)

        })
}
const rules = {
    username: [
        { required: true, min: 6, max: 50, message: '账号长度在6到50之间', trigger: 'change' }
    ],
    password: [
        { required: true, min: 6, max: 50, message: '密码长度在6到50之间', trigger: 'change' }
    ]
}
</script>

<style scoped lang="scss">
.login_container {
    width: 100%;
    height: 100vh;
    background: url('@/assets/images/background.jpg') no-repeat;
    background-size: cover;
}

.login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url("@/assets/images/login_form.png") no-repeat;
    background-size: cover;
    padding: 40px;

    h1 {
        color: white;
        font-size: 40px;
    }

    h2 {
        color: white;
        font-size: 20px;
        margin: 20px 0px;
    }

    .login_btn {
        width: 100%;
    }
}
</style>