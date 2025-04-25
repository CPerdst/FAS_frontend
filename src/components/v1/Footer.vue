<script setup>

import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {currentDate} from "../../utils/common_utils";

const props = defineProps({
  author: {
    type: String,
    default: "匿名作者"
  },
  socialLinks: {
    type: Array,
    default: () => []
  },
  time: {
    type: Boolean,
    default: true
  }
});

</script>

<template>
  <div class="footer">
    <template v-if="props.author">
      Created By <span class="footer-span footer-author"> {{ props.author }}</span>
    </template>
    <template v-if="props.socialLinks">
      |
    </template>
    <template v-for="link in props.socialLinks">
      <a :href="link.url" target="_blank" class="footer-span footer-link">
        <el-icon>
          <FontAwesomeIcon :icon="link.icon"/>
        </el-icon>
      </a>
    </template>
    <template v-if="props.time">
      |
      <span class="footer-span footer-time">
        {{ currentDate }}
      </span>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@use '../../assets/css/footer';
</style>