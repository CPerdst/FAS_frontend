<script setup>
import {
  ElAvatar, ElButton, ElForm, ElFormItem, ElIcon, ElMessage, ElRadio, ElUpload
} from "element-plus";

import {
  Plus, House, Lock
} from "@element-plus/icons-vue";
import {auth_store} from "../../stores/auth_store";
import {AVATAR_UPLOAD_URL, DEFAULT_USER_AVATAR, long_timeout} from "../../utils/constant";
import * as constants from '../../utils/constant'
import apiClient from "../../utils/asiox_instance";
import {
  reactive, defineProps, onMounted
} from "vue";
import * as constant from "../../utils/constant";
import VueJsonPretty from "vue-json-pretty";
import 'vue-json-pretty/lib/styles.css'


const authStore = auth_store();

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

const userSettingTabData = reactive({
  userForm: {
    username: "",
    oldPassword: "",
    password: "",
    sex: true
  },
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
  formItems: {
    username: {
      label: "用户名",
      component: "el-input",
      props: { size: 'large', 'prefix-icon': House},
      placeholder: "请输入用户名",
    },
    oldPassword: {
      label: "旧密码",
      component: "el-input",
      props: { type: "password", 'show-password': true, size: 'large', 'prefix-icon': Lock},
      placeholder: "请输入原来的密码（留空则不修改）",
    },
    password: {
      label: "新密码",
      component: "el-input",
      props: { type: "password", 'prefix-icon': Lock, maxlength: 32, size: 'large', 'show-password': true},
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
})


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

onMounted(() => {
  console.log(JSON.stringify(props.userForm))
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
        ref="userForm"
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
    <el-button type="primary" round>重置设置</el-button>
    <el-button type="primary" round>保存设置</el-button>
  </div>

</template>

<style lang="scss" scoped>
@use '../../assets/css/user_setting_tab.scss';
</style>