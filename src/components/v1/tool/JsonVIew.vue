<script setup>
import {
  computed,
  reactive, ref
} from "vue";
import VueJsonPretty from "vue-json-pretty";
import {ArrowDown, ArrowUp} from "@element-plus/icons-vue";

// =======================
// 底部边栏
// =======================
const isExpanded = ref(false);
const togglePanel = () => {
  isExpanded.value = !isExpanded.value;
};

const props = defineProps({
  JsonPanel: {
    type: Object,
    default: () => {return {
      data: {}
    };}
  }
});

</script>

<template>
  <div class="state-panel" :class="{ 'expanded': isExpanded }">
    <div class="panel-header">
      <button class="panel-toggle-btn" @click="togglePanel">
        <el-icon>
          <ArrowDown v-if="isExpanded" />
          <ArrowUp v-else />
        </el-icon>
      </button>
    </div>
    <div class="panel-content" v-if="isExpanded">
      <el-divider border-style="solid" />
      <div class="user-setting-panel" style="background-color: #ffffff">
        <VueJsonPretty
            :data="props.JsonPanel?.data ? props.JsonPanel.data : {}"
            :deep="3"
            showLength
            highlightMouseover
            class="json-viewer"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../../../assets/css/json-view';
</style>