<script setup>

import {
  onMounted,
  reactive
} from "vue";

import {UploadFilled} from "@element-plus/icons-vue";
import {addPropsToJsonPanel} from "../../utils/common_utils";

const sampleUploadData = reactive({
  fileList: []
});

function beforeUpload() {

}

function handleSuccess() {

}

function handleRemove() {

}

function handleChange() {

}

function handlePreview() {

}

function handleExceed() {

}

function submitUpload() {

}

onMounted(() => {
  // 添加样本上传数据到json面板
  addPropsToJsonPanel('fileList', {});
})

</script>

<template>
  <div class="enhanced-upload">
    <el-card shadow="hover" class="upload-card">
      <el-form class="upload-form">
        <el-upload
          class="upload-demo"
          drag
          :http-request="handleHttpRequest"
          :auto-upload="false"
          :before-upload="beforeUpload"
          :on-success="handleSuccess"
          :on-remove="handleRemove"
          :on-change="handleChange"
          :on-preview="handlePreview"
          :limit="3"
          :on-exceed="handleExceed"
          :file-list="sampleUploadData.fileList"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            拖拽样本文件或者 <em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              支持所有小于50MB的文件
            </div>
          </template>

        </el-upload>
        <el-button class="submit-button" type="primary" @click="submitUpload">提交</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
@use '../../assets/css/sample-upload';
</style>