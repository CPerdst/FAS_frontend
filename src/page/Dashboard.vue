<script setup>
import Header from '../components/Header.vue'
import * as constants from '../utils/constant';
import Aside from "../components/Aside.vue";
import {onBeforeMount, onMounted} from "vue";
import {LOGIN_PANEL_URL} from "../utils/constant";
import {auth_store} from "../stores/auth_store";
import {useRoute, useRouter} from "vue-router";

const authStore = auth_store();

onMounted(() => {
  // 进入dashboard的时候判断是否登录
  if(authStore.user === null) {
    // 如果没有登录，跳转到登录页面
    router.push(LOGIN_PANEL_URL);
  } else {
    console.log("用户已登录");
  }
});

const router = useRouter();
const route = useRoute();

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
      <Aside
        :panel-menu="constants.panelMenu"
        :router="true"
      />
      <el-container>
        <router-view/>
      </el-container>
    </el-container>

  </div>
</template>

<style lang="scss" scoped>
@use '../assets/css/dashboard';
</style>