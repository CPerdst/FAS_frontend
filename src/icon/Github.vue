<template>
  <svg class="icon" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script setup>
import { ref, defineProps } from 'vue';

// 定义 props
const props = defineProps({
  iconName: {
    type: String,
    default: '#icon-github' // 默认图标名称
  }
});
</script>

<style scoped>
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>