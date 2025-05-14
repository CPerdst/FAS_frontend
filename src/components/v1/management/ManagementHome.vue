<template>
  <div class="management-home">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-title">用户总数</div>
              <div class="stat-value">{{ userCount }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon">
              <el-icon><DataAnalysis /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-title">样本总数</div>
              <div class="stat-value">{{ sampleCount }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-title">报告总数</div>
              <div class="stat-value">{{ reportCount }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {
  User,
  DataAnalysis,
  Document
} from '@element-plus/icons-vue';

const userCount = ref(0);
const sampleCount = ref(0);
const reportCount = ref(0);

// TODO: 从API获取统计数据
</script>

<style scoped>
.management-home {
  padding: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
}

.stat-icon {
  font-size: 24px;
  margin-right: 16px;
  color: var(--el-color-primary);
}

.stat-content {
  flex: 1;
}

.stat-title {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin-top: 8px;
}
</style>