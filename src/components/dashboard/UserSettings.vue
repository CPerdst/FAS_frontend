<!--<template>-->
<!--  <div class="user-settings">-->
<!--    &lt;!&ndash; 面包屑导航 &ndash;&gt;-->
<!--    <el-breadcrumb separator="/" class="mb-20">-->
<!--      <el-breadcrumb-item :to="{ path: '/dashboard/main' }">主页</el-breadcrumb-item>-->
<!--      <el-breadcrumb-item>用户设置</el-breadcrumb-item>-->
<!--    </el-breadcrumb>-->

<!--    &lt;!&ndash; 头像上传容器 &ndash;&gt;-->
<!--    <div class="avatar-upload">-->
<!--      <el-upload-->
<!--          class="upload-demo"-->
<!--          :action="avatarUploadUrl"-->
<!--          :on-success="handleAvatarSuccess"-->
<!--          :before-upload="beforeAvatarUpload"-->
<!--          :headers="uploadHeaders"-->
<!--          :show-file-list="false"-->
<!--      >-->
<!--        <el-avatar v-if="user?.avatar" :size="100" :src="user?.avatar" />-->
<!--        <el-avatar v-else :size="100" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>-->
<!--        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>-->
<!--      </el-upload>-->
<!--    </div>-->

<!--    &lt;!&ndash; 用户信息表单 &ndash;&gt;-->
<!--    <el-form-->
<!--        :model="userForm"-->
<!--        :rules="rules"-->
<!--        ref="userForm"-->
<!--        label-width="120px"-->
<!--        class="user-form"-->
<!--    >-->
<!--      <el-form-item label="用户名" prop="username">-->
<!--        <el-input v-model="userForm.username" placeholder="请输入用户名" />-->
<!--      </el-form-item>-->

<!--      <el-form-item label="旧密码" prop="oldPassword">-->
<!--        <el-input-->
<!--            v-model="userForm.oldPassword"-->
<!--            type="password"-->
<!--            placeholder="请输入原来的密码（留空则不修改）"-->
<!--        />-->
<!--      </el-form-item>-->

<!--      <el-form-item label="新密码" prop="password">-->
<!--        <el-input-->
<!--            v-model="userForm.password"-->
<!--            type="password"-->
<!--            placeholder="请输入新密码（留空则不修改）"-->
<!--        />-->
<!--      </el-form-item>-->

<!--      <el-form-item label="性别" prop="gender">-->
<!--        <el-radio-group v-model="userForm.gender">-->
<!--          <el-radio value="男">男</el-radio>-->
<!--          <el-radio value="女">女</el-radio>-->
<!--        </el-radio-group>-->
<!--      </el-form-item>-->

<!--      <el-form-item>-->
<!--        <el-button type="primary" @click="confirmSubmit">保存设置</el-button>-->
<!--      </el-form-item>-->
<!--    </el-form>-->
<!--  </div>-->
<!--</template>-->

<template>
  <div class="user-settings">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" class="mb-20">
      <el-breadcrumb-item :to="{ path: '/dashboard/main' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item>用户设置</el-breadcrumb-item>
    </el-breadcrumb>

    <!--          :action="avatarUploadUrl"-->
    <!-- 头像上传容器 -->
    <div class="avatar-upload">
      <el-upload
          class="upload-demo"
          :http-request="uploadAvatar"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :headers="uploadHeaders"
          :show-file-list="false"
      >
        <el-avatar v-if="user?.avatar" :size="120" :src="user.avatar" class="avatar" />
        <el-avatar v-else :size="120" class="default-avatar" :src="defaultUserAvatar">
          <el-icon><Plus /></el-icon>
        </el-avatar>
      </el-upload>
    </div>

    <!-- 用户信息表单 -->
    <el-form
        :model="userForm"
        :rules="rules"
        ref="userForm"
        label-width="120px"
        class="user-form"
    >
      <!-- 表单项 -->
      <el-form-item
          v-for="(item, key) in formItems"
          :key="key"
          :label="item.label"
          :prop="key"
          class="form-item"
      >
        <component
            :is="item.component"
            v-model="userForm[key]"
            v-bind="item.props"
            :placeholder="item.placeholder"
        >
          <!-- 渲染子组件（如 Radio） -->
          <el-radio
              v-for="option in item.children"
              :key="option.value"
              :label="option.value"
          >
            {{ option.label }}
          </el-radio>
        </component>
        <!-- 错误提示 -->
        <div v-if="errors[key]" class="error-message">
          <i class="el-icon-warning"></i> {{ errors[key] }}
        </div>
      </el-form-item>

      <!-- 保存按钮 -->
      <el-form-item class="submit-item">
        <el-button type="primary" @click="confirmSubmit" round>保存设置</el-button>
      </el-form-item>
    </el-form>

    <!-- 使用 Footer 组件 -->
    <Footer
        :author="authorName"
        :social-links="socialLinks"
        class="page-footer"
    />
  </div>
</template>


<script>
import { auth_store } from '../../stores/auth_store';
import {
  ElAvatar,
  ElBreadcrumb,
  ElBreadcrumbItem, ElButton, ElForm, ElFormItem, ElIcon,
  ElMessage,
  ElMessageBox,
  ElRadio,
  ElRadioGroup,
  ElUpload
} from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import apiClient from "../../utils/asiox_instance";
import axios from "axios";
import Footer from "../Footer.vue";
import {long_timeout, middle_timeout} from "../../utils/constant";

export default {
  components: {
    ElBreadcrumb,
    ElBreadcrumbItem,
    ElUpload,
    ElAvatar,
    ElRadioGroup,
    ElRadio,
    ElFormItem,
    ElForm,
    ElButton,
    ElIcon,
    Plus,
    Footer
  },
  data() {
    return {
      authorName: "l1Akr",
      socialLinks: [
        { text: "GitHub", href: "https://github.com/CPerdst/FAS_frontend", target: "_blank" },
        { text: "Email", href: "2539439359@qq.com", target: "_blank" },
      ],
      userForm: {
        username: "unknown",
        oldPassword: "",
        password: "",
        sex: true
      },
      authStore: null, // 用于存储 Store 实例
      avatarUploadUrl: import.meta.env.VITE_BASE_URL + '/api/file/avatar/upload',
      // 在 UserSettings 组件的 data 中
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" },
        ],
        oldPassword: [
          // 只有当新密码不为空时，旧密码才需要验证
          {
            validator: (rule, value, callback) => {
              if (this.userForm.password && !value) {
                callback(new Error("修改密码时必须填写旧密码"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        password: [
          {
            // 允许留空，但若填写则需符合规则
            validator: (rule, value, callback) => {
              if (value && !/^[a-zA-Z0-9]{1,32}$/.test(value)) {
                callback(new Error("密码必须为1-32位字母或数字"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        gender: [
          { required: true, message: "请选择性别", trigger: "change" },
        ],
      },
      // 动态表单
      formItems: {
        username: {
          label: "用户名",
          component: "el-input",
          placeholder: "请输入用户名",
        },
        oldPassword: {
          label: "旧密码",
          component: "el-input",
          props: { type: "password" },
          placeholder: "请输入原来的密码（留空则不修改）",
        },
        password: {
          label: "新密码",
          component: "el-input",
          props: { type: "password" },
          placeholder: "请输入新密码（留空则不修改）",
        },
        sex: {
          label: "性别",
          component: "el-radio-group",
          placeholder: "",
          children: [
            { label: "男", value: true },
            { label: "女", value: false },
          ],
        },
      },
      errors: {}, // 存储后端返回的错误信息
      defaultUserAvatar: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
    };
  },
  computed: {
    // 动态生成上传请求头
    uploadHeaders() {
      return {
        Authorization: `Bearer ${this.authStore.token}`
      };
    },
    // 从 Store 获取用户信息
    user() {
      return this.authStore.user;
    }
  },
  methods: {
    // 密码验证规则
    validatePassword(rule, value, callback) {
      if (value === '') {
        callback();
      } else if (!/^[a-zA-Z0-9]{1,32}$/.test(value)) {
        callback(new Error('密码必须为1-32位字母或数字'));
      } else {
        callback();
      }
    },

    // 头像上传成功处理
    async handleAvatarSuccess(response, uploadFile) {
      if(response.code === 0){
        ElMessage.success('头像上传成功');
        // 直接获取 response 中的 data(avatar url)
        // 更新 Store 和组件中的头像信息
        this.user.avatar = response.data;

        // 异步获取头像地址
        // try {
        //   const responses = await apiClient.get(import.meta.env.VITE_BASE_URL + '/api/user/avatar', {timeout: 3000});
        //   this.authStore.user.avatar = responses.data.data;
        // }catch(error) {
        //   if(axios.isAxiosError(error)) {
        //     console.log('网络请求超时');
        //   }
        // }
      }
    },

    // 文件上传前检查
    beforeAvatarUpload(file) {
      const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJPGorPNG) {
        ElMessage.error('仅支持 JPG/PNG 格式');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        ElMessage.error('文件大小不能超过2MB');
      }
      return isJPGorPNG && isLt2M;
    },

    // 点击保存时弹窗确认
    async confirmSubmit() {
      console.log(auth_store().user);
      auth_store().logout();
      try {
        // 表单验证
        const valid = await this.$refs.userForm.validate();
        if (!valid) {
          console.log("表单验证失败");
          throw new Error("表单验证失败");
        }

        // 弹窗确认
        await ElMessageBox.confirm(
            "确认保存修改吗？",
            "提示",
            {
              confirmButtonText: "确认",
              cancelButtonText: "取消",
              type: "warning",
            }
        );

        // 调用 Store 的 updateUser 方法
        const data = await this.authStore.updateUser(this.userForm);

        if(data === null || data.code !== 0) {
          ElMessage.error(data?.message || "未知错误");
          return;
        }

        // 展示成功消息
        ElMessage.success("用户信息更新成功");
        // 更新auth_store
        this.authStore.$patch((state) => {
          state.user.username = this.userForm.username;
          state.user.sex = this.userForm.sex;
        })

        this.$refs.userForm.resetFields(["password", "oldPassword"]); // 重置密码字段

      } catch (error) {
        console.log("Error: ", error);
        if (error === "cancel") {
          ElMessage.info("已取消保存");
        } else if (axios.isAxiosError(error)) {
          // 处理后端返回的错误（如 401、400 等）
          if (error.response?.status === 401) {
            ElMessage.error("登录已过期，请重新登录");
            this.authStore.logout(); // 清除 token 和用户信息
            this.$router.push("/login"); // 重定向到登录页
          } else {
            ElMessage.error(
                error.response?.data?.message || "更新失败，请检查输入并重试"
            );
          }
        } else if (error?.oldPassword || error?.password || error?.username || error?.gender) {
          ElMessage.error("请完善表单信息");
        } else {
          // 其他错误（如网络错误）
          ElMessage.error("发生未知错误，请重试");
        }
      }
    },

    // 上传头像
    async uploadAvatar({ file }) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await apiClient.post(
            this.avatarUploadUrl,
            formData,
            {
              timeout: long_timeout
            }
        );

        await this.handleAvatarSuccess(response.data);

        return response;
      }catch(error) {

      }

    }
  },
  created() {
    // 初始化 Store 和表单初始值
    this.authStore = auth_store();
    const user = this.authStore.user;
    this.userForm.username = user?.username || '';
    this.userForm.sex = user?.sex === null ? true : user?.sex
  }
};
</script>

<style scoped>
.user-settings {
  padding: 40px;
  max-width: 600px;
  margin: 0 auto;
  background-color: #f5f7fa;
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* 头像上传样式 */
.avatar-upload {
  margin: 30px 0;
  text-align: center;
}

.avatar {
  border: 2px solid #fff;
  border-radius: 50%;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.default-avatar {
  background-color: #f0f2f5;
  border: 2px dashed #d9d9d9;
}

/* 表单样式 */
.user-form {
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.form-item {
  margin-bottom: 25px;
}

.error-message {
  color: #ff4949;
  font-size: 13px;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.error-message .el-icon-warning {
  color: #ff4949;
}

/* 按钮样式 */
.submit-item {
  text-align: center;
  margin-top: 30px;
}

.submit-item .el-button {
  padding: 12px 40px;
  font-size: 16px;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  border-color: transparent;
  margin: 0 20px;
}

.submit-item .el-button:hover {
  opacity: 0.9;
}

.page-footer {
  margin-top: 30px; /* 调整与表单的距离 */
}
</style>

<!--<style scoped>-->
<!--.user-settings {-->
<!--  padding: 20px;-->
<!--  text-align: center;-->
<!--}-->

<!--.mb-20 {-->
<!--  margin-bottom: 20px;-->
<!--}-->

<!--.avatar-upload {-->
<!--  margin: 20px auto;-->
<!--}-->

<!--/* 头像上传样式 */-->
<!--.avatar-uploader-icon {-->
<!--  border: 1px dashed #d9d9d9;-->
<!--  border-radius: 6px;-->
<!--  cursor: pointer;-->
<!--  font-size: 28px;-->
<!--  color: #8c939d;-->
<!--  width: 100px;-->
<!--  height: 100px;-->
<!--  line-height: 100px;-->
<!--  text-align: center;-->
<!--}-->

<!--.upload-demo {-->
<!--  border: 1px dashed #d9d9d9;-->
<!--  border-radius: 6px;-->
<!--  cursor: pointer;-->
<!--  position: relative;-->
<!--  overflow: hidden;-->
<!--  display: inline-block;-->
<!--}-->

<!--/* 表单样式 */-->
<!--.user-form {-->
<!--  width: 400px;-->
<!--  margin: 0 auto;-->
<!--}-->
<!--</style>-->