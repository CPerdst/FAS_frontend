<template>
  <RouterView></RouterView>
</template>

<script>
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
import Dashboard from "./components/Dashboard.vue";
import {RouterView, RouterLink} from "vue-router";

export default {
  name: 'App',
  components: {
    Login,
    Register,
    IndexPage: Dashboard,
    RouterView,
    RouterLink
  }
}
</script>
