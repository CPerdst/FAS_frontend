<!--<template>-->
<!--  <el-footer class="footer">-->
<!--    <div class="footer-content">-->
<!--      <span>© 2023 FAS 版权所有</span>-->
<!--      <span>技术支持：XXX公司</span>-->
<!--    </div>-->
<!--  </el-footer>-->
<!--</template>-->

<!--<script>-->
<!--export default {-->
<!--  name: 'FooterComponent'-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->
<!--.footer {-->
<!--  height: 60px;-->
<!--  background-color: #eef2f7;-->
<!--  text-align: center;-->
<!--  padding: 15px 0;-->
<!--}-->

<!--.footer-content {-->
<!--  margin: 0 auto;-->
<!--  max-width: 1200px;-->
<!--  color: #606266;-->
<!--  font-size: 14px;-->
<!--}-->
<!--</style>-->

<template>
  <footer :class="['app-footer', customClass]">
    <div class="footer-content">
      <p>&copy; {{ year }} By {{ author }}</p>
      <div v-if="socialLinks.length > 0" class="social-links">
        <a v-for="link in socialLinks" :key="link.href" :href="link.href" :target="link.target" class="social-link">
          {{ link.text }}
        </a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "AppFooter",
  props: {
    author: {
      type: String,
      default: "匿名作者"
    },
    socialLinks: {
      type: Array,
      default: () => []
    },
    customClass: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      year: new Date().getFullYear()
    };
  }
};
</script>

<style scoped>
.app-footer {
  background-color: #f5f7fa;
  padding: 20px;
  text-align: center;
  border-top: 1px solid #e4e7ed;
  margin-top: 20px;
}

.footer-content {
  max-width: 600px;
  margin: 0 auto;
}

/* 社交链接样式 */
.social-links {
  margin-top: 10px;
  font-size: 13px;
  display: flex;
  justify-content: center;
  gap: 15px;
}

.social-link {
  color: #409EFF;
  text-decoration: none;
}

.social-link:hover {
  text-decoration: underline;
}
</style>