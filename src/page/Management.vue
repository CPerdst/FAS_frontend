<template>
  <div class="management-container">
    <router-view />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<style scoped>
.management-container {
  width: 100%;
  height: 100%;
}
</style>