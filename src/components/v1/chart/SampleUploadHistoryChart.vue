<script setup>
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import {
  SVGRenderer
} from 'echarts/renderers';
import {
  LineChart
} from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
    GraphicComponent
} from 'echarts/components';
import {
  computed,
  defineProps, onMounted, watch, toRef
} from 'vue';

use([
  SVGRenderer,
  LineChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  GraphicComponent
]);

const props = defineProps({
  dates: {
    type: Array,
    required: true,
    default: []
  },
  counts: {
    type: Array,
    required: true,
    default: []
  }
});

const option = computed(() => ({
  title: {
    text: '用户样本提交历史',
    left: 'center',
    textStyle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333'
    },
    subtext: props.counts.length === 0 ? '暂无提交记录' : '',
    subtextStyle: {
      fontSize: 14,
      color: '#999',
      padding: [10, 0, 0, 0]
    }
  },
  tooltip: {
    trigger: 'axis',
    formatter: props.counts.length === 0 ?
        '<div style="color:#999;padding:10px;text-align:center;">暂无数据</div>' :
        (params) => {
          const date = params[0].axisValue;
          const count = params[0].data;
          return `
          <div style="font-weight:bold">${date}</div>
          <div>提交样本数: ${count}</div>
        `;
        }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
    backgroundColor: props.counts.length === 0 ? '#f9f9f9' : '#fff'
  },
  xAxis: {
    type: 'category',
    data: props.dates.length > 0 ? props.dates : ['周一', '周二', '周三', '周四', '周五'],
    axisLabel: {
      rotate: 30,
      interval: Math.floor(props.dates.length / 7),
      color: props.counts.length === 0 ? '#ccc' : '#666'
    },
    axisLine: {
      lineStyle: {
        color: props.counts.length === 0 ? '#eee' : '#ccc'
      }
    },
    axisTick: {
      show: props.counts.length > 0
    }
  },
  yAxis: {
    type: 'value',
    name: '样本数',
    nameLocation: 'middle',
    nameGap: 30,
    nameTextStyle: {
      color: props.counts.length === 0 ? '#ccc' : '#666'
    },
    axisLabel: {
      color: props.counts.length === 0 ? '#ccc' : '#666'
    },
    splitLine: {
      lineStyle: {
        type: props.counts.length === 0 ? 'dashed' : 'solid',
        color: props.counts.length === 0 ? '#eee' : '#f0f0f0'
      }
    }
  },
  graphic: props.counts.length === 0 ? [{
    type: 'text',
    left: 'center',
    top: '45%',
    style: {
      text: '暂无数据',
      fill: '#ccc',
      fontSize: 16,
      fontWeight: 'normal'
    }
  }] : [],
  series: [{
    name: '样本提交数',
    type: 'line',
    data: props.counts.length > 0 ? props.counts : [0, 0, 0, 0, 0],
    smooth: true,
    symbol: 'circle',
    symbolSize: 8,
    lineStyle: {
      width: 2,
      opacity: props.counts.length > 0 ? 1 : 0.3,
      color: props.counts.length > 0 ? '#5470C6' : '#ccc'
    },
    itemStyle: {
      color: '#5470C6',
      opacity: props.counts.length > 0 ? 1 : 0
    },
    areaStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
          offset: 0,
          color: props.counts.length > 0 ? 'rgba(84, 112, 198, 0.5)' : 'rgba(200, 200, 200, 0.1)'
        }, {
          offset: 1,
          color: props.counts.length > 0 ? 'rgba(84, 112, 198, 0.1)' : 'rgba(200, 200, 200, 0.01)'
        }]
      }
    },
    markArea: props.counts.length === 0 ? {
      silent: true,
      itemStyle: {
        color: 'rgba(238, 238, 238, 0.3)'
      },
      data: [[
        { coord: ['0%', '0%'] },
        { coord: ['100%', '100%'] }
      ]]
    } : null
  }]
}));
</script>

<template>
  <div class="sample-count-line-chart-container">
    <VChart class="chart" :option="option" />
  </div>
</template>

<style scoped lang="scss">
@use '../../../assets/css/sample-upload-history-chart.scss';
</style>