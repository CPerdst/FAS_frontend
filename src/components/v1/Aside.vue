<script setup>
import {
  reactive, defineProps, onMounted, onBeforeMount
} from "vue";

import {
  useRouter, useRoute
} from "vue-router";

import * as constants from "../../utils/constant";

import Github from "../../icon/Github.vue";

import {
  House
} from '@element-plus/icons-vue'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

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
  },
  footer: {
    type: Object,
    default: () => {
      return {
        author: '',
        github: ''
      }
    }
  }
});

const router = useRouter();
const route = useRoute();

</script>

<template>
  <el-aside
      :width="asideData.isCollapse ? '64px' : '256px'"
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
    <template v-if="footer.author">
      <div class="aside-footer" v-if="!asideData.isCollapse">
        <span>Created by {{constants.AUTHOR}}</span>
        <a :href="constants.AUTHOR_GITHUB" target="_blank" rel="noopener noreferrer">
          <el-icon class="github-icon">
            <font-awesome-icon :icon="['fab', 'github']"/>
          </el-icon>
        </a>
      </div>
    </template>
  </el-aside>
</template>

<style lang="scss" scoped>
@use "../../assets/css/aside";
</style>