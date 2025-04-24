<script setup>
import {
  onMounted,
  reactive, ref
} from "vue";
import {ElLoading, ElMessage} from "element-plus";
import apiClient from "../utils/asiox_instance";
import {HEADER_HEIGHT, middle_timeout} from "../utils/constant";
import {Back} from "@element-plus/icons-vue";
import {useRoute, useRouter} from "vue-router";

const shellHeight = ref(0);

const registerFormRef = ref(null);

const isSlideIn = ref(false);

const route = useRoute();

const router = useRouter();

const registerData = reactive({
  confirm_disabled: false,
  registerForm: {
    username: '',
    password: '',
    sex:true
  },
  rules: {
    username: [
      {required: true, message: '请输入账号', trigger: 'blur'},
      {min: 1, max: 20, message: '用户名长度在 20 个字符以内', trigger: 'blur'}
    ],
    password: [
      {required: true, message: '请输密码', trigger: 'blur'},
      {min: 1, max: 32, message: '密码长度在 32 个字符以内', trigger: 'blur'}
    ]
  }
});

function confirm() {}

async function submitForm() {
  if(registerFormRef.value) {
    await registerFormRef.value.validate(async (valid) => {
      if(valid) {
        const registerLoading = ElLoading.service({
          lock: true,
          text: '注册中，请等待',
          background: 'rgba(0, 0, 0, 0.7)',
        })
        // 开始注册
        const response = await apiClient.post(import.meta.env.VITE_BASE_URL + "/api/user/register"
            , registerData.registerForm
            , {timeout: middle_timeout});
        // 先关闭加载页面
        registerLoading.close();

        const code = response.data.code;
        // 判断注册结果
        if(code === 0){
          console.log("注册成功: " + JSON.stringify(response.data, null, 2));
          ElMessage.success('注册成功');
          await router.push("/dashboard/login");
          return;
        }
        // 注册失败
        console.log("注册失败: ", JSON.stringify(response.data, null, 2));
        ElMessage.error('注册失败: ' + response.data.message);
        Object.assign(registerData.registerForm, {
          username: '',
          password: '',
          sex: true // 根据需求决定是否重置为默认值
        })
      }
    })
  }
}

function goToLogin() {
  router.push("/login");
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

    <div id="img-box"  style="margin-top: 50px; transform: scale(1.1);">
      <img :class="{'slide-in': isSlideIn}" src="../assets/loginBackground.jpg" alt="">
    </div>

    <el-form :model="registerData.registerForm" label-width="100px"
             :rules="registerData.rules" ref="registerFormRef" style="margin-top: 50px; transform: scale(1.1);">
      <div id="form-body">
        <div id="input-area" style="margin-right: 50px; transform: scale(1.4); ">

          <el-form-item label="用户名" prop="username" >
            <el-input style="width: 200px " type="text" v-model="registerData.registerForm.username"
                      autocomplete="off" size="small"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" style="margin-top: 12px">
            <el-input style="width: 200px" type="password" v-model="registerData.registerForm.password"
                      show-password autocomplete="off" size="small" @keyup.enter.native="confirm"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex" style="margin-top: 12px">
            <el-radio-group v-model="registerData.registerForm.sex">
              <el-radio v-bind:value=true>男</el-radio>
              <el-radio v-bind:value=false>女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       @click="submitForm"
                       size="small">
              注 册
            </el-button>
            <el-button @click="resetForm" size="small">重 置</el-button>
          </el-form-item>
        </div>
        <div id="forgot-pass" style="margin-right: -280px; margin-top: 40px">
          <el-link :underline="false" @click="goToLogin"><el-icon><Back /></el-icon>返回登陆</el-link>
        </div>
      </div>

    </el-form>

  </div>
</template>

<style lang="scss" scoped>
@use "../assets/css/register";
</style>