<template>
  <div class="sample-upload">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>样本上传</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 主容器 -->
    <div class="main-container">
      <!-- 上区域：上传组件 -->
      <div class="upload-section">
        <el-card shadow="hover" class="upload-card">
          <h2 class="upload-title">上传样本</h2>
          <el-upload
              ref="upload"
              action="https://jsonplaceholder.typicode.com/posts/"
              :file-list="fileList"
              :on-remove="handleRemove"
              :on-preview="handlePreview"
              :on-success="handleSuccess"
              :on-exceed="handleExceed"
              :before-upload="beforeUpload"
              :limit="Infinity"
              multiple
              :auto-upload="false"
              drag
              accept=".jpg,.jpeg,.png"
          >
            <i class="el-icon-upload"></i>
            <div class="upload-text">将文件拖到此处，或<em>点击上传</em></div>
            <template #tip>
              <div class="el-upload__tip">
                只能上传 JPG/PNG 格式的图片，且不超过 2MB
              </div>
            </template>
          </el-upload>
          <el-button type="success" @click="submitUpload" class="upload-button">
            上传到服务器
          </el-button>
        </el-card>
      </div>

      <!-- 下区域：展示上传成功的样本信息 -->
      <div class="samples-section">
        <el-card shadow="hover" class="samples-card">
          <h2 class="samples-title">已上传样本</h2>
          <el-scrollbar style="height: 100%;">
            <div v-if="uploadedFiles.length === 0" class="no-data">暂无上传的样本</div>
            <el-card
                v-for="(file, index) in uploadedFiles"
                :key="index"
                class="sample-item"
                shadow="never"
            >
              <div class="sample-info">
                <span class="sample-name">{{ file.name }}</span>
                <span class="sample-size">{{ formatSize(file.size) }}</span>
              </div>
              <span class="sample-preview">
                <img
                    v-if="file.type.startsWith('image/')"
                    :src="file.url"
                    alt="Preview"
                    class="preview-image"
                />
                <i v-else class="el-icon-picture-outline"></i>
              </span>
            </el-card>
          </el-scrollbar>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { ElMessage, ElBreadcrumb, ElBreadcrumbItem, ElCard, ElButton, ElIcon } from 'element-plus';
import { UploadFilled, Picture, Document } from '@element-plus/icons-vue';

export default {
  name: 'SampleUpload',
  components: {
    ElBreadcrumb,
    ElBreadcrumbItem,
    ElCard,
    ElButton,
    ElIcon
  },
  setup() {
    return {
      UploadFilled,
      Picture,
      Document
    };
  },
  data() {
    return {
      fileList: [],
      uploadedFiles: []
    };
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.fileList = fileList;
      // 从已上传列表中移除
      this.uploadedFiles = this.uploadedFiles.filter(f => f.uid !== file.uid);
    },
    handlePreview(file) {
      console.log(file);
      // 可在此处添加预览逻辑，例如弹出模态框显示图片
    },
    handleSuccess(response, file, fileList) {
      ElMessage.success('文件上传成功');
      // 添加到已上传列表
      this.uploadedFiles.push({
        uid: file.uid,
        name: file.name,
        size: file.size,
        url: response.url || 'https://via.placeholder.com/150', // 替换为实际上传后的URL
        type: file.raw.type
      });
    },
    handleExceed(files, fileList) {
      ElMessage.warning(`当前限制选择无限个文件，本次选择了 ${files.length} 个文件`);
    },
    beforeUpload(rawFile) {
      const isImage = rawFile.type === 'image/jpeg' || rawFile.type === 'image/png';
      const isLt2M = rawFile.size / 1024 / 1024 < 2;

      if (!isImage) {
        ElMessage.error('只能上传 JPG 或 PNG 格式的图片!');
      }
      if (!isLt2M) {
        ElMessage.error('上传文件大小不能超过 2MB!');
      }

      return isImage && isLt2M;
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    formatSize(size) {
      const units = ['B', 'KB', 'MB', 'GB'];
      let unitIndex = 0;
      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
      }
      return `${size.toFixed(2)} ${units[unitIndex]}`;
    }
  }
};
</script>

<style scoped>
.sample-upload {
  padding: 20px;
}

.breadcrumb {
  margin-bottom: 20px;
  font-size: 18px;
}

.main-container {
  display: flex;
  flex-direction: column; /* 垂直排列 */
  gap: 20px; /* 区域之间的间距 */
}

/* 上区域：上传组件 */
.upload-section {
  flex: 1;
  min-width: 100%;
}

.upload-card {
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.upload-title {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.upload-button {
  width: 100%;
  margin-top: 20px;
}

/* 下区域：展示上传成功的样本信息 */
.samples-section {
  flex: 1;
  min-width: 100%;
}

.samples-card {
  height: 100%;
  overflow: hidden;
}

.samples-title {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.no-data {
  text-align: center;
  color: #999;
  font-size: 16px;
  margin-top: 20px;
}

.sample-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.3s;
}

.sample-item:hover {
  background-color: #fafafa;
}

.sample-info {
  flex: 1;
}

.sample-name {
  font-size: 16px;
  color: #555;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sample-size {
  font-size: 14px;
  color: #888;
  margin-left: 10px;
}

.sample-preview {
  width: 80px;
  text-align: center;
}

.preview-image {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

/* 样式调整和响应式设计 */
@media (max-width: 768px) {
  .sample-item {
    flex-direction: column;
    text-align: center;
  }

  .sample-preview {
    margin-top: 10px;
    width: 100%;
    max-width: 150px;
  }
}
</style>