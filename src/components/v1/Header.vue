<script setup>
import {onMounted, defineProps} from 'vue';
import {
  ArrowDown,

} from '@element-plus/icons-vue';

const props = defineProps({
  height: {
    type: String,
    default: '60px'
  },
  title: {
    type: String,
    default: 'Header'
  },
  avatar_shape: {
    type: String,
    default: 'square'
  },
  github: {
    type: String,
    default: ''
  },
  user: {
    type: Object,
    default: () => ({
      username: '未登录',
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    })
  },
  dropDownMenu: {
    type: Array,
    default: () => []
  }
})

function handleDropdownCommand(command) {
  const item = props.dropDownMenu.find(item => item.name === command);
  if(item && item.clickHandle) {
    item.clickHandle();
  } else {
    console.log('未定义的点击事件：', command);
  }
}
</script>

<template>
  <el-header :style="{ height: `${props.height}`, display: 'flex', alignItems: 'center', padding: '0 20px' }">
    <div class="header-title slide-in">
      {{ props.title }}
    </div>

    <!-- 用户信息和头像 -->
    <div class="user-info">
      <el-dropdown @command="handleDropdownCommand">
        <span class="user-info-trigger slide-in">
          <el-avatar :size="40" :src="(props.user ? props.user.avatar : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png')" :shape="props.avatar_shape"/>
          <span>{{ (props.user ? props.user.username : '未登录')}}</span>
          <el-icon class="arrow-icon">
            <ArrowDown />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="(item) in props.dropDownMenu" :command="item.name">
              <el-icon v-if="item.icon" :size="18">
                <component :is="item.icon" />
              </el-icon>
              <el-link :underline="false" :href="item.link" target="_blank">{{ item.title }}</el-link>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<style lang="scss" scoped>
@use '../../assets/css/dashboard-header';
</style>