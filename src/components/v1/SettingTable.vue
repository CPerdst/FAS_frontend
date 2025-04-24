<script setup>
import {
  ref,
  defineProps, onMounted, reactive
} from 'vue'

const activeName = ref('first');

const props = defineProps({
  SettingTableList: {
    type: Array,
    default: () => []
  }
})

const reactiveProps = reactive(
  props.SettingTableList.map(item => ({
    ...item,
    props: item.props ? reactive(item.props) : null
  }))
)

</script>

<template>
  <el-tabs v-model="activeName">
    <template v-for="(item, index) in reactiveProps">
      <el-tab-pane :label="item.label" :name="item.name">
        <component :is="item.component" v-bind="item.props"/>
      </el-tab-pane>
    </template>
  </el-tabs>
</template>

<style lang="scss" scoped>
@use "../../assets/css/setting-table.scss";
</style>