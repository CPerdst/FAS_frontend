<script setup>
import Header from '../components/Header.vue'
import * as constants from '../utils/constant';
import {userDropDownBoxOption} from "../utils/constant";


</script>

<template>
  <div class="dashboard-container">
    <Header :height="constants.HEADER_HEIGHT"
            :title="constants.HEADER_TITLE"
            avatar_shape="circle"
            :drop-down-menu="constants.userDropDownBoxOption"
    />
    
  </div>
</template>

<style lang="scss" scoped>
@use '../assets/css/dashboard';
</style>