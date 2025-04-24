<script setup>
import {
  onMounted,
  reactive, ref
} from "vue";
import {HEADER_HEIGHT} from "../utils/constant";
import {auth_store} from "../stores/auth_store";
import {ElLoading, ElMessage} from "element-plus";
import apiClient from "../utils/asiox_instance";
import {useRoute, useRouter} from "vue-router";

const shellHeight = ref(0);

const isSlideIn = ref(false);

const loginFormRef = ref(null);

const authStore = auth_store();

const route = useRoute();

const router = useRouter();

const loginData = reactive({
  loginForm: {
    no: '',
    password: ''
  },
  rules: {
    no: [
      {required: true, message: '请输入账号', trigger: 'blur'},
      {min: 1, max: 20, message: '用户名长度在 20 个字符以内', trigger: 'blur'}
    ],
    password: [
      {required: true, message: '请输密码', trigger: 'blur'},
      {min: 1, max: 32, message: '密码长度在 32 个字符以内', trigger: 'blur'}
    ]
  },
  authStore: null
});

function jump1() {

}

function jump2() {
  router.push("/dashboard/register")
}

async function confirm() {
  // console.log(JSON.stringify(loginFormRef.value, null, 2))
  if(loginFormRef.value) {
    await loginFormRef.value.validate(async (valid) => {
      if (valid) {
        const loginLoading = ElLoading.service({
          lock: true,
          text: '登录中，请等待...',
          background: 'rgba(0, 0, 0, 0.7)',
        })

        const loginApiUrl = "/api/user/login";
        const response = await apiClient(
            loginApiUrl,
            {
              data: {
                username: loginData.loginForm.no,
                password: loginData.loginForm.password
              },
              method: 'post',
            }
        );
        loginLoading.close();

        if(response.data.code !== 0) {
          loginFormRef.loginForm.resetFields();
          console.error("登录失败: ", JSON.stringify(response.data, null, 2));
          ElMessage.error('登录失败: ' + response.data.message)
          // loginFormRef.loginForm.resetFields(['password']);
          return;
        }

        // 登录成功
        console.log("登录成功: " + JSON.stringify(response.data, null, 2));
        // 首先将用户的数据存入authStore中
        authStore.$patch({
          user: response.data.data.user,
          token: response.data.data.token,
        });
        // 跳转到首页
        await router.push(router.currentRoute.value.query?.redirect || '/dashboard');
      }
    })
  }

}

onMounted(() => {
  const headerHeightNum = parseFloat(HEADER_HEIGHT);
  shellHeight.value = window.innerHeight - headerHeightNum;
  setTimeout(() => {
    isSlideIn.value = true;
  }, 100);
})

</script>

<template>
  <div class="shell" :style="{height: `${shellHeight}px`}">

    <div id="img-box" style="margin-top: 50px; transform: scale(1.1);">
      <img :class="{'slide-in': isSlideIn}" src="../assets/loginBackground.jpg" alt="">
    </div>

    <el-form :model="loginData.loginForm" label-width="100px"
             :rules="loginData.rules" ref="loginFormRef" style="margin-top: 50px; transform: scale(1.1);">
      <div id="form-body">
        <div id="welcome-lines" style="margin-top: -40px; margin-right: -50px;">
          <div id="w-line-1">你好! </div>
          <div id="w-line-2">欢迎回来</div>
        </div>

        <div id="input-area" style="margin-right: 50px; transform: scale(1.4); ">
          <el-form-item label="账号" prop="no">
            <el-input style="width: 200px" type="text" v-model="loginData.loginForm.no"
                      autocomplete="off" size="small"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" style="margin-top: 12px">
            <el-input style="width: 200px" type="password" v-model="loginData.loginForm.password"
                      show-password autocomplete="off" size="small" @keyup.enter.native="confirm"></el-input>
          </el-form-item>
        </div>
        <div id="submit-button-cvr" style="margin-top: 40px; margin-left: -120px">
          <el-form-item>
            <el-button type="danger" @click="confirm" class="custom-login-button">登 录</el-button>
          </el-form-item>
        </div>
        <div id="forgot-pass" style="margin-right: -75px;">
          <a @click="jump1" class="custom-link forgot-pass">忘记密码 ?</a>
          <a @click="jump2" class="custom-link register" style="margin-left: 50px;">注册</a>
        </div>
      </div>

    </el-form>

  </div>
</template>

<style lang="scss" scoped>
@use "../assets/css/login";
</style>