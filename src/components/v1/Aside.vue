<script setup>
import {
  reactive, defineProps, onMounted, onBeforeMount
} from "vue";

import {
  useRouter, useRoute
} from "vue-router";

import {auth_store} from "../../stores/auth_store";
import {LOGIN_PANEL_URL} from "../../utils/constant";

const asideData = reactive({
  isCollapse: false
});

const props = defineProps({
  router: {
    type: Boolean,
    default: false
  },
  panelMenu: {
    type: Array,
    default: () => []
  }
});

const router = useRouter();
const route = useRoute();

</script>

<template>
  <el-aside
      :width="asideData.isCollapse ? '64px' : '200px'"
      style="background-color: #f5f5f5;"
  >
    <el-menu
        :collapse="asideData.isCollapse"
        :collapse-transition="false"
        :router="props.router"
        :default-active="route.path"
        style="height: 100%; border-right: none;"
    >
      <template v-if="route.path !== '/dashboard/setting'">
        <template v-for="(item, index) in props.panelMenu" :key="index">
          <el-sub-menu v-if="item.submenu" :index="item.path">
            <template #title>
              <el-icon v-if="item.icon" :size="18">
                <component :is="item.icon" />
              </el-icon>
              <template v-if="!asideData.isCollapse">
                {{item.title}}
              </template>
            </template>
            <template v-for="(subItem, subIndex) in item.submenu" :key="subIndex">
              <el-menu-item :index="subItem.path">
                <el-icon v-if="subItem.icon" :size="18">
                  <component :is="subItem.icon" />
                </el-icon>
                <template #title>{{subItem.title}}</template>
              </el-menu-item>
            </template>
          </el-sub-menu>
          <el-menu-item v-else :index="item.path">
            <el-icon v-if="item.icon" :size="18">
              <component :is="item.icon" />
            </el-icon>
            <template v-if="!asideData.isCollapse">
              {{item.title}}
            </template>
          </el-menu-item>
        </template>
      </template>

    </el-menu>

  </el-aside>
</template>

<style scoped>
@use "../assets/css/aside.css";
</style>