<script setup>
import {
  ElAvatar, ElButton, ElForm, ElFormItem, ElIcon, ElMessage, ElMessageBox, ElRadio, ElUpload
} from "element-plus";

import {
  Plus, House, Lock
} from "@element-plus/icons-vue";
import {auth_store} from "../../stores/auth_store";
import {AVATAR_UPLOAD_URL, DEFAULT_USER_AVATAR, long_timeout, UPDATE_USER_URL} from "../../utils/constant";
import * as constants from '../../utils/constant'
import apiClient from "../../utils/asiox_instance";
import {
  reactive, defineProps, onMounted, ref
} from "vue";
import * as constant from "../../utils/constant";
import VueJsonPretty from "vue-json-pretty";
import 'vue-json-pretty/lib/styles.css'
import axios from "axios";


const authStore = auth_store();

const userFormRef = ref(null);

const props = defineProps({
  userForm: {
    type: Object,
    default: () => {return {};}
  },
  rules: {
    type: Object,
    default: () => {return {};}
  },
  formItems: {
    type: Object,
    default: () => {return {};}
  },
  errors: {
    type: Object,
    default: () => {return {};}
  }
});

async function uploadAvatar({ file }) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiClient.post(
      constants.AVATAR_UPLOAD_URL,
      formData,
      {
        timeout: long_timeout
      }
  );
  await handleAvatarSuccess(response.data);
  return response;
}

async function handleAvatarSuccess(response, uploadFile) {
  if(response.code === 0){
    ElMessage.success('头像上传成功');
    // 直接获取 response 中的 data(avatar url)
    // 更新 Store 和组件中的头像信息
    authStore.user.avatar = response.data;
  }
}

function beforeAvatarUpload(file) {
  const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJPGorPNG) {
    ElMessage.error('仅支持 JPG/PNG 格式');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    ElMessage.error('文件大小不能超过2MB');
  }
  return isJPGorPNG && isLt2M;
}

const uploadHeaders = {
  Authorization: `Bearer ${localStorage.getItem('token')}`
}

function resetUserForm() {
  Object.assign(props.userForm, {
    username: authStore.user.username,
    oldPassword: "",
    password: "",
    sex: authStore.user.sex
  });
}

async function handleSubmit() {
  try {
    const valid = userFormRef.value.validate(async (valid) => {
      if(valid) {
        return true;
      }
    });

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
    const response = await apiClient({
      url: UPDATE_USER_URL,
      method: 'POST',
      data: {
        username: props.userForm.username,
        oldPassword: props.userForm.oldPassword,
        newPassword: props.userForm.password,
        sex: props.userForm.sex,
      },
      config: {
        timeout: long_timeout
      }
    });

    if(response.data.code !== 0) {
      console.error("更新用户信息失败: ", JSON.stringify(response.data, null, 2));
      ElMessage.error('更新用户信息失败: ' + response.data.message);
      return;
    }

    // 展示成功消息
    ElMessage.success("用户信息更新成功");
    // 更新auth_store
    authStore.$patch((state) => {
      state.user.username = props.userForm.username;
      state.user.sex = props.userForm.sex;
    });

    resetUserForm();
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
}

onMounted(() => {
  // 设置 userForm
  resetUserForm();
})

</script>

<template>
  <div class="form-content">
    <div class="avatar-upload">
      <el-upload
          class="upload-demo"
          :http-request="uploadAvatar"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :headers="uploadHeaders"
          :show-file-list="false"
      >
        <el-avatar v-if="authStore.user?.avatar" :size="120" :src="authStore.user.avatar" class="avatar" />
        <el-avatar v-else :size="120" class="default-avatar" :src="constants.DEFAULT_USER_AVATAR">
          <el-icon><Plus /></el-icon>
        </el-avatar>
      </el-upload>
    </div>

    <el-form
        :model="props.userForm"
        :rules="props.rules"
        ref="userFormRef"
        label-width="120px"
        class="user-form"
    >
      <!-- 表单项 -->
      <el-form-item
          v-for="(item, key) in props.formItems"
          :key="key"
          :label="item.label"
          :prop="key"
          class="form-item"
      >
        <component
            :is="item.component"
            v-model="props.userForm[key]"
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
        <div v-if="props.errors[key]" class="error-message">
          <i class="el-icon-warning"></i> {{ props.errors[key] }}
        </div>
      </el-form-item>
    </el-form>
    <template v-if="constant.USER_SETTING_PANEL_SWITCH">
      <el-divider border-style="solid" />
      <div class="user-setting-panel" style="background-color: #ffffff">
        <VueJsonPretty
            :data="props"
            :deep="3"
            showLength
            highlightMouseover
            class="json-viewer"
        />
      </div>
    </template>
  </div>
  <div class="submit-content">
    <el-button type="primary" @click="resetUserForm" round>重置设置</el-button>
    <el-button type="primary" @click="handleSubmit" round>保存设置</el-button>
  </div>

</template>

<style lang="scss" scoped>
@use '../../assets/css/user_setting_tab.scss';
</style>