<script setup>
import {
  ref, reactive, onMounted
} from "vue";
import SampleCountChart from "../components/v1/chart/SampleCountChart.vue";
import {auth_store} from "../stores/auth_store";
import apiClient from "../utils/asiox_instance";
import {FETCH_CHART_DATASET_URL} from "../utils/constant";

const sampleCountChartData = ref([
  { value: 0, name: '未处理', status: 1 },
  { value: 0, name: '处理中', status: 2 },
  { value: 0, name: '安全', status: 3 },
  { value: 0, name: '发现病毒', status: 4 },
  { value: 0, name: '处理失败', status: 5 }
]);

const total = ref(0);

async function getPieDataset() {
  const response = await apiClient(
      FETCH_CHART_DATASET_URL,
      {
        method: 'get',
      }
  );

  const dataset = response.data.data;
  if(dataset.totalCount === 0) {
    sampleCountChartData.value[0].value = 0;
    sampleCountChartData.value[1].value = 0;
    sampleCountChartData.value[2].value = 0;
    sampleCountChartData.value[3].value = 0;
    sampleCountChartData.value[4].value = 0;
  }

  sampleCountChartData.value[0].value = dataset.undisposedCount;
  sampleCountChartData.value[1].value = dataset.disposingCount;
  sampleCountChartData.value[2].value = dataset.safeCount;
  sampleCountChartData.value[3].value = dataset.virusCount;
  sampleCountChartData.value[4].value = dataset.failedCount;

  total.value = sampleCountChartData.value.reduce((sum, item) => sum + item.value, 0);
}

onMounted(() => {
  // 获取样本饼图数据集
  getPieDataset();
});



</script>

<template>
  <div class="main-page-container">
    <SampleCountChart
      :sample-data="sampleCountChartData"
      :total="total"
    ></SampleCountChart>
  </div>
</template>

<style scoped lang="scss">
@use '../assets/css/main.scss';
</style>