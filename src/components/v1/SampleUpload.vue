<script setup>

import {
  computed,
  onMounted, onUnmounted,
  reactive, ref
} from "vue";

import {
  UploadFilled, Upload, Timer
} from "@element-plus/icons-vue";
import {
  addPropsToJsonPanel, checkDateType,
  getFormatedDate,
  getKBFormatedSize,
  getStatusName,
  getTimeBuArrayTimeFormat
} from "../../utils/common_utils";
import {
  FETCH_SAMPLE_URL,
  MAX_SAMPLE_SIZE,
  SAMPLE_UPLOAD_FORM_PROPS,
  SAMPLE_UPLOAD_URL,
  TABLE_SHOWN_COLUMNS
} from "../../utils/constant";
import apiClient from "../../utils/asiox_instance";
import {ElNotification} from "element-plus";

const sampleUploadData = reactive({
  fileList: [],
  uploadedFiles: [],
  uploadQueue: [],
  isUploading: false,
  sampleList: [], // 替换原来的uploadedFiles
  loading: false,
  pagination: {
    pageNum: 1,
    pageSize: 10,
    total: 0
  },
  intervalId: null
});

function beforeUpload(rawFile) {
  if (rawFile.size > MAX_SAMPLE_SIZE) {
    this.$message.error(`文件大小超过${MAX_SAMPLE_SIZE}MB限制`)
    return false
  }
  return true
}

function handleSuccess(res, file) {
  // 上传成功后刷新列表
  fetchSampleList();

  // 保留本地记录（可选）
  sampleUploadData.uploadedFiles.unshift({
    name: file.name,
    size: file.size,
    uploadTime: new Date().toLocaleString(),
  });
}

function handleRemove(file, fileList) {
  sampleUploadData.fileList = fileList
}

function handleChange() {

}

function handlePreview() {

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
  if (sampleUploadData.isUploading || sampleUploadData.uploadQueue.length === 0) return;

  sampleUploadData.isUploading = true;
  const currentOptions = sampleUploadData.uploadQueue.shift();

  try {
    const UPDATE_SAMPLE_URL = SAMPLE_UPLOAD_URL;
    const formData = new FormData();
    formData.append('file', currentOptions.file);

    const res = await apiClient.post(
        UPDATE_SAMPLE_URL,
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
    sampleUploadData.isUploading = false;
    await processUploadQueue();
  }
}

async function handleHttpRequest(options) {
  sampleUploadData.uploadQueue.push(options);
  await processUploadQueue();
}

function formatSize(size) {
  const units = ['B', 'KB', 'MB', 'GB']
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  return `${size.toFixed(2)} ${units[unitIndex]}`
}

function submitUpload() {
  sampleUploadData.fileList.forEach(file => {
    if (file.status !== 'success') {
      file.status = 'ready';
    }
  });
  uploadRef.value?.submit();
}

SAMPLE_UPLOAD_FORM_PROPS.limit = 10;
SAMPLE_UPLOAD_FORM_PROPS["auto-upload"] = false;
SAMPLE_UPLOAD_FORM_PROPS['on-change']= handleChange;
SAMPLE_UPLOAD_FORM_PROPS['on-success'] = handleSuccess;
SAMPLE_UPLOAD_FORM_PROPS['on-remove']= handleRemove;
SAMPLE_UPLOAD_FORM_PROPS['on-preview'] = handlePreview;
SAMPLE_UPLOAD_FORM_PROPS['on-exceed']= handleExceed;
SAMPLE_UPLOAD_FORM_PROPS['http-request'] = handleHttpRequest;
SAMPLE_UPLOAD_FORM_PROPS['before-upload'] = beforeUpload;

const uploadRef = ref(null);

/**
 * 异步更新样本提交历史记录
 * @returns {Promise<void>}
 */
async function fetchSampleList() {
  sampleUploadData.loading = true;
  const response = await apiClient.get(FETCH_SAMPLE_URL, {
    params: {
      pageNum: sampleUploadData.pagination.pageNum,
      pageSize: sampleUploadData.pagination.pageSize
    }
  });

  if(response.data?.data?.list) {
    sampleUploadData.sampleList = response.data.data.list.map(item => ({
      id: item.id,
      name: item.filename,
      size: getKBFormatedSize(item.fileSize),
      status: getStatusName(item.disposeStatus),
      date: getFormatedDate(getTimeBuArrayTimeFormat(item.createTime)),
      hash: item.fileMd5
    }));
    sampleUploadData.pagination.total = response.data.data.total;
  }

  console.log(sampleUploadData.sampleList.length)

  sampleUploadData.loading = false;
}

function handleSizeChange(newSize) {
  sampleUploadData.pagination.pageSize = newSize;
  sampleUploadData.pagination.pageNum = 1; // 必须重置页码
  fetchSampleList();
}

onMounted(() => {
  // 获取样本提交历史记录
  fetchSampleList()

  // 添加样本上传数据到json面板
  addPropsToJsonPanel('sampleUploadData', computed(() => sampleUploadData));

  // 设置定时每5秒执行一次fetch, 进行比对替换
  sampleUploadData.intervalId = setInterval(() => {
    // 获取样本提交历史记录
    fetchSampleList()
  }, 5000);
});

onUnmounted(() => {
  // 移除定时器
  clearInterval(sampleUploadData.intervalId);
});

</script>

<template>
  <div class="enhanced-upload">
    <el-card shadow="hover" class="upload-card">
      <el-form class="upload-form">
        <el-upload
          class="upload-demo"
          drag
          multiple
          v-bind="SAMPLE_UPLOAD_FORM_PROPS"
          ref="uploadRef"
        >
          <template #trigger>
            <div class="upload-area">
              <el-icon :size="60" class="upload-icon"><upload-filled /></el-icon>
              <div class="upload-text">
                <p class="main-text">点击或将文件拖入此区域</p>
                <p class="sub-text">支持所有格式文件，单文件不超过50MB</p>
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
        <el-button class="submit-button" type="primary" @click="submitUpload"><el-icon class="mr-1"><upload /></el-icon>提交</el-button>
      </el-form>
    </el-card>

    <el-card>
      <div class="table-header">
        <el-select>
          <el-option
              v-for="item in sampleUploadData.sampleList"
              :key="item.name"
              :label="item.name"
              :value="item.name"
          >
            <template #default>
              <div class="option-container">
                <span class="option-name">{{ item.name }}</span>
                <span class="option-size">{{ item.size }}</span>
                <span class="option-status">{{ item.status }}</span>
                <span class="option-time">{{ item.createTime }}</span>
              </div>
            </template>
          </el-option>
        </el-select>
      </div>
      <el-table
          v-loading="sampleUploadData.loading"
          :data="sampleUploadData.sampleList"
          border
          style="width: 100%"
          :row-key="row => row.id"
      >
        <template v-for="item of TABLE_SHOWN_COLUMNS">
          <el-table-column v-if="item.open" :prop="item.name" :label="item.title">
            <template v-if="item.name === 'date'" #default="scope">
              <div style="display: flex; align-items: center">
                <el-icon><Timer/></el-icon>
                <span style="margin-left: 10px">{{ scope.row.date }}</span>
              </div>
            </template>
            <template v-if="item.name === 'status'" #default="scope">
              <div style="display: flex; align-items: center">
                <el-tag :type="scope.row.status.color">{{ scope.row.status.name }}</el-tag>
              </div>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <el-pagination
          background
          layout="prev, pager, next, sizes, total"
          :page-sizes="[10, 20, 50, 100]"
          :total="sampleUploadData.pagination.total"
          v-model:current-page="sampleUploadData.pagination.pageNum"
          v-model:page-size="sampleUploadData.pagination.pageSize"
          @current-change="fetchSampleList"
          @size-change="handleSizeChange"
      />
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
@use '../../assets/css/sample-upload';
</style>