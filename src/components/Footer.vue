<template>
  <el-footer class="footer">
    <div class="footer-content">
      <span>© 2023 FAS 版权所有</span>
      <span>技术支持：XXX公司</span>
    </div>
  </el-footer>
</template>

<script>
export default {
  name: 'FooterComponent'
}
</script>

<style scoped>
.footer {
  height: 60px;
  background-color: #eef2f7;
  text-align: center;
  padding: 15px 0;
}

.footer-content {
  margin: 0 auto;
  max-width: 1200px;
  color: #606266;
  font-size: 14px;
}
</style>