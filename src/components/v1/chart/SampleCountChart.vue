<script setup>
import VChart from 'vue-echarts';
import { use } from 'echarts/core';

import {
  CanvasRenderer, SVGRenderer
} from 'echarts/renderers';
import {
  BarChart, LineChart, PieChart
} from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent
} from 'echarts/components';

import {
  computed,
  reactive,
  ref,
  defineProps, onMounted, watch, toRef
} from 'vue';
import {ElMessage} from "element-plus";

use([
  SVGRenderer,
  PieChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent
]);

const sampleCountChartProps = defineProps({
  sampleData: {
    type: Array,
    required: true,
    default: []
  },
  total: {
    type: Number,
    required: true,
    default: 0
  }
});

const totalProp = toRef(sampleCountChartProps, 'total');

const colorMap = {
  1: '#9E9E9E', // 未处理 - 灰色
  2: '#2196F3', // 处理中 - 蓝色
  3: '#4CAF50', // 安全 - 绿色
  4: '#F44336', // 发现病毒 - 红色
  5: '#FF9800'  // 处理失败 - 橙色
};

const sampleCountChartData = reactive({
  option: {
    title: {
      text: totalProp,
      subtext: '总样本数',
      left: '50%',  // 关键修改：水平居中
      top: '47%',   // 关键修改：垂直居中
      textAlign: 'center',  // 文本对齐方式
      textVerticalAlign: 'middle',  // 文本垂直对齐
      textStyle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#333'
      },
      subtextStyle: {
        fontSize: 14,
        color: '#666'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        return `
        <div style="font-weight:bold">${params.name}</div>
        <div>数量: ${params.value}</div>
        <div>占比: ${params.percent}%</div>
        <div>总数: ${totalProp}</div>
      `;
      }
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'middle',
      data: sampleCountChartProps.sampleData.map(item => item.name)
    },
    series: [{
      name: '样本状态',
      type: 'pie',
      radius: ['50%', '75%'],
      center: ['50%', '50%'],  // 确保饼图居中
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 5,
        borderColor: '#fff',
        borderWidth: 2,
        color: (params) => colorMap[sampleCountChartProps.sampleData[params.dataIndex].status]
      },
      label: {
        show: true,
        formatter: '{b}: {c} ({d}%)',
        fontSize: 12
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '14',
          fontWeight: 'bold'
        },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      labelLine: {
        show: false
      },
      data: sampleCountChartProps.sampleData
    }]
  }
});

</script>

<template>
  <div class="sample-count-chart-container">
    <VChart class="chart" :option="sampleCountChartData.option"/>
  </div>
</template>

<style scoped lang="scss">
@use '../../../assets/css/sample-count-chart.scss';
</style>