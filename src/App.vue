<template>
  <RouterView></RouterView>
<!--  <Footer v-if="$route.meta.showFooter" />-->
</template>

<script>
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
import Dashboard from "./components/Dashboard.vue";
import Footer from "./components/Footer.vue";
import {RouterView, RouterLink} from "vue-router";

export default {
  name: 'App',
  components: {
    Login,
    Register,
    IndexPage: Dashboard,
    RouterView,
    RouterLink,
    Footer
  }
}
</script>
