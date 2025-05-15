<template>
  <el-aside
      class="management-aside"
      :width="managementAsideData.isCollapse ? '64px' : '256px'"
      style="background-color: #f5f5f5;"
  >
    <el-menu
        :default-active="$route.path"
        :router="true"
        class="management-menu"
    >
      <el-menu-item index="/dashboard/management/main">
        <el-icon><House /></el-icon>
        <span>管理首页</span>
      </el-menu-item>

      <el-sub-menu index="user-management">
        <template #title>
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </template>
        <el-menu-item index="/dashboard/management/users">用户列表</el-menu-item>
        <el-menu-item index="/dashboard/management/roles">角色列表</el-menu-item>
        <el-menu-item index="/dashboard/management/permissions">权限列表</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="data-management">
        <template #title>
          <el-icon><DataBoard /></el-icon>
          <span>数据管理</span>
        </template>
        <el-menu-item index="/dashboard/management/samples">样本列表</el-menu-item>
        <!-- <el-menu-item index="/dashboard/management/reports">报告列表</el-menu-item> -->
      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>

<script setup>
import {
  House,
  User,
  DataBoard
} from '@element-plus/icons-vue';

import {
  ref, reactive
} from "vue";

const managementAsideData = reactive({
  isCollapse: false,
})

</script>

<style scoped>
.management-aside {
  height: 100%;
  background-color: #f5f5f5;
}

.management-menu {
  height: 100%;
  border-right: none;
}
</style>