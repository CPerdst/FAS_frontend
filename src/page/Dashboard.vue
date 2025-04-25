<script setup>
import Header from '../components/v1/Header.vue'

import * as constants from '../utils/constant';

import Aside from "../components/v1/Aside.vue";

import {
  computed,
  onMounted, ref
} from "vue";

import {
  ASIDE_FOOTER,
  AUTH_PANEL_SWITCH, HEADER_HEIGHT, JSON_PANEL_PROPS,
  LOGIN_PANEL_URL, settingTableList
} from "../utils/constant";

import {
  auth_store
} from "../stores/auth_store";

import {
  useRoute, useRouter
} from "vue-router";

import SettingTable from "../components/v1/SettingTable.vue";
import Footer from "../components/v1/Footer.vue";
import JsonVIew from "../components/v1/tool/JsonVIew.vue";
import {addPropsToJsonPanel, removePropsFromJsonPanel} from "../utils/common_utils";

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

  // 添加用户信息监视
  addPropsToJsonPanel('user', authStore.user);
  addPropsToJsonPanel('token', authStore.token);
  addPropsToJsonPanel('redirectPath', authStore.redirectPath);
});

/**
 * 根据路由获取标题
 * @param path
 */
function getBreadcrumbPath(path) {
  const split = path.split('/');
  const suffix = split[split.length - 1];
  const breadcrumbList = [];

  for(const item of constants.panelMenu) {
    if(item.name === suffix) {
      breadcrumbList.push(item.title);
      break;
    }
    let flag = false;
    if(item.submenu) {
      for(const subItem of item.submenu) {
        if(subItem.name === suffix) {
          breadcrumbList.push(item.title, subItem.title);
          flag = true;
        }
      }
    }
    if(flag) {
      break;
    }
    breadcrumbList.pop()
  }

  console.log('breadcrumbList', breadcrumbList)
  return breadcrumbList;
}

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
        padding: '0 0',
      }">
        <template v-if="route.path !== '/dashboard/login' && route.path !== '/dashboard/register'">
          <el-breadcrumb separator="/" class="breadcrumb">
            <template v-for="(item, index) in getBreadcrumbPath(route.path)">
              <el-breadcrumb-item>{{ item }}</el-breadcrumb-item>
            </template>
          </el-breadcrumb>
        </template>
        <router-view style="flex: 1;"/>
        <Footer
            :author="constants.FOOTER.author"
            :social-links="constants.FOOTER.socialLinks"
            :time="constants.FOOTER.time"
        />
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
  <template v-if="constants.JSON_VIEW_SWITCH">
    <JsonVIew :JsonPanel="constants.JSON_PANEL_PROPS"/>
  </template>
</template>

<style lang="scss" scoped>
@use '../assets/css/dashboard';
</style>