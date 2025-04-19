<template>
  <div class="shell">

    <div id="img-box" style="margin-top: 50px;transform: scale(1.1);">
      <img src="../assets/loginBackground.jpg" alt="">
    </div>

    <el-form :model="loginForm" label-width="100px"
             :rules="rules" ref="loginForm" style="margin-top: 50px;transform: scale(1.1);">
      <div id="form-body">
        <div id="welcome-lines" style="margin-top: -40px; margin-right: -50px;">
          <div id="w-line-1">你好! </div>
          <div id="w-line-2">欢迎回来</div>
        </div>

        <div id="input-area" style="margin-right: 50px; transform: scale(1.5); ">

          <el-form-item label="账号" prop="no" >
            <el-input style="width: 200px " type="text" v-model="loginForm.no"
                      autocomplete="off" size="small"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" style="margin-top: 12px">
            <el-input style="width: 200px" type="password" v-model="loginForm.password"
                      show-password autocomplete="off" size="small" @keyup.enter.native="confirm"></el-input>
          </el-form-item>

        </div>
        <div id="submit-button-cvr" style="margin-top: 40px;margin-left: -120px">
          <el-form-item>
            <el-button type="danger" @click="confirm" style="width: 200%">登 录</el-button>
          </el-form-item>
        </div>
        <div id="forgot-pass" style="margin-right: -75px;">
          <a @click="jump1" style="margin-right: 5px;">忘记密码 ?</a>
          <a @click="jump2"  style="margin-left: 50px;">注册</a>
        </div>
      </div>

    </el-form>

  </div>

</template>
<script>
import {ElLoading, ElMessage} from "element-plus";
import axios from "axios";
import {auth_store} from "../stores/auth_store";
import apiClient from "../utils/asiox_instance";

export default {
  name: "MedLogin",
  data() {
    return {
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
    }
  },
  created() {
    this.authStore = auth_store();
  },
  computed: {
    user() {
      return this.authStore.user;
    },
    token() {
      return this.authStore.token;
    }
  },
  methods: {
    confirm() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          const auth = auth_store()
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
                  username: this.loginForm.no,
                  password: this.loginForm.password
                },
                method: 'post',
              },
              {
                timeout: 5000,
              }
          );
          loginLoading.close();

          if(response.data.code !== 0) {
            this.$refs.loginForm.resetFields(['password']);
            console.error("登录失败: ", JSON.stringify(response.data, null, 2));
            ElMessage.error('登录失败: ' + response.data.message)
            this.$refs.loginForm.resetFields(['password']);
            return;
          }

          // 登录成功
          console.log("登录成功: " + JSON.stringify(response.data, null, 2));
          // 首先将用户的数据存入authStore中
          this.authStore.$patch({
            user: response.data.data.user,
            token: response.data.data.token,
          })
          // 跳转到首页
          this.$router.push(this.$router.currentRoute.value.query?.redirect || '/dashboard');
        }
      })
    },
    jump2() {
      console.log(this.$router.push("/register"));
    }
  }
}
</script>

<style scoped >
* {
  padding: 0;
  margin: 0;
  outline: none;
}
body {
  background: linear-gradient(45deg, #6962cd, #267aa0);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.shell{
  background: linear-gradient(45deg, #6962cd, #267aa0);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

}
form {
  position: relative;
}

.shell {
  display: flex;
  justify-content: center;
}

form {
  width: 562px;
  height: 520px;
  background-color: #fff;
  box-shadow: 0px 15px 40px #5a35b6;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

#img-box {
  width: 330px;
  height: 520px;
}

#img-box img {
  height: 100%;
}

#form-body {
  width: 320px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

#welcome-lines {
  width: 100%;
  text-align: center;
  line-height: 1;
}

#w-line-1 {
  color: #7f7f7f;
  font-size: 65px;
}

#w-line-2 {
  color: #9c9c9c;
  font-size: 30px;
  margin-top: 17px;
}

#input-area {
  width: 100%;
  margin-top: 40px;
}

.f-inp {
  padding: 13px 25px;
  border: 2px solid #6e6d6d;
  line-height: 1;
  border-radius: 20px;
  margin-bottom: 15px;
}

.f-inp input {
  width: 100%;
  font-size: 14px;
  padding: 0;
  margin: 0;
  border: 0;
}

.f-inp input::placeholder {
  color: #b9b9b9;
}

#submit-button-cvr {
  margin-top: 20px;
}

#submit-button {
  display: block;
  width: 100%;
  color: #fff;
  font-size: 14px;
  margin: 0;
  padding: 14px 40px;
  border: 0;
  background-color: #f5506e;
  border-radius: 25px;
  line-height: 1;
  cursor: pointer;
}

#forgot-pass {
  text-align: center;
  margin-top: 10px;
}

#forgot-pass a {
  color: #868686;
  font-size: 12px;
  text-decoration: none;
  display: inline-block;
  margin-right: 20px; /*字之间空距离 */
}


</style>