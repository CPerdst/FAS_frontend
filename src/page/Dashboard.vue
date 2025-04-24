<script setup>
import Header from '../components/v1/Header.vue'

import * as constants from '../utils/constant';

import Aside from "../components/v1/Aside.vue";

import {
  onMounted, ref
} from "vue";

import {
  ASIDE_FOOTER,
  AUTH_PANEL_SWITCH, HEADER_HEIGHT,
  LOGIN_PANEL_URL, settingTableList
} from "../utils/constant";

import {
  auth_store
} from "../stores/auth_store";

import {
  useRoute, useRouter
} from "vue-router";

import {
  ArrowUp, ArrowDown
} from "@element-plus/icons-vue";
import SettingTable from "../components/v1/SettingTable.vue";

const router = useRouter();
const route = useRoute();
const authStore = auth_store();
const shellHeight = ref(0);
const drawer = ref(false);

let logoutObj = constants.userDropDownBoxOption.find(item => item.name === 'logout');
let settingObj = constants.userDropDownBoxOption.find(item => item.name === 'setting');
// 设置退出登录的点击事件
logoutObj.clickHandle = () => {
  // 退出登录逻辑
  if(authStore.user === null || authStore.token === null) {
    return;
  }
  // 只有没有退出，才执行退出逻辑
  authStore.logout();
  router.push(authStore.redirectPath || '/dashboard/login');
  // 更新用户状态
  authStore.$patch(
      {
        user: null,
        token: null,
      }
  )
}

settingObj.clickHandle = () => {
  // 打开设置Drawer
  drawer.value = true;
}

onMounted(() => {
  // 进入dashboard的时候判断是否登录
  if(authStore.user === null || authStore.token === null) {
    // 如果没有登录，跳转到登录页面
    router.push(LOGIN_PANEL_URL);
  }
  const headerHeightNum = parseFloat(HEADER_HEIGHT);
  shellHeight.value = window.innerHeight - headerHeightNum;
});

// =======================
// 底部边栏
// =======================
const isExpanded = ref(false);
const togglePanel = () => {
  isExpanded.value = !isExpanded.value;
};

</script>

<template>
  <div class="dashboard-container">
      <Header :height="constants.HEADER_HEIGHT"
              :title="constants.HEADER_TITLE"
              avatar_shape="circle"
              :drop-down-menu="constants.userDropDownBoxOption"
              :user="auth_store().user"
      />
    <el-container class="main-container"
                  :style="{height: `${shellHeight}px`}"
    >
      <template v-if="route.path !== '/dashboard/login' && route.path !== '/dashboard/register'">
        <Aside
            :panel-menu="constants.panelMenu"
            :router="true"
            :footer="constants.ASIDE_FOOTER"
        />
      </template>
      <el-container class="main-content" :style="{
        padding: '20px 20px',
      }">
        <router-view/>
      </el-container>
    </el-container>
  </div>
  <el-drawer
      class="setting-drawer"
      v-model="drawer"
      :with-header="false"
      size="50%"
      style="backdrop-filter: blur(4px); background-color: rgba(255, 255, 255, 0.7);"
  >
    <SettingTable :SettingTableList="constants.settingTableList"/>
  </el-drawer>
  <template v-if="constants.AUTH_PANEL_SWITCH">
    <div class="state-panel" :class="{ 'expanded': isExpanded }">
      <div class="panel-header">
        <button class="panel-toggle-btn" @click="togglePanel">
          <el-icon>
            <ArrowDown v-if="isExpanded" />
            <ArrowUp v-else />
          </el-icon>
        </button>
      </div>
      <div class="panel-content" v-if="isExpanded">
        <pre>{{ authStore.user ? authStore.user : 'null'}}</pre>
        <pre>{{ authStore.token ? authStore.token : 'null'}}</pre>
        <pre>{{ authStore.redirectPath ? authStore.redirectPath : 'null' }}</pre>
      </div>
    </div>
  </template>
</template>

<style lang="scss" scoped>
@use '../assets/css/dashboard';
</style>