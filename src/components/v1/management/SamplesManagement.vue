<script setup>
import {
  computed,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  h
} from "vue";

import {
  Delete,
  UploadFilled,
  Upload,
  Document,
  Download,
  ArrowDown,
  ArrowUp
} from "@element-plus/icons-vue";

import {
  addPropsToJsonPanel,
  getDateByArrayTimeFormat,
  getFormatedDate,
  getKBFormatedSize,
  getStatusName,
} from "../../../utils/common_utils";

import {
  FETCH_ADMIN_SAMPLE_URL,
  DELETE_SAMPLE_URL,
  SAMPLE_UPLOAD_URL,
  FETCH_SAMPLE_REPORT_URL,
  MAX_SAMPLE_SIZE
} from "../../../utils/constant";

import apiClient from "../../../utils/asiox_instance";
import { ElMessageBox, ElNotification, ElMessage, ElButton } from "element-plus";
import VuePdfApp from "vue3-pdf-app";

const samplesManagementData = reactive({
  sampleList: [],
  loading: false,
  pagination: {
    pageNum: 1,
    pageSize: 10,
    total: 0
  },
  intervalId: null,
  fileList: [],
  uploadQueue: [],
  isUploading: false,
  // 报告相关
  sampleReports: new Map(), // 用于存储样本ID与其报告的映射
  reportLoading: new Map(), // 用于标记哪些报告正在加载
  reportCollapsed: new Map(), // 用于标记报告的折叠状态
  currentExpandedSampleId: null, // 当前展开的样本ID，用于控制同时只能展开一个
  expandedRows: [], // 当前展开的行，通过表格引用控制
});

// 上传相关引用
const uploadRef = ref(null);

// 上传对话框相关
const uploadDialogVisible = ref(false);

// 表格列配置选项
const columnOptions = ref([
  { label: '样本ID', value: 'id', show: true },
  { label: '用户信息', value: 'user', show: true },
  { label: 'MD5', value: 'hash', show: true },
  { label: '处理状态', value: 'status', show: true },
  { label: '文件名', value: 'name', show: false },
  { label: '文件大小', value: 'size', show: false },
  { label: '上传时间', value: 'date', show: false }
]);

// 排序选项
const sortOptions = ref([
  { label: '按上传时间升序', value: 'createTime,asc' },
  { label: '按上传时间降序', value: 'createTime,desc' },
  { label: '按文件大小升序', value: 'fileSize,asc' },
  { label: '按文件大小降序', value: 'fileSize,desc' }
]);
const sortValue = ref('createTime,desc');

// 添加表格引用
const tableRef = ref(null);

/**
 * 获取样本列表
 * @returns {Promise<void>}
 */
async function fetchSampleList() {
  samplesManagementData.loading = true;
  const response = await apiClient.get(FETCH_ADMIN_SAMPLE_URL, {
    params: {
      pageNum: samplesManagementData.pagination.pageNum,
      pageSize: samplesManagementData.pagination.pageSize
    }
  });

  if(response.data?.data?.list) {
    samplesManagementData.sampleList = response.data.data.list.map(item => ({
      id: item.id,
      name: item.filename,
      size: getKBFormatedSize(item.fileSize),
      status: getStatusName(item.disposeStatus),
      date: getFormatedDate(getDateByArrayTimeFormat(item.createTime)),
      hash: item.fileMd5,
      user: {
        username: item.username || '未知用户',
        avatar: item.avatar || ''
      },
      // 样本的原始数据，用于展开行
      rawData: item
    }));
    samplesManagementData.pagination.total = response.data.data.total;
  }

  samplesManagementData.loading = false;
}

/**
 * 获取样本报告
 * @param {number} sampleId 样本ID
 * @returns {Promise<void>}
 */
async function fetchSampleReport(sampleId) {
  // 设置加载状态，但允许重新加载
  samplesManagementData.reportLoading.set(sampleId, true);
  
  try {
    const response = await apiClient.get(FETCH_SAMPLE_REPORT_URL, {
      params: {
        sampleId: sampleId
      }
    });
    
    if (response.data?.data?.list && response.data.data.list.length > 0) {
      // 找到与样本匹配的报告（根据样本MD5匹配）
      const sample = samplesManagementData.sampleList.find(sample => sample.id === sampleId);
      if (!sample) {
        console.error('未找到对应的样本:', sampleId);
        samplesManagementData.sampleReports.set(sampleId, {
          hasReport: false,
          error: '未找到对应的样本'
        });
        return;
      }
      
      // 根据样本的哈希值查找匹配的报告
      const report = response.data.data.list.find(report => report.fileMd5 === sample.hash);
      
      if (report) {
        console.log('找到报告:', report);
        // 确保pdfPath有效
        if (!report.pdfPath) {
          console.error('报告PDF路径无效:', report);
          samplesManagementData.sampleReports.set(sampleId, {
            hasReport: false,
            error: '报告PDF路径无效'
          });
          return;
        }
        
        samplesManagementData.sampleReports.set(sampleId, {
          id: report.id,
          fileMd5: report.fileMd5,
          pdfPath: report.pdfPath,
          pdfSize: getKBFormatedSize(report.pdfSize),
          pdfCreateTime: getFormatedDate(getDateByArrayTimeFormat(report.pdfCreateTime)),
          hasReport: true
        });
        
        console.log('设置报告成功:', samplesManagementData.sampleReports.get(sampleId));
      } else {
        // 样本没有对应的报告
        console.log('未找到对应的报告, 样本hash:', sample.hash);
        samplesManagementData.sampleReports.set(sampleId, {
          hasReport: false,
          error: '未找到对应的报告'
        });
      }
    } else {
      // 没有任何报告
      console.log('API返回的报告列表为空');
      samplesManagementData.sampleReports.set(sampleId, {
        hasReport: false,
        error: '报告列表为空'
      });
    }
  } catch (error) {
    console.error('获取报告失败:', error);
    samplesManagementData.sampleReports.set(sampleId, {
      hasReport: false,
      error: '获取报告失败: ' + (error.message || '未知错误')
    });
  } finally {
    samplesManagementData.reportLoading.set(sampleId, false);
  }
}

/**
 * 下载报告
 * @param {Object} report 报告对象
 */
function downloadReport(report) {
  if (!report || !report.pdfPath) return;
  
  const a = document.createElement('a');
  a.href = report.pdfPath;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.download = `报告_${report.fileMd5}.pdf`;
  a.click();
}

/**
 * 处理页码大小变更
 * @param newSize
 */
function handleSizeChange(newSize) {
  samplesManagementData.pagination.pageSize = newSize;
  samplesManagementData.pagination.pageNum = 1; // 重置页码
  fetchSampleList();
}

/**
 * 处理页码变更
 */
function handleCurrentChange() {
  fetchSampleList();
}

/**
 * 删除样本
 * @param sampleId
 */
async function deleteSample(sampleId) {
  try {
    await ElMessageBox.confirm('此操作将永久删除该样本, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    
    await apiClient.delete(DELETE_SAMPLE_URL + '/' + sampleId);
    
    ElNotification({
      title: '成功',
      message: '样本删除成功',
      type: 'success',
      duration: 2000
    });
    
    // 重新获取列表
    fetchSampleList();
  } catch (error) {
    if (error !== 'cancel') {
      ElNotification({
        title: '失败',
        message: '样本删除失败: ' + (error.response?.data?.message || error.message || '未知错误'),
        type: 'error',
        duration: 3000
      });
    }
  }
}

/**
 * 切换报告折叠状态
 * @param {number} sampleId 样本ID
 */
function toggleReportCollapse(sampleId) {
  console.log('切换折叠状态, 当前状态:', samplesManagementData.reportCollapsed.get(sampleId));
  
  // 检查当前折叠状态
  const currentState = samplesManagementData.reportCollapsed.get(sampleId) !== false;
  
  // 如果是要展开操作，先关闭其他已展开的报告
  if (currentState) { // currentState为true表示当前是折叠的，要展开
    // 如果当前有其他样本的报告是展开的，先将其折叠
    if (samplesManagementData.currentExpandedSampleId !== null && 
        samplesManagementData.currentExpandedSampleId !== sampleId) {
      console.log('关闭其他展开的报告:', samplesManagementData.currentExpandedSampleId);
      samplesManagementData.reportCollapsed.set(samplesManagementData.currentExpandedSampleId, true);
    }
    
    // 更新当前展开的样本ID
    samplesManagementData.currentExpandedSampleId = sampleId;
  } else {
    // 如果是折叠操作，清除当前展开的样本ID
    if (samplesManagementData.currentExpandedSampleId === sampleId) {
      samplesManagementData.currentExpandedSampleId = null;
    }
  }
  
  // 更新折叠状态
  samplesManagementData.reportCollapsed.set(sampleId, !currentState);
  
  console.log('更新后的折叠状态:', !currentState);
  
  // 如果是展开操作，则获取报告
  if (currentState) { // 注意这里是反向的，currentState为true表示当前是折叠的，要展开
    console.log('展开报告，获取报告数据, sampleId:', sampleId);
    // 无论是否已有缓存数据，都重新获取报告
    setTimeout(() => {
      fetchSampleReport(sampleId);
    }, 0);
  }
}

/**
 * 展开行切换事件，用于控制只能展开一行
 * @param {Object} row 行数据
 * @param {Array} expandedRows 展开的行
 */
function handleExpandChange(row, expandedRows) {
  console.log('行展开状态变化:', row.id, expandedRows.includes(row));
  
  if (expandedRows.includes(row)) {
    // 如果是展开操作，关闭其他所有行
    if (tableRef.value) {
      // 遍历所有数据，关闭除了当前行以外的所有行
      samplesManagementData.sampleList.forEach(item => {
        if (item.id !== row.id && tableRef.value.toggleRowExpansion) {
          // 关闭其他行
          tableRef.value.toggleRowExpansion(item, false);
        }
      });
    }
    
    // 初始化报告折叠状态为折叠
    if (!samplesManagementData.reportCollapsed.has(row.id)) {
      console.log('初始化折叠状态为折叠:', row.id);
      samplesManagementData.reportCollapsed.set(row.id, true);
    }
    
    // 更新当前展开的样本ID
    samplesManagementData.currentExpandedSampleId = row.id;
  } else {
    // 如果行被折叠，同时折叠其报告
    samplesManagementData.reportCollapsed.set(row.id, true);
    
    // 如果当前展开的样本ID是这个行，则清除
    if (samplesManagementData.currentExpandedSampleId === row.id) {
      samplesManagementData.currentExpandedSampleId = null;
    }
  }
}

/* 上传功能相关方法 */
function beforeUpload(rawFile) {
  if (rawFile.size > MAX_SAMPLE_SIZE) {
    ElMessage.error(`文件大小超过${MAX_SAMPLE_SIZE / 1024 / 1024}MB限制`);
    return false;
  }
  return true;
}

function handleUploadSuccess(res, file) {
  // 上传成功后刷新列表
  fetchSampleList();
  
  ElNotification({
    title: '成功',
    message: '样本上传成功',
    type: 'success',
    duration: 2000
  });
}

function handleUploadError(error) {
  ElNotification({
    title: '失败',
    message: '样本上传失败: ' + (error.message || '未知错误'),
    type: 'error',
    duration: 3000
  });
}

function handleRemove(file, fileList) {
  samplesManagementData.fileList = fileList;
}

function handleChange(file, fileList) {
  samplesManagementData.fileList = fileList;
}

function handleExceed() {
  ElNotification({
    title: '文件数量超出限制',
    message: '文件数量超出限制',
    type: 'error',
    duration: 2000,
    showClose: false
  });
}

async function processUploadQueue() {
  if (samplesManagementData.isUploading || samplesManagementData.uploadQueue.length === 0) return;

  samplesManagementData.isUploading = true;
  const currentOptions = samplesManagementData.uploadQueue.shift();

  try {
    const formData = new FormData();
    formData.append('file', currentOptions.file);

    const res = await apiClient.post(
      SAMPLE_UPLOAD_URL,
      formData,
      {
        onUploadProgress: e => {
          const percent = Math.round((e.loaded * 100) / e.total);
          currentOptions.onProgress({ percent });
        }
      }
    );

    currentOptions.onSuccess(res.data);
  } catch (err) {
    currentOptions.onError(err);
    console.error('上传失败:', err);
  } finally {
    samplesManagementData.isUploading = false;
    await processUploadQueue();
  }
}

async function handleHttpRequest(options) {
  samplesManagementData.uploadQueue.push(options);
  await processUploadQueue();
}

function formatSize(size) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

// 显示上传对话框
function showUploadDialog() {
  uploadDialogVisible.value = true;
}

// 处理列显示变化
function handleColumnChange() {
  // 这里不需要重新获取数据，只是改变显示列
}

// 提交上传
function submitUpload() {
  // if (!uploadRef.value || !uploadRef.value.uploadFiles || uploadRef.value.uploadFiles.length === 0) {
  //   ElMessage.warning('请选择需要上传的文件');
  //   return;
  // }
  samplesManagementData.fileList.forEach(file => {
    if (file.status !== 'success') {
      file.status = 'ready';
    }
  });
  
  uploadRef.value?.submit();
  uploadDialogVisible.value = false;
}

onMounted(() => {
  // 获取样本列表
  fetchSampleList();

  // 添加数据到json面板
  addPropsToJsonPanel('samplesManagementData', computed(() => samplesManagementData));

  // 设置定时每10秒执行一次fetch
  samplesManagementData.intervalId = setInterval(() => {
    fetchSampleList();
  }, 10000);
  
  // 添加Vue3-pdf-app加载完成的日志
  console.log('SamplesManagement组件已挂载，VuePdfApp已导入:', VuePdfApp);
});

onUnmounted(() => {
  // 移除定时器
  clearInterval(samplesManagementData.intervalId);
});
</script>

<template>
  <div class="management-samples">
    <el-card>
      <div class="header">
        <el-button type="primary" @click="showUploadDialog">
          <el-icon class="mr-1"><upload /></el-icon>上传样本
        </el-button>
        <div class="right-controls">
          <el-select
            v-model="sortValue"
            @change="fetchSampleList"
            placeholder="请选择排序方式"
            style="margin-right: 10px; width: 150px;">
            <el-option
              v-for="item in sortOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select
            v-model="columnOptions"
            multiple
            collapse-tags
            placeholder="选择显示列"
            style="width: 150px;"
            @change="handleColumnChange">
            <el-option
              v-for="item in columnOptions"
              :key="item.value"
              :label="item.label"
              :value="item">
            </el-option>
          </el-select>
        </div>
      </div>
      
      <el-table
        v-loading="samplesManagementData.loading"
        :data="samplesManagementData.sampleList"
        border
        style="width: 100%"
        :row-key="row => row.id"
        @expand-change="handleExpandChange"
        ref="tableRef"
      >
        <!-- 展开行列 -->
        <el-table-column type="expand">
          <template #default="props">
            <div class="sample-detail">
              <!-- 样本详细信息 -->
              <el-descriptions title="样本详细信息" :column="2" border>
                <el-descriptions-item label="样本ID">{{ props.row.id }}</el-descriptions-item>
                <el-descriptions-item label="文件名">{{ props.row.name }}</el-descriptions-item>
                <el-descriptions-item label="文件大小">{{ props.row.size }}</el-descriptions-item>
                <el-descriptions-item label="上传时间">{{ props.row.date }}</el-descriptions-item>
                <el-descriptions-item label="MD5" :span="2">{{ props.row.hash }}</el-descriptions-item>
                <el-descriptions-item label="处理状态">
                  <el-tag :type="props.row.status.color">{{ props.row.status.name }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="上传用户">{{ props.row.user.username }}</el-descriptions-item>
                <el-descriptions-item v-if="props.row.rawData.description" label="描述" :span="2">
                  {{ props.row.rawData.description || '无描述' }}
                </el-descriptions-item>
              </el-descriptions>
              
              <!-- 报告区域 -->
              <div class="report-section">
                <div class="report-header" @click="toggleReportCollapse(props.row.id)">
                  <h3 class="report-title">
                    样本报告
                    <el-button 
                      v-if="samplesManagementData.sampleReports.get(props.row.id)?.hasReport && 
                            !samplesManagementData.reportCollapsed.get(props.row.id)"
                      type="primary" 
                      size="small" 
                      @click.stop="downloadReport(samplesManagementData.sampleReports.get(props.row.id))"
                      style="margin-left: 10px;">
                      <el-icon><download /></el-icon>
                      下载报告
                    </el-button>
                  </h3>
                  <el-icon class="collapse-icon">
                    <arrow-down v-if="samplesManagementData.reportCollapsed.get(props.row.id)" />
                    <arrow-up v-else />
                  </el-icon>
                </div>
                
                <!-- 折叠内容 -->
                <div v-show="!samplesManagementData.reportCollapsed.get(props.row.id)" class="report-content">
                  <!-- 报告加载中 -->
                  <div v-if="samplesManagementData.reportLoading.get(props.row.id)" class="report-loading">
                    <el-skeleton style="width: 100%" animated>
                      <template #template>
                        <el-skeleton-item variant="p" style="width: 100%; height: 400px;" />
                      </template>
                    </el-skeleton>
                  </div>
                  
                  <!-- 报告内容 -->
                  <div v-else-if="samplesManagementData.sampleReports.get(props.row.id)?.hasReport" class="pdf-container">
                    <div v-if="!samplesManagementData.sampleReports.get(props.row.id)?.pdfPath" class="no-report">
                      <el-empty description="报告路径无效" />
                    </div>
                    <template v-else>
                      <vue-pdf-app 
                        class="pdf-box" 
                        :pdf="samplesManagementData.sampleReports.get(props.row.id)?.pdfPath"
                        :key="'pdf-' + props.row.id + '-' + (!samplesManagementData.reportCollapsed.get(props.row.id))"
                      />
                      <div class="report-info">
                        <div>报告大小: {{ samplesManagementData.sampleReports.get(props.row.id)?.pdfSize }}</div>
                        <div>生成时间: {{ samplesManagementData.sampleReports.get(props.row.id)?.pdfCreateTime }}</div>
                      </div>
                    </template>
                  </div>
                  
                  <!-- 无报告 -->
                  <div v-else class="no-report">
                    <el-empty :description="samplesManagementData.sampleReports.get(props.row.id)?.error || '暂无报告'" />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        
        <!-- 动态生成的列 -->
        <template v-for="col in columnOptions.filter(c => c.show)" :key="col.value">
          <!-- 样本ID列 -->
          <el-table-column v-if="col.value === 'id'" prop="id" label="样本ID" width="80" align="center" />
          
          <!-- 用户信息列 -->
          <el-table-column v-else-if="col.value === 'user'" label="用户信息" width="150">
            <template #default="scope">
              <div class="user-info">
                <el-avatar 
                  :size="32" 
                  :src="scope.row.user.avatar" 
                  fit="cover"
                ></el-avatar>
                <span class="username">{{ scope.row.user.username }}</span>
              </div>
            </template>
          </el-table-column>
          
          <!-- MD5列 -->
          <el-table-column v-else-if="col.value === 'hash'" prop="hash" label="MD5" show-overflow-tooltip />
          
          <!-- 状态列 -->
          <el-table-column v-else-if="col.value === 'status'" label="处理状态" width="120" align="center">
            <template #default="scope">
              <el-tag :type="scope.row.status.color">{{ scope.row.status.name }}</el-tag>
            </template>
          </el-table-column>
          
          <!-- 其他通用列 -->
          <el-table-column v-else :prop="col.value" :label="col.label" show-overflow-tooltip />
        </template>
        
        <!-- 操作列 -->
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="scope">
            <el-button 
              type="danger" 
              :icon="Delete" 
              circle 
              size="small"
              @click="deleteSample(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页器 -->
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 50, 100]"
        :total="samplesManagementData.pagination.total"
        v-model:current-page="samplesManagementData.pagination.pageNum"
        v-model:page-size="samplesManagementData.pagination.pageSize"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        class="pagination"
      />
    </el-card>
    
    <!-- 上传对话框 -->
    <el-dialog
      v-model="uploadDialogVisible"
      title="上传样本"
      width="50%"
    >
      <el-form class="upload-form">
        <el-upload
          class="upload-demo"
          drag
          multiple
          ref="uploadRef"
          :http-request="handleHttpRequest"
          :auto-upload="false"
          :before-upload="beforeUpload"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :on-remove="handleRemove"
          :on-change="handleChange"
          :on-exceed="handleExceed"
          :limit="10"
          :file-list="samplesManagementData.fileList"
        >
          <template #trigger>
            <div class="upload-area">
              <el-icon :size="60" class="upload-icon"><upload-filled /></el-icon>
              <div class="upload-text">
                <p class="main-text">点击或将文件拖入此区域</p>
                <p class="sub-text">支持所有格式文件，单文件不超过20MB</p>
              </div>
            </div>
          </template>

          <template #file="{ file }">
            <div class="file-item">
              <span class="file-name" style="margin-right: 10px">{{ file.name }}</span>
              <span class="file-size">{{ formatSize(file.size) }}</span>
              <el-progress
                  v-if="file.status === 'uploading'"
                  :percentage="file.percentage"
                  :stroke-width="16"
                  :show-text="false"
              />
            </div>
          </template>
        </el-upload>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="uploadDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitUpload">
            <el-icon class="mr-1"><upload /></el-icon>提交
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.management-samples {
  padding: 20px;
  
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    
    .right-controls {
      display: flex;
    }
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .username {
      font-size: 14px;
    }
  }
  
  .sample-detail {
    padding: 20px;
    
    .report-section {
      margin-top: 20px;
      border-top: 1px solid #ebeef5;
      padding-top: 10px;
      
      .report-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        background-color: #f5f7fa;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s;
        
        &:hover {
          background-color: #edf2fc;
        }
        
        .report-title {
          font-size: 16px;
          font-weight: bold;
          margin: 0;
          display: flex;
          align-items: center;
        }
        
        .collapse-icon {
          font-size: 16px;
          color: #909399;
        }
      }
      
      .report-content {
        margin-top: 10px;
      }
      
      .pdf-container {
        width: 100%;
        border: 1px solid #ebeef5;
        border-radius: 4px;
        overflow: hidden;
        
        .pdf-box {
          width: 100%;
          height: 600px;
        }
        
        .report-info {
          background-color: #f5f7fa;
          padding: 10px;
          font-size: 12px;
          color: #606266;
          display: flex;
          justify-content: space-between;
        }
      }
      
      .no-report {
        padding: 40px 0;
        background-color: #f5f7fa;
        border-radius: 4px;
      }
      
      .report-loading {
        padding: 20px;
        background-color: #f5f7fa;
        border-radius: 4px;
        position: relative;
        min-height: 200px;
        
        &::after {
          content: '加载中...';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #909399;
          font-size: 16px;
        }
      }
    }
  }
  
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
  
  .upload-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    
    .upload-icon {
      margin-bottom: 10px;
      color: #409eff;
    }
    
    .upload-text {
      text-align: center;
      
      .main-text {
        font-size: 16px;
        margin-bottom: 8px;
      }
      
      .sub-text {
        font-size: 12px;
        color: #909399;
      }
    }
  }
  
  .file-item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    
    .file-name {
      flex: 1;
    }
    
    .file-size {
      color: #909399;
      font-size: 12px;
      margin-right: 10px;
    }
  }
}
</style>