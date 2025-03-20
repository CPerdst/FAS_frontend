<template>
  <div class="shell">

    <div id="img-box" style="transform: scale(1.1);">
      <img src="../assets/loginBackground.jpg" alt="">
    </div>

    <el-form :model="registerForm" label-width="100px"
             :rules="rules" ref="registerForm" style="transform: scale(1.1);">
      <div id="form-body">
        <div id="input-area" style="margin-right: 50px; transform: scale(1.4); ">

          <el-form-item label="用户名" prop="username" >
            <el-input style="width: 200px " type="text" v-model="registerForm.username"
                      autocomplete="off" size="small"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" style="margin-top: 12px">
            <el-input style="width: 200px" type="password" v-model="registerForm.password"
                      show-password autocomplete="off" size="small" @keyup.enter.native="confirm"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex" style="margin-top: 12px">
            <el-radio-group v-model="registerForm.sex">
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
<!--        <el-form-item>-->
<!--          <el-button type="danger" round @click="confirm" :disabled="confirm_disabled" style="width: 100%">注 册</el-button>-->
<!--          <el-button type="danger" round @click="confirm" :disabled="cancle_disabled" style="width: 100%">清 空</el-button>-->
<!--        </el-form-item>-->
<!--        <div id="submit-button-cvr" style="margin-top: 40px;margin-left: -120px">-->
<!--          <el-form-item>-->
<!--            <el-button type="danger" round @click="confirm" :disabled="confirm_disabled" style="width: 200%">注 册</el-button>-->
<!--            <el-button type="danger" round @click="confirm" :disabled="cancle_disabled" style="width: 200%">清 空</el-button>-->
<!--          </el-form-item>-->
<!--        </div>-->
        <div id="forgot-pass" style="margin-right: -280px; margin-top: 40px">
          <el-link :underline="false" @click="goToLogin"><el-icon><Back /></el-icon>返回登陆</el-link>
        </div>
      </div>

    </el-form>

  </div>

</template>
<script>
import {ElLoading, ElMessage} from "element-plus";
import {Back} from '@element-plus/icons-vue'
import axios from "axios";
import apiClient from "../utils/asiox_instance";

export default {
  name: "Register",
  components: {
    Back
  },
  data() {
    return {
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

    }
  },
  methods: {
    confirm() {},
    submitForm() {
      this.$refs.registerForm.validate(async (valid) => {
        if (valid) {
          const registerLoading = ElLoading.service({
            lock: true,
            text: '注册中，请等待',
            background: 'rgba(0, 0, 0, 0.7)',
          })
          // 开始注册
          try{
            const response = await apiClient.post(import.meta.env.VITE_BASE_URL + "/api/user/register"
                , this.registerForm
                , {timeout: 3000});
            // 先关闭加载页面
            registerLoading.close();

            // 判断注册结果
            if(response.data.code === 200){
              ElMessage.success('注册成功');
              this.goToLogin();
            }else {
              ElMessage.error('注册失败')
            }
          }catch(error){
            registerLoading.close();
            // 根据错误类型显示提示
            if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
              ElMessage.error('网络请求超时');
            } else {
              ElMessage.error('注册失败: ' + (error.response?.data?.message || '未知错误'));
            }
          }
        }
      })

    },
    resetForm() {
      this.registerForm = {
        username: '',
        password: '',
        sex: true
      }
      ElMessage.success("Reset Successfully!");
    },
    goToLogin() {
      this.$router.push("/login");
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