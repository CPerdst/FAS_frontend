<script setup>
import VChart from 'vue-echarts';
import {use} from 'echarts/core';
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
  defineProps, onMounted, onUnmounted, ref
} from 'vue';
import {debounce} from 'lodash-es';

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
  data: {
    type: Array,
    required: true,
    default: () => []
  }
});

const dates = computed(() => {
  return props.data.map(item => {
    const [year, month, day] = item.date;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  });
});

const createCounts = computed(() => {
  return props.data.map(item => item.createCount);
});

const updateCounts = computed(() => {
  return props.data.map(item => item.updateCount);
});

const option = computed(() => ({
  title: {
    text: '用户活动统计',
    left: 'center',
    textStyle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333'
    },
    subtext: dates.value.length === 0 ? '暂无数据' : '',
    subtextStyle: {
      fontSize: 14,
      color: '#999',
      padding: [10, 0, 0, 0]
    }
  },
  tooltip: {
    trigger: 'axis',
    formatter: (params) => {
      const date = params[0].axisValue;
      let result = `<div style="font-weight:bold">${date}</div>`;
      
      params.forEach(param => {
        const color = param.color;
        const name = param.seriesName;
        const value = param.value;
        result += `<div style="display:flex;align-items:center;">
          <span style="display:inline-block;width:10px;height:10px;background:${color};border-radius:50%;margin-right:5px;"></span>
          <span>${name}: ${value}</span>
        </div>`;
      });
      
      return result;
    }
  },
  legend: {
    data: ['新增用户', '更新用户'],
    bottom: 0
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '60px',
    top: '60px',
    containLabel: true,
    backgroundColor: props.data.length === 0 ? '#f9f9f9' : '#fff'
  },
  xAxis: {
    type: 'category',
    data: dates.value.length > 0 ? dates.value : ['暂无数据'],
    axisLabel: {
      rotate: 45,
      interval: Math.max(Math.floor(dates.value.length / 10), 0),
      color: props.data.length === 0 ? '#ccc' : '#666'
    },
    axisLine: {
      lineStyle: {
        color: props.data.length === 0 ? '#eee' : '#ccc'
      }
    },
    axisTick: {
      show: props.data.length > 0
    }
  },
  yAxis: {
    type: 'value',
    name: '用户数',
    nameLocation: 'middle',
    nameGap: 30,
    nameTextStyle: {
      color: props.data.length === 0 ? '#ccc' : '#666'
    },
    axisLabel: {
      color: props.data.length === 0 ? '#ccc' : '#666'
    },
    splitLine: {
      lineStyle: {
        type: props.data.length === 0 ? 'dashed' : 'solid',
        color: props.data.length === 0 ? '#eee' : '#f0f0f0'
      }
    }
  },
  graphic: props.data.length === 0 ? [{
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
  series: [
    {
      name: '新增用户',
      type: 'line',
      data: createCounts.value.length > 0 ? createCounts.value : [0],
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: {
        width: 2,
        color: '#5470C6'
      },
      itemStyle: {
        color: '#5470C6'
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
            color: 'rgba(84, 112, 198, 0.5)'
          }, {
            offset: 1,
            color: 'rgba(84, 112, 198, 0.1)'
          }]
        }
      }
    },
    {
      name: '更新用户',
      type: 'line',
      data: updateCounts.value.length > 0 ? updateCounts.value : [0],
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: {
        width: 2,
        color: '#91CC75'
      },
      itemStyle: {
        color: '#91CC75'
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
            color: 'rgba(145, 204, 117, 0.5)'
          }, {
            offset: 1,
            color: 'rgba(145, 204, 117, 0.1)'
          }]
        }
      }
    }
  ]
}));

const selectedDays = ref(30);

const emit = defineEmits([
  'days-change'
]);

const dayOption = [
  {value: 7, label: "最近7天"},
  {value: 30, label: "最近30天"},
  {value: 90, label: "最近90天"},
];

const chartRef = ref(null);

const handleResize = debounce(() => {
  if (chartRef.value && chartRef.value.resize) {
    chartRef.value.resize();
  }
}, 200);

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <div class="user-history-chart-container">
    <el-select
      v-model="selectedDays"
      @change="$emit('days-change', selectedDays)"
    >
      <el-option
        v-for="item in dayOption"
        :value="item.value"
        :label="item.label"
        :key="item.value"
      />
    </el-select>
    <VChart
      class="chart"
      :option="option"
      ref="chartRef"
      autoresize
    />
  </div>
</template>

<style scoped lang="scss">
.user-history-chart-container {
  padding: 0 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin: 20px 0;
  transition: all 0.3s ease;
  height: auto;
  position: relative;

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }

  .el-select {
    position: absolute;
    right: 40px;
    top: 20px;
    z-index: 10;
    width: 180px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);
    }

    // 输入框样式
    :deep(.el-input__wrapper) {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(4px);
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border: 1px solid #ebeef5;
      padding: 8px 15px;
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 2px 12px rgba(84, 112, 198, 0.2);
        border-color: #5470c6;
      }

      &.is-focus {
        box-shadow: 0 2px 12px rgba(84, 112, 198, 0.3) !important;
      }
    }

    // 下拉菜单样式
    :deep(.el-select__dropdown) {
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      margin-top: 8px;

      .el-select-dropdown__item {
        padding: 12px 20px;
        color: #606266;
        transition: all 0.2s ease;

        &.selected {
          color: #5470c6;
          background: rgba(84, 112, 198, 0.06);
        }

        &:hover {
          background: rgba(84, 112, 198, 0.08);
          transform: translateX(4px);
        }

        // 选项标记点
        &::before {
          content: '';
          display: inline-block;
          width: 6px;
          height: 6px;
          background: #5470c6;
          border-radius: 50%;
          margin-right: 12px;
          opacity: 0.6;
          transition: opacity 0.2s;
        }

        &:hover::before {
          opacity: 1;
        }
      }
    }
  }

  .chart {
    width: 100%;
    height: 400px;
    border-radius: 10px;
    padding: 20px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style> 