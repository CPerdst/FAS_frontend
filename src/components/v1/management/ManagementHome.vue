<template>
  <div class="management-home">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card>
          <div class="stat-card">
            <div class="stat-title">用户总数</div>
            <div class="stat-value">{{ userCount }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div class="stat-card">
            <div class="stat-title">样本总数</div>
            <div class="stat-value">{{ sampleCount }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div class="stat-card">
            <div class="stat-title">报告总数</div>
            <div class="stat-value">{{ reportCount }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import apiClient from '../../../utils/asiox_instance'
import { 
  FETCH_USER_COUNT_URL, FETCH_SAMPLE_COUNT_URL, FETCH_REPORT_COUNT_URL
} from '../../../utils/constant'

const userCount = ref(0)
const sampleCount = ref(0)
const reportCount = ref(0)

async function fetchCounts() {
  try {
    // 获取用户总数
    const userRes = await apiClient(
      FETCH_USER_COUNT_URL,
      {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (userRes.data.code === 0) {
      userCount.value = userRes.data.data
    }

    // 获取样本总数
    const sampleRes = await apiClient(
      FETCH_SAMPLE_COUNT_URL,
      {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (sampleRes.data.code === 0) {
      sampleCount.value = sampleRes.data.data
    }

    // 获取报告总数
    const reportRes = await apiClient(
      FETCH_REPORT_COUNT_URL,
      {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    if (reportRes.data.code === 0) {
      reportCount.value = reportRes.data.data
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

onMounted(() => {
  fetchCounts()
})
</script>

<style scoped>
.management-home {
  padding: 20px;
}
.stat-card {
  text-align: center;
  padding: 20px;
}
.stat-title {
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
}
.stat-value {
  font-size: 24px;
  font-weight: bold;
}
</style>