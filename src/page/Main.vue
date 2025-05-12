<script setup>
import {
  ref, reactive, onMounted
} from "vue";
import SampleCountChart from "../components/v1/chart/SampleCountChart.vue";
import {auth_store} from "../stores/auth_store";
import apiClient from "../utils/asiox_instance";
import {FETCH_CHART_DATASET_URL, FETCH_CHART_LINE_DATASET_URL} from "../utils/constant";
import SampleUploadHistoryChart from "../components/v1/chart/SampleUploadHistoryChart.vue";

const sampleCountChartData = ref([
  { value: 0, name: '未处理', status: 1 },
  { value: 0, name: '处理中', status: 2 },
  { value: 0, name: '安全', status: 3 },
  { value: 0, name: '发现病毒', status: 4 },
  { value: 0, name: '处理失败', status: 5 }
]);

const total = ref(0);

const date = ref([]);

const counts = ref([]);

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

async function getLineDataset(days) {
  const response = await apiClient(
      FETCH_CHART_LINE_DATASET_URL,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          days: days
        },
        method: 'get',
      }
  );

  date.value = response.data.data.map(item => {
    const [year, month, day] = item.date;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  });

  counts.value = response.data.data.map(item => {
    return item.total;
  });
}

function onDaysChange(curDays) {
  console.log(curDays);
  getLineDataset(curDays);
}

onMounted(() => {
  // 获取样本饼图数据集
  getPieDataset();

  // 获取样本折线图数据
  getLineDataset(30);
});

</script>

<template>
  <div class="main-page-container">
    <SampleCountChart
        class="main-page-sample-count-chart"
        :sample-data="sampleCountChartData"
        :total="total"
    ></SampleCountChart>

    <SampleUploadHistoryChart
        class="main-page-sample-upload-history-chart"
        :dates="date"
        :counts="counts"
        @days-change="onDaysChange"
    ></SampleUploadHistoryChart>
  </div>
</template>

<style scoped lang="scss">
@use '../assets/css/main.scss';
</style>