<template>
  <div class="dashboard-container">
    <!-- 顶部导航栏 -->
    <el-header class="header" style="background-color: #267aa0; color: white;">
      <div class="header-content">
        <!-- 折叠按钮 -->
<!--        <el-button class="collapse-btn" @click="toggleCollapse" :icon="isCollapse ? 'Expand' : 'Fold'" />-->
        <el-button class="collapse-btn" @click="toggleCollapse">
          <el-icon :size="20">
<!--            <component :is="isCollapse ? Expand : Fold" />-->
            <div v-if="isCollapse">
              <Expand/>
            </div>
            <div v-else>
              <Fold/>
            </div>
          </el-icon>
        </el-button>

        <!-- 系统名称 -->
        <h3 class="system-name">FAS</h3>

        <!-- 用户信息和头像 -->
        <div class="user-info">
          <el-dropdown @command="handleDropdownCommand">
            <span class="user-info-trigger">
              <el-avatar :size="30" :src="authStore.user?.avatar || userAvatar" />
              <span>{{ authStore.user?.username || "null" }}</span>
              <el-icon class="arrow-icon">
                <ArrowDown />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-header>

    <!-- 主体内容 -->
    <el-container>
      <!-- 动态宽度的侧边栏 -->
      <el-aside
          :width="isCollapse ? '64px' : '200px'"
          style="background-color: #f5f5f5;"
      >
        <el-menu
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="router"
            :default-active="$route.path"
            style="height: 100%; border-right: none;"
        >
          <el-menu-item index="/dashboard/main">
            <el-icon><House /></el-icon>
            <template #title>主页</template>
          </el-menu-item>
          <el-menu-item index="/dashboard/sampleUpload">
            <el-icon><User /></el-icon>
            <template #title>样本上传</template>
          </el-menu-item>
          <el-menu-item index="/dashboard/reportSummary">
            <el-icon><Document /></el-icon>
            <template #title>报告查看</template>
          </el-menu-item>
          <el-menu-item index="/dashboard/userSettings">
            <el-icon><Setting /></el-icon>
            <template #title>用户设置</template>
          </el-menu-item>
          <el-menu-item index="/dashboard/settings">
            <el-icon><Setting /></el-icon>
            <template #title>系统设置</template>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 内容区域 -->
      <el-main
          style="padding: 20px; background-color: #eef2f7;"
      >
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {
  ArrowDown,
  House,
  User,
  Document,
  Setting,
  Fold,
  Expand
} from '@element-plus/icons-vue';
import { auth_store } from '../stores/auth_store';
import { ElMessage } from 'element-plus';

export default {
  name: 'Dashboard',
  components: {
    ArrowDown,
    House,
    User,
    Document,
    Setting,
    Fold,
    Expand
  },
  data() {
    return {
      userAvatar: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
      authStore: auth_store(),
      isCollapse: false, // 控制侧边栏展开状态,
      router: true
    };
  },
  computed: {
    user() {
      return this.authStore.user;
    }
  },
  methods: {
    // 切换侧边栏展开状态
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },

    // 用户下拉菜单操作
    handleDropdownCommand(command) {
      if (command === 'logout') {
        this.authStore.logout();
        ElMessage.success('退出成功');
        this.$router.push('/login');
      }
    }
  },
  mounted() {
    // 确保从Store获取用户信息（未注释前的初始化代码）
    // this.authStore.user = {
    //   name: 'Dr. 张三',
    //   role: '医生',
    //   avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    // };
  }
};
</script>

<style lang="scss" scoped>
@use '../assets/css/dashboard';
</style>