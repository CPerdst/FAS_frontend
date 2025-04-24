<script setup>
import {
  ref,
  defineProps, onMounted
} from 'vue'

const activeName = ref('first');

const props = defineProps({
  SettingTableList: {
    type: Array,
    default: () => []
  }
})

</script>

<template>
  <el-tabs v-model="activeName">
    <template v-for="(item, index) in props.SettingTableList">
      <el-tab-pane :label="item.label" :name="item.name">
        <component :is="item.component" />
      </el-tab-pane>
    </template>
  </el-tabs>
</template>

<style scoped>

</style>