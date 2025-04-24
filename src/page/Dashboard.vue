<script setup>
import Header from '../components/Header.vue'
import * as constants from '../utils/constant';
import Aside from "../components/Aside.vue";
import {onBeforeMount, onMounted} from "vue";
import {LOGIN_PANEL_URL} from "../utils/constant";
import {auth_store} from "../stores/auth_store";
import {useRoute, useRouter} from "vue-router";
import {storeToRefs} from "pinia";

const router = useRouter();
const route = useRoute();
const authStore = auth_store();

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

onMounted(() => {
  // 进入dashboard的时候判断是否登录
  if(authStore.user === null || authStore.token === null) {
    // 如果没有登录，跳转到登录页面
    router.push(LOGIN_PANEL_URL);
  }
});

</script>

<template>
  <div class="dashboard-container">
      <Header :height="constants.HEADER_HEIGHT"
              :title="constants.HEADER_TITLE"
              avatar_shape="circle"
              :drop-down-menu="constants.userDropDownBoxOption"
              :user="auth_store().user"
      />
    <el-container style="background-color: #f5f5f5;">
      <template v-if="route.path !== '/dashboard/login'">
        <Aside
            :panel-menu="constants.panelMenu"
            :router="true"
        />
      </template>
      <el-container>
        <router-view/>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
@use '../assets/css/dashboard';
</style>