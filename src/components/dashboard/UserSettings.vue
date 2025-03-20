<template>
  <div class="user-settings">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" class="mb-20">
      <el-breadcrumb-item :to="{ path: '/dashboard/main' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item>用户设置</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 头像上传容器 -->
    <div class="avatar-upload">
      <el-upload
          class="upload-demo"
          :action="avatarUploadUrl"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :headers="uploadHeaders"
          :show-file-list="false"
      >
        <el-avatar v-if="user.avatar" :size="100" :src="user?.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'" />
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload>
    </div>

    <!-- 用户信息表单 -->
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

<!--      <el-form-item label="密码" prop="password">-->
<!--        <el-input-->
<!--            v-model="userForm.password"-->
<!--            type="password"-->
<!--            placeholder="请输入新密码（留空则不修改）"-->
<!--        />-->
<!--      </el-form-item>-->

<!--      <el-form-item label="性别" prop="gender">-->
<!--        <el-radio-group v-model="userForm.gender">-->
<!--          <el-radio label="男">男</el-radio>-->
<!--          <el-radio label="女">女</el-radio>-->
<!--        </el-radio-group>-->
<!--      </el-form-item>-->

<!--      <el-form-item>-->
<!--        <el-button type="primary" @click="confirmSubmit">保存设置</el-button>-->
<!--      </el-form-item>-->
<!--    </el-form>-->
  </div>
</template>

<script>
import { ref } from 'vue';
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
    Plus
  },
  data() {
    return {
      userForm: {
        username: '',
        password: '',
        gender: '男',
        avatar: '',
      },
      authStore: null, // 用于存储 Store 实例
      avatarUploadUrl: import.meta.env.VITE_BASE_URL + '/api/user/avatar',
      rules: {

      }
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
    handleAvatarSuccess(response, uploadFile) {
      this.userForm.avatar = response.url;
      this.authStore.updateUserAvatar(response.url);
      ElMessage.success('头像上传成功');
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
      try {
        // 弹出确认对话框
        await ElMessageBox.confirm(
            '确认保存修改吗？',
            '提示',
            {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning'
            }
        );

        // 表单验证
        const valid = await this.$refs.userForm.validate();
        if (valid) {
          try {
            // 提交用户信息到后端
            await this.authStore.updateUser(this.userForm);
            ElMessage.success('用户信息更新成功');
            // 重置密码输入框
            this.$refs.userForm.resetFields(['password']);
          } catch (error) {
            ElMessage.error('更新失败，请重试');
          }
        }
      } catch (error) {
        if (error === 'cancel') {
          ElMessage.info('已取消保存');
        }
      }
    }
  },
  created() {
    // 初始化 Store 和表单初始值
    this.authStore = auth_store();
    const user = this.authStore.user;
    this.userForm.username = user?.username || '';
    this.userForm.gender = user?.gender || '男';
    this.userForm.avatar = user?.avatar || '';
  }
};
</script>

<style scoped>
.user-settings {
  padding: 20px;
  text-align: center;
}

.mb-20 {
  margin-bottom: 20px;
}

.avatar-upload {
  margin: 20px auto;
}

/* 头像上传样式 */
.avatar-uploader-icon {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.upload-demo ::v-deep .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: inline-block;
}

/* 表单样式 */
.user-form {
  width: 400px;
  margin: 0 auto;
}
</style>