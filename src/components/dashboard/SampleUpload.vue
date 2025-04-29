<template>
  <div class="enhanced-upload">
    <div class="main-container">
      <!-- 上传表单区域 -->
      <el-card shadow="hover" class="upload-card">
        <el-form class="upload-form">
          <div class="upload-header">
            <h2>文件上传</h2>
            <el-tag type="info">最大50MB</el-tag>
          </div>

          <el-upload
              ref="upload"
              :http-request="handleHttpRequest"
              :file-list="fileList"
              :auto-upload="false"
              :limit="Infinity"
              :on-exceed="handleExceed"
              :before-upload="beforeUpload"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              multiple
              drag
              class="enhanced-uploader"
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
                <span class="file-name">{{ file.name }}</span>
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

          <el-button
              type="primary"
              class="submit-button"
              @click="submitUpload"
          >
            <el-icon class="mr-1"><upload /></el-icon>
            开始上传
          </el-button>
        </el-form>
      </el-card>

      <!-- 上传记录表格 -->
      <el-card shadow="hover" class="table-card">
        <div class="table-header">
          <h3>上传记录</h3>
          <el-select
              v-model="shownColumns"
              multiple
              collapse-tags
              style="width: 240px"
          >
            <el-option
                v-for="col in columns"
                :key="col.value"
                :label="col.label"
                :value="col.value"
            />
          </el-select>
        </div>

        <el-table
            :data="sampleList"
            height="400"
            stripe
            v-loading="loading"
            style="width: 100%"
        >
          <el-table-column
              v-if="shownColumns.includes('name')"
              prop="name"
              label="文件名称"
              min-width="180"
          />
          <el-table-column
              v-if="shownColumns.includes('size')"
              prop="size"
              label="文件大小"
              width="120"
          >
            <template #default="{ row }">
              {{ formatSize(row.size) }}
            </template>
          </el-table-column>
          <el-table-column
              v-if="shownColumns.includes('status')"
              prop="status"
              label="检测状态"
              width="140"
          >
            <template #default="{ row }">
              <el-tag :type="statusTagType(row.status)">
                {{ statusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
              v-if="shownColumns.includes('uploadTime')"
              prop="uploadTime"
              label="上传时间"
              width="180"
          />
          <el-table-column
              v-if="shownColumns.includes('hash')"
              prop="hash"
              label="文件哈希"
              min-width="240"
          />
        </el-table>
        <el-pagination
            background
            layout="prev, pager, next, sizes, total"
            :page-sizes="[10, 20, 50, 100]"
            :total="pagination.total"
            v-model:current-page="pagination.pageNum"
            v-model:page-size="pagination.pageSize"
            @current-change="fetchSampleList"
            @size-change="handleSizeChange"
        />
      </el-card>
    </div>
  </div>
</template>

<script>
import { UploadFilled, Upload } from '@element-plus/icons-vue'
import apiClient from "../../utils/asiox_instance";
import {getStatusName} from "../../utils/common_utils";

export default {
  name: 'EnhancedUpload',
  data() {
    return {
      fileList: [],
      uploadedFiles: [],
      shownColumns: ['name', 'size', 'status', 'uploadTime', 'hash'],
      columns: [
        { label: '文件名称', value: 'name' },
        { label: '文件大小', value: 'size' },
        { label: '检测状态', value: 'status' },
        { label: '上传时间', value: 'uploadTime' },
        { label: '文件哈希', value: 'hash' }
      ],
      uploadQueue: [],
      isUploading: false,
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      sampleList: [], // 替换原来的uploadedFiles
      loading: false
    }
  },
  mounted() {
    this.fetchSampleList();
  },
  methods: {
    handleSizeChange(newSize) {
      this.pagination.pageSize = newSize;
      this.fetchSampleList();
    },
    async fetchSampleList() {

        const UPDATE_SAMPLE_URL = import.meta.env.VITE_BASE_URL + '/api/file/sample/list';
        this.loading = true;
        const response = await apiClient.get(UPDATE_SAMPLE_URL, {
          params: {
            pageNum: this.pagination.pageNum,
            pageSize: this.pagination.pageSize
          }
        });

        this.sampleList = response.data.data.list;
        this.pagination.total = response.data.data.total;
        console.log(JSON.stringify(response.data.data, null, 2))

        // 转换数据格式适配表格
        this.sampleList = this.sampleList.map(item => ({
          name: item.filename,
          size: item.fileSize,
          status: getStatusName(item.status),
          createTime: item.createTime,
          hash: item.fileMd5
        }));

      this.loading = false;
    },
    // 新增上传处理方法
    async handleHttpRequest(options) {
      this.uploadQueue.push(options);
      await this.processUploadQueue();
    },
    async processUploadQueue() {
      if (this.isUploading || this.uploadQueue.length === 0) return;

      this.isUploading = true;
      const currentOptions = this.uploadQueue.shift();

      try {
        const UPDATE_SAMPLE_URL = import.meta.env.VITE_BASE_URL + '/api/file/sample/upload';
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
        this.isUploading = false;
        this.processUploadQueue();
      }
    },
    beforeUpload(rawFile) {
      const MAX_SIZE = 50 * 1024 * 1024 // 50MB
      if (rawFile.size > MAX_SIZE) {
        this.$message.error('文件大小超过50MB限制')
        return false
      }
      return true
    },
    handleSuccess(res, file) {
      // 上传成功后刷新列表
      this.fetchSampleList();

      // 保留本地记录（可选）
      this.uploadedFiles.unshift({
        name: file.name,
        size: file.size,
        status: res.status || 'pending',
        uploadTime: new Date().toLocaleString(),
        hash: res.hash || '计算中...'
      });
    },
    statusTagType(status) {
      const map = {
        pending: 'info',
        processing: '',
        completed: 'success',
        error: 'danger'
      }
      return map[status] || ''
    },
    statusText(status) {
      const map = {
        pending: '待检测',
        processing: '检测中',
        completed: '已完成',
        error: '检测失败'
      }
      return map[status] || '未知状态'
    },
    formatSize(size) {
      const units = ['B', 'KB', 'MB', 'GB']
      let unitIndex = 0
      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024
        unitIndex++
      }
      return `${size.toFixed(2)} ${units[unitIndex]}`
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    handleExceed() {
      this.$message.warning('文件数量超出限制')
    },
    submitUpload() {
      this.fileList.forEach(file => {
        if (file.status !== 'success') {
          file.status = 'ready';
        }
      });
      this.$refs.upload.submit();
    },
  }
}
</script>

<style scoped>
.enhanced-upload {
  padding: 0 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.breadcrumb {
  margin-bottom: 24px;
}

.upload-card {
  margin-bottom: 24px;
  border-radius: 12px;
}

.upload-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.enhanced-uploader {
  :deep(.el-upload-dragger) {
    padding: 40px 20px;
    border-radius: 12px;
    border: 2px dashed var(--el-border-color);
    transition: border-color 0.3s;

    &:hover {
      border-color: var(--el-color-primary);
    }
  }
}

.upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.upload-icon {
  color: var(--el-color-primary);
  margin-bottom: 12px;
}

.upload-text {
  text-align: center;

  .main-text {
    font-size: 16px;
    color: var(--el-text-color-primary);
    margin: 4px 0;
  }

  .sub-text {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}

.file-item {
  position: relative;
  padding: 12px;
  margin: 8px 0;
  background: var(--el-fill-color-light);
  border-radius: 8px;

  .file-name {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .file-size {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  .el-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
}

.submit-button {
  width: 100%;
  margin-top: 20px;
  height: 48px;
  font-size: 16px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-card {
  border-radius: 12px;

  :deep(.el-table) {
    --el-table-border-color: transparent;

    th {
      background: var(--el-fill-color-light);
    }
  }
}

.el-pagination {
  margin-top: 20px;
  justify-content: flex-end;
}
</style>